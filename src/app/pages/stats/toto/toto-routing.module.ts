import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {TotoPage} from './toto.page';

const routes: Routes = [
  {
    path: '',
    component: TotoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TotoStatsPageRoutingModule {
}
