import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TextToSpechPage } from './text-to-spech.page';

const routes: Routes = [
  {
    path: '',
    component: TextToSpechPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TextToSpechPageRoutingModule {}
