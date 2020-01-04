package com.example.myapplication;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends AppCompatActivity {

  private WebView webView;
  private WebSettings WebSettings;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    WebView myWebView = (WebView) findViewById(R.id.webview);

    WebSettings webSettings = myWebView.getSettings();
    webSettings.setJavaScriptEnabled(true);


    myWebView.loadUrl("https://multastransito-92d53.web.app/");
  }
}
