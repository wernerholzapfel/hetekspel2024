import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoulePage } from './poule.page';
import {CanDeactivateGuard} from '../../../guards/candeactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: PoulePage,
    canDeactivate: [CanDeactivateGuard]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoulePageRoutingModule {}
