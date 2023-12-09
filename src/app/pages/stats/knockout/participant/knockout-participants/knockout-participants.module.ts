import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {KnockoutParticipantsPageRoutingModule} from './knockout-participants-routing.module';

import {KnockoutParticipantsPage} from './knockout-participants.page';
import {MenuToolbarModule} from '../../../../../components/menu-toolbar/menu-toolbar.module';
import {CustomComponentsModule} from '../../../../../components/custom-components/custom-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KnockoutParticipantsPageRoutingModule,
    MenuToolbarModule,
    CustomComponentsModule
  ],
  declarations: [KnockoutParticipantsPage]
})
export class KnockoutParticipantsPageModule {
}
