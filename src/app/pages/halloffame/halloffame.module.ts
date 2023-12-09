import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HalloffamePageRoutingModule } from './halloffame-routing.module';

import { HalloffamePage } from './halloffame.page';
import {MenuToolbarModule} from '../../components/menu-toolbar/menu-toolbar.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HalloffamePageRoutingModule,
        MenuToolbarModule
    ],
  declarations: [HalloffamePage]
})
export class HalloffamePageModule {}
