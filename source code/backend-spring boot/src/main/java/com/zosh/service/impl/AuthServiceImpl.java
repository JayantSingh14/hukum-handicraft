package com.zosh.service.impl;

import com.zosh.config.JwtProvider;
import com.zosh.domain.USER_ROLE;
import com.zosh.exception.UserException;
import com.zosh.model.Cart;
import com.zosh.model.User;
import com.zosh.model.VerificationCode;
import com.zosh.repository.CartRepository;
import com.zosh.repository.UserRepository;
import com.zosh.repository.VerificationCodeRepository;
import com.zosh.request.GoogleLoginRequest;
import com.zosh.request.LoginRequest;
import com.zosh.request.SignupRequest;
import com.zosh.response.AuthResponse;
import com.zosh.service.AuthService;
import com.zosh.service.EmailService;
import com.zosh.service.UserService;
import com.zosh.utils.OtpUtils;
import org.springframework.beans.factory.annotation.Value;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    @Value("${google.client.id}")
    private String googleClientId;

    private final UserService userService;

    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    private final JwtProvider jwtProvider;
    private final CustomeUserServiceImplementation customUserDetails;
    private final CartRepository cartRepository;
    private final RestTemplate restTemplate;

    @Override
    public void sentLoginOtp(String email) throws UserException, MessagingException {

        String SIGNING_PREFIX = "signing_";

        if (email.startsWith(SIGNING_PREFIX)) {
            email = email.substring(SIGNING_PREFIX.length());
            userService.findUserByEmail(email);
        }

        VerificationCode isExist = verificationCodeRepository
                .findByEmail(email);

        if (isExist != null) {
            verificationCodeRepository.delete(isExist);
        }

        String otp = OtpUtils.generateOTP();

        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setOtp(otp);
        verificationCode.setEmail(email);
        verificationCodeRepository.save(verificationCode);

        String subject = "Hukum Login/Signup Otp";
        String text = "your login otp is - ";
        emailService.sendVerificationOtpEmail(email, otp, subject, text);
    }

    @Override
    public String createUser(SignupRequest req) throws UserException {

        String email = req.getEmail();

        String fullName = req.getFullName();

        String otp = req.getOtp();

        VerificationCode verificationCode = verificationCodeRepository.findByEmail(email);

        if (verificationCode == null || !verificationCode.getOtp().equals(otp)) {
            throw new UserException("wrong otp...");
        }

        User user = userRepository.findByEmail(email);

        if (user == null) {

            User createdUser = new User();
            createdUser.setEmail(email);
            createdUser.setFullName(fullName);
            createdUser.setRole(USER_ROLE.ROLE_CUSTOMER);
            createdUser.setMobile("9083476123");
            createdUser.setPassword(passwordEncoder.encode(otp));

            System.out.println(createdUser);

            user = userRepository.save(createdUser);

            Cart cart = new Cart();
            cart.setUser(user);
            cartRepository.save(cart);
        }

        List<GrantedAuthority> authorities = new ArrayList<>();

        authorities.add(new SimpleGrantedAuthority(
                USER_ROLE.ROLE_CUSTOMER.toString()));

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                email, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return jwtProvider.generateToken(authentication);
    }

    @Override
    public AuthResponse signin(LoginRequest req) throws UserException {

        String username = req.getEmail();
        String otp = req.getOtp();

        System.out.println(username + " ----- " + otp);

        Authentication authentication = authenticate(username, otp);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication);
        AuthResponse authResponse = new AuthResponse();

        authResponse.setMessage("Login Success");
        authResponse.setJwt(token);
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        String roleName = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();

        authResponse.setRole(USER_ROLE.valueOf(roleName));

        User user = userRepository.findByEmail(username);
        if (user != null && cartRepository.findByUserId(user.getId()) == null) {
            Cart cart = new Cart();
            cart.setUser(user);
            cartRepository.save(cart);
        }

        return authResponse;

    }

    private Authentication authenticate(String username, String otp) throws UserException {
        UserDetails userDetails = customUserDetails.loadUserByUsername(username);

        System.out.println("sign in userDetails - " + userDetails);

        if (userDetails == null) {
            System.out.println("sign in userDetails - null ");
            throw new BadCredentialsException("Invalid username or password");
        }
        VerificationCode verificationCode = verificationCodeRepository.findByEmail(username);

        if (verificationCode == null || !verificationCode.getOtp().equals(otp)) {
            throw new UserException("wrong otp...");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    @Override
    @SuppressWarnings("unchecked")
    public AuthResponse googleLogin(GoogleLoginRequest req) throws UserException {
        System.out.println("[GoogleLogin] Received request, token length: " +
                (req.getIdToken() != null ? req.getIdToken().length() : "null"));
        System.out.println("[GoogleLogin] Using client ID: " + googleClientId);

        try {
            // Validate the token using Google's public tokeninfo endpoint
            String tokenInfoUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + req.getIdToken();
            System.out.println("[GoogleLogin] Calling tokeninfo endpoint...");

            Map<String, Object> tokenInfo;
            try {
                tokenInfo = restTemplate.getForObject(tokenInfoUrl, Map.class);
            } catch (Exception httpEx) {
                System.out.println("[GoogleLogin] tokeninfo HTTP call failed: " + httpEx.getMessage());
                throw new UserException("Google token verification failed: " + httpEx.getMessage());
            }

            if (tokenInfo == null) {
                System.out.println("[GoogleLogin] tokeninfo returned null");
                throw new UserException("Google token verification returned empty response");
            }

            System.out.println("[GoogleLogin] tokeninfo response: " + tokenInfo);

            // Verify the audience (aud) matches our client ID
            String aud = (String) tokenInfo.get("aud");
            if (aud == null || !aud.equals(googleClientId)) {
                System.out
                        .println("[GoogleLogin] Audience mismatch! Token aud=" + aud + ", expected=" + googleClientId);
                throw new UserException(
                        "Google token audience mismatch. Expected: " + googleClientId + ", got: " + aud);
            }

            // Check for error field in response
            if (tokenInfo.containsKey("error")) {
                System.out.println("[GoogleLogin] Token error: " + tokenInfo.get("error"));
                throw new UserException("Invalid Google token: " + tokenInfo.get("error"));
            }

            String email = (String) tokenInfo.get("email");
            String name = (String) tokenInfo.get("name");
            String pictureUrl = (String) tokenInfo.get("picture");

            System.out.println("[GoogleLogin] Verified user email=" + email + ", name=" + name);

            if (email == null || email.isEmpty()) {
                throw new UserException("Could not extract email from Google token");
            }

            User user = userRepository.findByEmail(email);
            boolean isNewUser = false;

            if (user == null) {
                System.out.println("[GoogleLogin] Creating new user for email: " + email);
                user = new User();
                user.setEmail(email);
                user.setFullName(name != null ? name : email.split("@")[0]);
                user.setProfileImage(pictureUrl);
                user.setRole(USER_ROLE.ROLE_CUSTOMER);
                user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                user = userRepository.save(user);
                isNewUser = true;
                System.out.println("[GoogleLogin] New user saved with id: " + user.getId());
            } else {
                System.out.println("[GoogleLogin] Existing user found, id: " + user.getId());
                if (pictureUrl != null && !pictureUrl.equals(user.getProfileImage())) {
                    user.setProfileImage(pictureUrl);
                    user = userRepository.save(user);
                }
            }

            if (cartRepository.findByUserId(user.getId()) == null) {
                Cart cart = new Cart();
                cart.setUser(user);
                cartRepository.save(cart);
                System.out.println("[GoogleLogin] Created new cart for user: " + user.getId());
            }

            List<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority(user.getRole().toString()));

            Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = jwtProvider.generateToken(authentication);
            System.out.println("[GoogleLogin] JWT generated successfully");

            AuthResponse authResponse = new AuthResponse();
            authResponse.setJwt(token);
            authResponse.setMessage(isNewUser ? "Register Success" : "Login Success");
            authResponse.setRole(user.getRole());
            return authResponse;

        } catch (UserException ue) {
            System.out.println("[GoogleLogin] UserException: " + ue.getMessage());
            throw ue;
        } catch (Exception e) {
            System.out.println("[GoogleLogin] Unexpected error: " + e.getClass().getName() + " - " + e.getMessage());
            e.printStackTrace();
            throw new UserException("Google Authentication failed: " + e.getMessage());
        }
    }
}
