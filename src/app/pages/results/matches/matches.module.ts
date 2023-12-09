import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {MatchesPage} from './matches.page';
import {MenuToolbarModule} from '../../../components/menu-toolbar/menu-toolbar.module';
import {CustomComponentsModule} from '../../../components/custom-components/custom-components.module';
import {CanDeactivateGuard} from '../../../guards/candeactivate.guard';

const routes: Routes = [
    {
        path: '',
        component: MatchesPage,
        canDeactivate: [CanDeactivateGuard]

    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        MenuToolbarModule,
        CustomComponentsModule,
    ],
    exports: [],
    declarations: [MatchesPage]
})
export class MatchesPageModule {
}
