import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IdVsPageRoutingModule } from './id-vs-routing.module';

import { IdVsPage } from './id-vs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IdVsPageRoutingModule,
    IdVsPage
  ],
  declarations: []
})
export class IdVsPageModule {}
