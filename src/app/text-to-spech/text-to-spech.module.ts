import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TextToSpechPageRoutingModule } from './text-to-spech-routing.module';

import { TextToSpechPage } from './text-to-spech.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TextToSpechPageRoutingModule
  ],
  declarations: [TextToSpechPage]
})
export class TextToSpechPageModule {}
