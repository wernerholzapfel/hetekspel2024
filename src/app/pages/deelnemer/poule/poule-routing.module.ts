import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoulePage } from './poule.page';

const routes: Routes = [
  {
    path: '',
    component: PoulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoulePageRoutingModule {}
