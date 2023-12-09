import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchPageRoutingModule } from './match-routing.module';

import { MatchPage } from './match.page';
import {MenuToolbarModule} from '../../components/menu-toolbar/menu-toolbar.module';
import {CustomComponentsModule} from '../../components/custom-components/custom-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MatchPageRoutingModule,
        MenuToolbarModule,
        CustomComponentsModule
    ],
  declarations: [MatchPage]
})
export class MatchPageModule {}
