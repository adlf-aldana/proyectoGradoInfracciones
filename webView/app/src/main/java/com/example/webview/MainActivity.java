package com.example.webview;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends AppCompatActivity {

  public WebView webView;
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    webView = (WebView) findViewById(R.id.paginaWeb);
    webView.setWebViewClient(new WebViewClient());
    webView.loadUrl("http://www.google.com");

  }
}
