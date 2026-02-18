import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';   // ← nom correct (avec .module)
import { App } from './app';           // ← AppComponent (pas App)

@NgModule({
  declarations: [
    App   // ← seul composant racine à déclarer ici
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule { }