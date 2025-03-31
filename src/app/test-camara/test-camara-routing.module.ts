import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestCamaraPage } from './test-camara.page';

const routes: Routes = [
  {
    path: '',
    component: TestCamaraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestCamaraPageRoutingModule {}
