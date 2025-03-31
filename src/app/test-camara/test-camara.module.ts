import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestCamaraPageRoutingModule } from './test-camara-routing.module';

import { TestCamaraPage } from './test-camara.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestCamaraPageRoutingModule
  ],
  declarations: [TestCamaraPage]
})
export class TestCamaraPageModule {}
