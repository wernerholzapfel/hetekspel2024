import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {MijnStandPageRoutingModule} from './mijn-stand-routing.module';

import {MijnStandPage} from './mijn-stand.page';
import {MenuToolbarModule} from '../../components/menu-toolbar/menu-toolbar.module';
import {CustomComponentsModule} from '../../components/custom-components/custom-components.module';
import {SelectDeelnemersModalComponent} from './select-deelnemers-modal/select-deelnemers-modal.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MijnStandPageRoutingModule,
        MenuToolbarModule,
        CustomComponentsModule
    ],
    declarations: [MijnStandPage, SelectDeelnemersModalComponent]
})
export class MijnStandPageModule {}
