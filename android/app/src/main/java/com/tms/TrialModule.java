package com.tms;

import android.support.v4.app.NotificationCompat;
import android.support.v4.app.NotificationManagerCompat;
import android.widget.Toast;
import android.app.Application;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.app.PendingIntent;
import android.media.RingtoneManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.util.HashMap;
import java.util.Map;
import android.R.drawable;

public class TrialModule extends ReactContextBaseJavaModule {

        private Context reactContext;

    public TrialModule(ReactApplicationContext reactContext) {

        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "TrialModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        return constants;
    }

    @ReactMethod
    public void doSomething(String message,Promise promise){
        try {
            if(message != "Gay") {
               promise.resolve("Not Gay");
            }else {
                promise.reject("GAY!");
            }
        }catch (Exception e){
            promise.reject(e.getMessage());
        }
    }

}