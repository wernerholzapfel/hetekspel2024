import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {KnockoutStatsPageRoutingModule} from './knockout-routing.module';

import {KnockoutPage} from './knockout.page';
import {CustomComponentsModule} from '../../../components/custom-components/custom-components.module';
import {MenuToolbarModule} from '../../../components/menu-toolbar/menu-toolbar.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        KnockoutStatsPageRoutingModule,
        CustomComponentsModule,
        MenuToolbarModule
    ],
    declarations: [KnockoutPage]
})
export class KnockoutStatsPageModule {
}
