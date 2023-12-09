import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DisclaimerPage} from './disclaimer.page';

const routes: Routes = [
  {
    path: '',
    component: DisclaimerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisclaimerPageRoutingModule {
}
