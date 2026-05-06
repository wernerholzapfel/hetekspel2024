import { Component, OnDestroy, OnInit } from '@angular/core';
import { KnockoutPredictionsService } from '../../../services/knockout-predictions.service';
import { KnockoutService } from '../../../services/knockout.service';
import { combineLatest, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from '../../../services/ui.service';
import { IStandLine } from '../../../models/stand.model';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Gesture } from 'src/app/directives/gestures.directive';
import { IKnockout } from 'src/app/models/knockout.model';

@Component({
    selector: 'app-knockout',
    templateUrl: './knockout.page.html',
    styleUrls: ['./knockout.page.scss'],
    standalone: false
})
export class KnockoutPage {

    knockoutSpeelschema: { round: string; matches: IKnockout[] }[];
    // speelschema: any[]; // todo model
    standLine: IStandLine;
    showWinnaarTroostFinale = true;
    winnaarTroostFinale: any;
    kampioen: any;
    unsubscribe = new Subject<void>();
    gestureOpts: Gesture[] = [
        { name: 'swipe' }
    ];
    stand: IStandLine[];
    standIndex: number;

    constructor(private knockoutPredictionService: KnockoutPredictionsService,
        private uiService: UiService,
        private router: Router,
        private route: ActivatedRoute) {
    }


    ionViewWillEnter() {
        this.unsubscribe = new Subject<void>();

        this.refresh(null);

        combineLatest([this.uiService.totaalstand$, this.route.params])
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(([stand, params]) => {
                if (stand && params.id) {
                    this.stand = stand;
                    this.standLine = stand.find(line => line.id === params.id);
                    this.standIndex = stand.findIndex(line => line.id === params.id);
                }
            })

    }
    onSwipe($event) {
        if ($event.swipeType === 'moveend') {
            this.standIndex = $event.dirX === 'right' && this.standIndex === 0 ?
                0 : $event.dirX === 'right' ? this.standIndex - 1 :
                    (this.standIndex + 1 === this.stand.length) ?
                        this.standIndex : this.standIndex + 1;

            this.router.navigate([`deelnemer/deelnemer/${this.stand[this.standIndex].id}/knockout/`]);

        }
    }

    refresh(event): void {
        this.route.params.pipe(switchMap((params) => {
            return this.knockoutPredictionService.getKnockoutForParticipant(params.id)
        }))
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((results) => {
                const finale = results.find(r => r.round === '2');
                // todo this kampioen is fout!!! krijgt hier uitslag van finale voorspelling en niet winnaar voorspelling.
                // this.kampioen = finale?.prediction?.selectedTeam?.id === finale?.prediction?.homeTeam?.id ? finale?.prediction?.homeTeam : finale?.prediction?.selectedTeam?.id === finale?.prediction?.awayTeam?.id ? finale?.prediction?.awayTeam : null;
                // console.log('kampioen', this.kampioen);
                // this.winnaarTroostFinale = results.find(r => r.round === '3');
                // console.log('winnaarTroostFinale', this.winnaarTroostFinale);
                const grouped = results
                    .filter(r => r.round !== '1' && r.round !== '1.5' && r.round !== '3')
                    .reduce((acc, match) => {
                        const existing = acc.find(g => g.round === match.round);
                        if (existing) {
                            existing.matches.push(match);
                        } else {
                            acc.push({ round: match.round, matches: [match] });
                        }
                        return acc;
                    }, [] as { round: string; matches: IKnockout[] }[]);
                this.knockoutSpeelschema = grouped.sort((a, b) => +b.round - +a.round);
                console.log('knockoutSpeelschema', this.knockoutSpeelschema);
            });
            
            this.route.params.pipe(switchMap((params) => {
            return this.knockoutPredictionService.getWinnersForParticipant(params.id)
        }))
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((results) => {
                this.kampioen = results.find(r => r.round === '1');
                this.winnaarTroostFinale = results.find(r => r.round === '1.5');
                console.log(this.kampioen)
                console.log(this.winnaarTroostFinale)
            });
        if (event) {
            event.target.complete();
        }
    }

    openKoTeam(team, round) {
        this.router.navigate([`stats/knockout/round/${round}/team/${team}`], { replaceUrl: false });
    }

    ionViewDidLeave(): void {
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }
}
