package com.shhbox.security;

import javax.crypto.*;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.security.SecureRandom;

public class EncryptionUtil {

    private static final String AES = "AES";
    private static final byte[] SECRET_KEY_BYTES = "supersecretkey12".getBytes(); // 16 bájt (128 bit)

    private static SecretKey getSecretKey() {
        return new SecretKeySpec(SECRET_KEY_BYTES, AES);
    }

    public static void encrypt(InputStream in, OutputStream out) throws IOException {
        try {
            Cipher cipher = Cipher.getInstance(AES);
            cipher.init(Cipher.ENCRYPT_MODE, getSecretKey());
            try (CipherOutputStream cipherOut = new CipherOutputStream(out, cipher)) {
                in.transferTo(cipherOut);
            }
        } catch (Exception e) {
            throw new IOException("Encryption failed", e);
        }
    }

    public static void decrypt(InputStream in, OutputStream out) throws IOException {
        try {
            Cipher cipher = Cipher.getInstance(AES);
            cipher.init(Cipher.DECRYPT_MODE, getSecretKey());
            try (CipherInputStream cipherIn = new CipherInputStream(in, cipher)) {
                cipherIn.transferTo(out);
            }
        } catch (Exception e) {
            throw new IOException("Decryption failed", e);
        }
    }
}
