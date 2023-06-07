package com.reactnativewithcustomjavademo.Bleu;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.bleu.merchant.sdk.BleuMerchantSdk;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class BleuModule extends ReactContextBaseJavaModule {
    public BleuModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    BleuMerchantSdk bleuMerchantSdk;

    @NonNull
    @Override
    public String getName() {
        return "Bleu";
    }

    @ReactMethod
    public void sayHello(String name, Callback cb) {
        try {
            String message = "Hello " + name;
            cb.invoke(null, message);
        } catch (Exception e) {
            cb.invoke(e, null);
        }

    }
}
