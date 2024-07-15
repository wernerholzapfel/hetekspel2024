import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {DeadlineGuard} from './guards/deadline.guard';
import { OfflineGuard } from './guards/offline.guard';
import { OnlineGuard } from './guards/online.guard';

const routes: Routes = [
    {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
        canActivate: [OfflineGuard],
        data: {redirectUrl: 'offline'}

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
        loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
        

    },
    {
        path: 'halloffame',
        loadChildren: () => import('./pages/halloffame/halloffame.module').then(m => m.HalloffamePageModule)
    },
    {
        path: 'results',
        loadChildren: () => import('./pages/results/results.module').then(m => m.ResultsPageModule),
        canActivate: [OfflineGuard],
    },
    {
        path: 'stand',
        loadChildren: () => import('./pages/stand/stand.module').then(m => m.StandPageModule)
    },{
        path: 'speelschema',
        loadChildren: () => import('./pages/speelschema/speelschema.module').then(m => m.SpeelschemaPageModule),
        canActivate: [OfflineGuard],
    },
    {
        path: 'deelnemer',
        loadChildren: () => import('./pages/deelnemer/deelnemer.module').then(m => m.DeelnemerPageModule),
        canActivate: [OfflineGuard],
    },
    {
        path: 'deelnemers',
        loadChildren: () => import('./pages/participant-list/participant-list.module').then(m => m.ParticipantListPageModule),
        canActivate: [OfflineGuard],
    },
    {
        path: 'stats',
        loadChildren: () => import('./pages/stats/stats.module').then(m => m.StatsPageModule)
    },
    {
        path: 'stats/knockout/round/:roundid/team/:teamid',
        loadChildren: () => import('./pages/stats/knockout/participant/knockout-participants/knockout-participants.module')
            .then(m => m.KnockoutParticipantsPageModule),
            canActivate: [OfflineGuard],
    },
    {
        path: 'disclaimer',
        loadChildren: () => import('./pages/disclaimer/disclaimer.module').then(m => m.DisclaimerPageModule)
    },
    {
        path: `match/:id/toto/:totoId`,
        loadChildren: () => import('./pages/match/match.module').then(m => m.MatchPageModule),
        canActivate: [OfflineGuard],
    },
    {
        path: 'match/:id',
        loadChildren: () => import('./pages/match/match.module').then(m => m.MatchPageModule),
        canActivate: [OfflineGuard],
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
  {
    path: 'offline',
    loadChildren: () => import('./pages/offline/offline.module').then( m => m.OfflinePageModule),
    canActivate: [OnlineGuard],
        data: {redirectUrl: 'home'}
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
