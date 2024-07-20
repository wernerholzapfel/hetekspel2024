import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfflinePageRoutingModule } from './offline-routing.module';

import { OfflinePage } from './offline.page';
import { MenuToolbarModule } from "../../components/menu-toolbar/menu-toolbar.module";
import { LoginModule } from "../../components/login/login.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfflinePageRoutingModule,
    MenuToolbarModule,
    LoginModule
],
  declarations: [OfflinePage]
})
export class OfflinePageModule {}
