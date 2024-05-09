import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {DeadlineGuard} from './guards/deadline.guard';

const routes: Routes = [
    {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    },
    {
        path: 'prediction',
        loadChildren: () => import('./pages/predictions_tab/predictions_tab.module').then(m => m.PredictionsTabModule),
        canActivate: [DeadlineGuard],
    },
    {
        path: 'spelregels',
        loadChildren: () => import('./pages/spelregels/spelregels.module').then(m => m.SpelregelsPageModule)
    }, {
        path: 'profiel',
        loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
    },
    {
        path: 'halloffame',
        loadChildren: () => import('./pages/halloffame/halloffame.module').then(m => m.HalloffamePageModule)
    },
    {
        path: 'results',
        loadChildren: () => import('./pages/results/results.module').then(m => m.ResultsPageModule)
    },
    {
        path: 'stand',
        loadChildren: () => import('./pages/stand/stand.module').then(m => m.StandPageModule)
    },{
        path: 'speelschema',
        loadChildren: () => import('./pages/speelschema/speelschema.module').then(m => m.SpeelschemaPageModule)
    },
    {
        path: 'deelnemer',
        loadChildren: () => import('./pages/deelnemer/deelnemer.module').then(m => m.DeelnemerPageModule)
    },
    {
        path: 'deelnemers',
        loadChildren: () => import('./pages/participant-list/participant-list.module').then(m => m.ParticipantListPageModule)
    },
    {
        path: 'stats',
        loadChildren: () => import('./pages/stats/stats.module').then(m => m.StatsPageModule)
    },
    {
        path: 'stats/knockout/round/:roundid/team/:teamid',
        loadChildren: () => import('./pages/stats/knockout/participant/knockout-participants/knockout-participants.module')
            .then(m => m.KnockoutParticipantsPageModule)
    },
    {
        path: 'disclaimer',
        loadChildren: () => import('./pages/disclaimer/disclaimer.module').then(m => m.DisclaimerPageModule)
    },
    {
        path: `match/:id/toto/:totoId`,
        loadChildren: () => import('./pages/match/match.module').then(m => m.MatchPageModule)
    },
    {
        path: 'match/:id',
        loadChildren: () => import('./pages/match/match.module').then(m => m.MatchPageModule)
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {enableTracing: false,
            paramsInheritanceStrategy: 'always'
          })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
