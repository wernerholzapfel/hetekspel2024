import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';


import {StatsPage} from './stats.page';
import {MenuToolbarModule} from '../../components/menu-toolbar/menu-toolbar.module';
import {StatsPageRoutingModule} from './stats-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        StatsPageRoutingModule,
        MenuToolbarModule
    ],
    declarations: [StatsPage]
})
export class StatsPageModule {
}
