import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpelregelsPage } from './spelregels.page';

const routes: Routes = [
  {
    path: '',
    component: SpelregelsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpelregelsPageRoutingModule {}
