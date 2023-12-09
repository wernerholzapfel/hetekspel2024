import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';


import {MenuToolbarModule} from '../../components/menu-toolbar/menu-toolbar.module';
import { ProfilePage } from './profile.page';
import { ProfilePageRoutingModule } from './profile-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProfilePageRoutingModule,
        MenuToolbarModule
    ],
    declarations: [ProfilePage]
})
export class ProfilePageModule {
}
