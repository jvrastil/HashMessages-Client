import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AdsenseModule } from 'ng2-adsense';

import { ApiInterceptor } from './services/apiInterceptor/api-interceptor';

import { MaterialModule } from './modules/material.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewMessageComponent } from './components/new-message/new-message.component';

import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { LogoComponent } from './components/logo/logo.component';

@NgModule({
  declarations: [AppComponent, DashboardComponent, NewMessageComponent, LogoComponent],
  imports: [
    AdsenseModule.forRoot({
      adClient: 'ca-pub-7990836138695617',
      pageLevelAds: true,
    }),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
    { provide: 'BASE_API_URL', useValue: environment.apiUrl },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
