import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { DeelnemerGuard } from 'src/app/guards/deelnemer.guard';
import {DeelnemerPage} from './deelnemer.page';

const routes: Routes = [
    {
        path: 'deelnemer/:id',
        component: DeelnemerPage,
        children: [
            {
                path: 'matches',
                loadChildren: () => import('./matches/matches.module').then(m => m.MatchesPageModule)
            },
            {
                path: 'knockout',
                loadChildren: () => import('./knockout/knockout.module').then(m => m.KnockoutPageModule)
            },
            {
                path: 'poule',
                loadChildren: () => import('./poule/poule.module').then(m => m.PoulePageModule)
            }]
    }, {
        path: 'deelnemer',
        component: DeelnemerPage,
        canActivate: [DeelnemerGuard],
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DeelnemerPageRoutingModule {
}
