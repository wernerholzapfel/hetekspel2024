import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KnockoutPage } from './knockout.page';

const routes: Routes = [
  {
    path: '',
    component: KnockoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KnockoutPageRoutingModule {}
