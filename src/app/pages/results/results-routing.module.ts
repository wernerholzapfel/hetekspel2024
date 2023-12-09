import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultsPage } from './results.page';
import {CanDeactivateGuard} from '../../guards/candeactivate.guard';

const routes: Routes = [
  {
    path: 'results',
    canDeactivate: [CanDeactivateGuard],
    component: ResultsPage,
    children: [
      {
        path: 'matches',
        loadChildren: () => import('../results/matches/matches.module').then(m => m.MatchesPageModule),
      },
      {
        path: 'knockout',
        loadChildren: () => import('../results/knockout/knockout.module').then(m => m.KnockoutPageModule),
      },
      {
        path: 'poule',
        loadChildren: () => import('../results/poule/poule.module').then(m => m.PoulePageModule)
      }, {
        path: 'stand',
        loadChildren: () => import('../results/stand/stand.module').then(m => m.StandPageModule)
      }]
  }, {
    path: '',
    redirectTo: 'results/matches',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResultsPageRoutingModule {}
