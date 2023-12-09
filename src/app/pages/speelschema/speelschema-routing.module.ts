import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpeelschemaPage } from './speelschema.page';

const routes: Routes = [
  {
    path: '',
    component: SpeelschemaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpeelschemaPageRoutingModule {}
