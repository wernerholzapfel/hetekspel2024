import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KnockoutPage } from './knockout.page';
import {CanDeactivateGuard} from '../../../guards/candeactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: KnockoutPage,
    canDeactivate: [CanDeactivateGuard]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KnockoutPageRoutingModule {}
