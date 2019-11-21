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

import java.util.HashMap;
import java.util.Map;
import android.R.drawable;

public class AlarmNotificationModule extends ReactContextBaseJavaModule {

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";
    private Context reactContext;

    public AlarmNotificationModule(ReactApplicationContext reactContext) {

        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "AlarmNotification";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }

    @ReactMethod
    public void show(String message,int duration){
        Toast.makeText(getReactApplicationContext(),message,duration).show();
    }

    @ReactMethod
    public void showNotification(String message){
        // Create an explicit intent for an Activity in your app
        Intent intent = new Intent(this.reactContext, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        PendingIntent pendingIntent = PendingIntent.getActivity(this.reactContext, 0, intent, 0);


        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(reactContext, "train_alarm")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("Your Journey")
                .setContentText(message)
                .setContentIntent(pendingIntent)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setPriority(NotificationCompat.PRIORITY_LOW);

        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(reactContext);

        // notificationId is a unique int for each notification that you must define
        notificationManager.notify(123, mBuilder.build());
    }

    @ReactMethod
    public void showAlarmNotification(){

        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(reactContext);
        notificationManager.cancel(123);
        // Create an explicit intent for an Activity in your app
        Intent intent = new Intent(this.reactContext, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        PendingIntent pendingIntent = PendingIntent.getActivity(this.reactContext, 0, intent, 0);

        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(reactContext, "alarm_notif")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("Your Journey")
                .setContentText("Youre here!")
                .setContentIntent(pendingIntent)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM))
                .setPriority(NotificationCompat.PRIORITY_LOW);

        // notificationId is a unique int for each notification that you must define
        notificationManager.notify(456, mBuilder.build());
    }

    @ReactMethod
    public void cancelNotification(){
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(reactContext);
        notificationManager.cancel(123);
        notificationManager.cancel(456);
    }

}