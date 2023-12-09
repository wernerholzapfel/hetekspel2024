import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeelnemerPageRoutingModule } from './deelnemer-routing.module';

import { DeelnemerPage } from './deelnemer.page';
import {MenuToolbarModule} from '../../components/menu-toolbar/menu-toolbar.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DeelnemerPageRoutingModule,
        MenuToolbarModule
    ],
  declarations: [DeelnemerPage]
})
export class DeelnemerPageModule {}
