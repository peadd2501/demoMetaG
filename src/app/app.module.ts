import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CamaraAcuerdoVideoComponent } from './camara-acuerdo-video/camara-acuerdo-video.component';
import { SimpleAcuerdoVideoComponent } from './simple-acuerdo-video/simple-acuerdo-video.component';
import { CustomLoadingComponent } from './custom-loading/custom-loading.component';

@NgModule({
  declarations: [AppComponent, CamaraAcuerdoVideoComponent, SimpleAcuerdoVideoComponent, CustomLoadingComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
