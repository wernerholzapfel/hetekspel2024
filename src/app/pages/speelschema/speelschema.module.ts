import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import {MenuToolbarModule} from '../../components/menu-toolbar/menu-toolbar.module';
import { SpeelschemaPage } from './speelschema.page';
import { SpeelschemaPageRoutingModule } from './speelschema-routing.module';
import { CustomComponentsModule } from 'src/app/components/custom-components/custom-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SpeelschemaPageRoutingModule,
        MenuToolbarModule,
        CustomComponentsModule
    ],
  declarations: [SpeelschemaPage]
})
export class SpeelschemaPageModule {}
