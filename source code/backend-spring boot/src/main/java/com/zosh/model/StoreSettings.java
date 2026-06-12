package com.zosh.model;

import com.zosh.domain.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String storeName = "Hukum";

    private String storeLogo;

    private String contactNumber;

    private String supportEmail;

    private String facebookUrl;

    private String instagramUrl;

    private String twitterUrl;

    private String youtubeUrl;

    private boolean razorpayEnabled = true;

    private String razorpayKey;

    private String razorpaySecret;

    private boolean stripeEnabled = true;

    private String stripeKey;

    private String smtpHost;

    private int smtpPort;

    private String smtpUsername;

    private String smtpPassword;

    private boolean smtpEnabled;
}
