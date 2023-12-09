import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuToolbarComponent} from './menu-toolbar.component';
import {IonicModule} from '@ionic/angular';
import {LoaderModule} from '../loader/loader.module';


@NgModule({
    declarations: [MenuToolbarComponent],
    imports: [
        CommonModule,
        IonicModule,
        LoaderModule
    ],
    exports: [MenuToolbarComponent]
})
export class MenuToolbarModule {
}
