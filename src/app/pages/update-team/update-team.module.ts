import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {UpdateTeamPageRoutingModule} from './update-team-routing.module';

import {UpdateTeamPage} from './update-team.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateTeamPageRoutingModule
  ],
  declarations: [UpdateTeamPage]
})
export class UpdateTeamPageModule {
}
