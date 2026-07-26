import { Component, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { UiService } from 'src/app/services/ui.service';
import { KnockoutPredictionsService } from 'src/app/services/knockout-predictions.service';
import { of } from 'rxjs';

@Component({
    selector: 'app-poule',
    templateUrl: './knockout.page.html',
    styleUrls: ['./knockout.page.scss'],
    standalone: false
})
export class KnockoutPage {
    knockoutStats: any[] = [];
    myTeamsByRound: Map<string, Set<string>> = new Map();
    unsubscribe: Subject<void> = new Subject<void>();

    constructor(private db: AngularFireDatabase,
        private router: Router,
        private injector: EnvironmentInjector,
        private uiService: UiService,
        private knockoutPredictionService: KnockoutPredictionsService) {
    }

    ionViewWillEnter() {
        this.unsubscribe = new Subject<void>();

        runInInjectionContext(this.injector, () => {
            this.db.list<any>(`stats/knockout`)
                .valueChanges()
                .pipe(takeUntil(this.unsubscribe))
                .subscribe(knockoutStats => {
                    this.knockoutStats = knockoutStats;
                });
        });

        this.uiService.participant$
            .pipe(
                takeUntil(this.unsubscribe),
                switchMap(me => me?.id
                    ? this.knockoutPredictionService.getKnockoutForParticipant(me.id)
                    : of([]))
            )
            .subscribe(myKnockout => {
                const teamMap = new Map<string, Set<string>>();
                myKnockout.forEach(match => {
                    const r = String(match.round);
                    if (!teamMap.has(r)) { teamMap.set(r, new Set()); }
                    if (match.prediction?.homeTeam?.id) { teamMap.get(r)?.add(String(match.prediction.homeTeam.id)); }
                    if (match.prediction?.awayTeam?.id) { teamMap.get(r)?.add(String(match.prediction.awayTeam.id)); }
                });

                const getSelectedId = (match: any): string | null => {
                    const selId = match?.prediction?.selectedTeam?.id;
                    if (!selId) { return null; }
                    return String(selId);
                };
                const round3 = myKnockout.find(m => m.round === '3');
                const round2 = myKnockout.find(m => m.round === '2');
                const troostId = getSelectedId(round3);
                const kampioenId = getSelectedId(round2);
                if (troostId) { teamMap.set('1.5', new Set([troostId])); }
                if (kampioenId) { teamMap.set('1', new Set([kampioenId])); }

                this.myTeamsByRound = teamMap;
            });
    }

    openKoTeam(team: string, round: string) {
        this.router.navigate([`stats/knockout/round/${round}/team/${team}`], { replaceUrl: false });
    }

    ionViewDidLeave(): void {
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }
}
