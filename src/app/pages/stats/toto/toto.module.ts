import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {TotoStatsPageRoutingModule} from './toto-routing.module';

import {TotoPage} from './toto.page';
import {MenuToolbarModule} from '../../../components/menu-toolbar/menu-toolbar.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TotoStatsPageRoutingModule,
        MenuToolbarModule
    ],
    declarations: [TotoPage]
})
export class TotoStatsPageModule {
}
