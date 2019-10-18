import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { Camera } from '@ionic-native/camera/ngx';//import in app.module.ts
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), 
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyDxPjj1BFTbRBEn3J6K2zU-8pXPcz0un20",
      databaseURL: "https://eiso-hug.firebaseio.com",
      projectId: "eiso-hug",
      storageBucket: "eiso-hug.appspot.com"
    }),
    AngularFireDatabaseModule,
    AppRoutingModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
     Camera //here
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
