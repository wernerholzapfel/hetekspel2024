import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ParticipantListPage} from './participant-list.page';

const routes: Routes = [
  {
    path: '',
    component: ParticipantListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParticipantListPageRoutingModule {
}
