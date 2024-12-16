import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdVsPage } from './id-vs.page';

const routes: Routes = [
  {
    path: '',
    component: IdVsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdVsPageRoutingModule {}
