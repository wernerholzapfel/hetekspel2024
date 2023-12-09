import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PoulePageRoutingModule } from './poule-routing.module';

import { PoulePage } from './poule.page';
import {CustomComponentsModule} from '../../../components/custom-components/custom-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PoulePageRoutingModule,
        CustomComponentsModule
    ],
  declarations: [PoulePage]
})
export class PoulePageModule {}
