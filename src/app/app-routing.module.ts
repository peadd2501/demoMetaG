import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'id-vs',
    loadChildren: () => import('./id-vs/id-vs.module').then( m => m.IdVsPageModule)
  },
  {
    path: 'text-to-spech',
    loadChildren: () => import('./text-to-spech/text-to-spech.module').then( m => m.TextToSpechPageModule)
  },
  {
    path: 'test-camara',
    loadChildren: () => import('./test-camara/test-camara.module').then( m => m.TestCamaraPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
