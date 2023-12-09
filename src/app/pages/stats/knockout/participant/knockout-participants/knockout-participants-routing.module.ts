import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {KnockoutParticipantsPage} from './knockout-participants.page';

const routes: Routes = [
  {
    path: '',
    component: KnockoutParticipantsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KnockoutParticipantsPageRoutingModule {
}
