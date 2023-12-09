import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ParticipantListPageRoutingModule} from './participant-list-routing.module';

import {ParticipantListPage} from './participant-list.page';
import {MenuToolbarModule} from '../../components/menu-toolbar/menu-toolbar.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ParticipantListPageRoutingModule,
        MenuToolbarModule
    ],
    declarations: [ParticipantListPage]
})
export class ParticipantListPageModule {
}
