package com.reactnativewithcustomjavademo;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class HelloWorldModule extends ReactContextBaseJavaModule {
    public HelloWorldModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "HelloWorld";
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
