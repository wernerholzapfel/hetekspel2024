import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {LoaderComponent} from './loader.component';

@NgModule({
    declarations: [LoaderComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule,
    ],
    exports: [
        LoaderComponent
    ]
})
export class LoaderModule {
}
