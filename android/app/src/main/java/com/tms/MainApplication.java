package com.tms;

import android.app.Application;
import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.media.RingtoneManager;
import android.net.Uri;
import android.media.AudioAttributes;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.mapbox.rctmgl.RCTMGLPackage;
import com.tms.CustomToastPackage;
import com.tms.AlarmNotificationPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RCTMGLPackage(),
          new CustomToastPackage(),
          new AlarmNotificationPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    createNotificationChannel();

  }

  private void createNotificationChannel() {
    // Create the NotificationChannel, but only on API 26+ because
    // the NotificationChannel class is new and not in the support library
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      CharSequence name = "train_alarm";
      String description = "Alarm Notif for Station App";
      Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
      AudioAttributes attributes = new AudioAttributes.Builder()
              .setUsage(AudioAttributes.USAGE_NOTIFICATION)
              .build();


      int importance = NotificationManager.IMPORTANCE_LOW;
      NotificationChannel channel = new NotificationChannel("train_alarm", name, importance);
      channel.setDescription(description);
      NotificationChannel alarmChannel = new NotificationChannel("alarm_notif", "alarm_notif", NotificationManager.IMPORTANCE_HIGH);
      alarmChannel.setDescription(description);
      alarmChannel.enableVibration(true);
      alarmChannel.setSound(soundUri,attributes);
      alarmChannel.setVibrationPattern(new long[]{100, 200, 300, 400, 500, 400, 300, 200, 400});

      // Register the channel with the system; you can't change the importance
      // or other notification behaviors after this
      NotificationManager notificationManager = getSystemService(NotificationManager.class);
      notificationManager.createNotificationChannel(channel);
      notificationManager.createNotificationChannel(alarmChannel);
    }
  }
}
