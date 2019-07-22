import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AdsenseModule } from 'ng2-adsense';
import { PictureLoaderComponent } from './components/picture-loader/picture-loader.component';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [
    AppComponent,
    PictureLoaderComponent
  ],
  imports: [
    AdsenseModule.forRoot({
      adClient: 'ca-pub-7990836138695617',
      pageLevelAds: true
    }),
    BrowserModule,
    FileUploadModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
