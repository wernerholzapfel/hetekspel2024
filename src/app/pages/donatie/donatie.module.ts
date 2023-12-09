import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import {MenuToolbarModule} from '../../components/menu-toolbar/menu-toolbar.module';
import { DonatiePage } from './donatie.page';
import { DonatiePageRoutingModule } from './donatie-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DonatiePageRoutingModule,
        MenuToolbarModule
    ],
  declarations: [DonatiePage]
})
export class DonatiePageModule {}
