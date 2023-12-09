import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HalloffamePage } from './halloffame.page';

const routes: Routes = [
  {
    path: '',
    component: HalloffamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HalloffamePageRoutingModule {}
