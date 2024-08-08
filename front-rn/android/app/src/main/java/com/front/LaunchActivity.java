package com.kakaovx.birdiesquad.user;
import com.microsoft.codepush.react.CodePush;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

public class LaunchActivity extends Activity {

 @Override
 protected void onCreate(Bundle savedInstanceState) {
   super.onCreate(savedInstanceState);
     MainApplication application = (MainApplication) getApplication();
   // check that MainActivity is not started yet
   if (!application.isActivityInBackStack(MainActivity.class)) {
     Intent intent = new Intent(this, MainActivity.class);
     startActivity(intent);
   }
   finish();
 }
}