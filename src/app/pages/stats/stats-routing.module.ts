import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StatsPage} from './stats.page';

const routes: Routes = [
    {
        path: 'stats',
        component: StatsPage,
        children: [
            {
                path: 'toto',
                loadChildren: () => import('./toto/toto.module').then(m => m.TotoStatsPageModule)
            },
            {
                path: 'knockout',
                loadChildren: () => import('./knockout/knockout.module').then(m => m.KnockoutStatsPageModule)
            }]
    }, {
        path: '',
        redirectTo: 'stats/toto',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StatsPageRoutingModule {
}
