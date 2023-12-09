import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {DisclaimerPageRoutingModule} from './disclaimer-routing.module';

import {DisclaimerPage} from './disclaimer.page';
import {MenuToolbarModule} from '../../components/menu-toolbar/menu-toolbar.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DisclaimerPageRoutingModule,
        MenuToolbarModule
    ],
    declarations: [DisclaimerPage]
})
export class DisclaimerPageModule {
}
