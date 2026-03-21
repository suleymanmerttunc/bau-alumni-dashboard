package com.bau.alumni.model.enums;

public enum UserStatus {
    PENDING,   // İlk kayıt olduğunda varsayılan bu olacak
    APPROVED,  // Admin onaylayınca buna dönecek
    REJECTED   // Admin reddedince buna dönecek
}