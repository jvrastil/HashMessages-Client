import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AdsenseModule } from 'ng2-adsense';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AdsenseModule.forRoot({
      adClient: 'ca-pub-7990836138695617',
      pageLevelAds: true
    }),
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
