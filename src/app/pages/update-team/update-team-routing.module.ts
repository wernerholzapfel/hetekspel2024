import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {UpdateTeamPage} from './update-team.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateTeamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateTeamPageRoutingModule {
}
