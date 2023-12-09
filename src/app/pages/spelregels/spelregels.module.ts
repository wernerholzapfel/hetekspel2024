import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpelregelsPageRoutingModule } from './spelregels-routing.module';

import { SpelregelsPage } from './spelregels.page';
import {MenuToolbarModule} from '../../components/menu-toolbar/menu-toolbar.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SpelregelsPageRoutingModule,
        MenuToolbarModule
    ],
  declarations: [SpelregelsPage]
})
export class SpelregelsPageModule {}
