package com.zosh.util;

import com.zosh.domain.USER_ROLE;
import com.zosh.exception.UserException;
import com.zosh.model.User;
import com.zosh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminAuthHelper {

    private final UserService userService;

    public User requireAdmin(String jwt) throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        if (user.getRole() != USER_ROLE.ROLE_ADMIN) {
            throw new UserException("Admin access required");
        }
        return user;
    }
}
