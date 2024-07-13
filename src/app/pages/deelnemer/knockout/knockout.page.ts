import { Component, OnDestroy, OnInit } from '@angular/core';
import { KnockoutPredictionsService } from '../../../services/knockout-predictions.service';
import { KnockoutService } from '../../../services/knockout.service';
import { combineLatest, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from '../../../services/ui.service';
import { IStandLine } from '../../../models/stand.model';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Gesture } from 'src/app/directives/gestures.directive';

@Component({
    selector: 'app-knockout',
    templateUrl: './knockout.page.html',
    styleUrls: ['./knockout.page.scss'],
})
export class KnockoutPage {

    predictions: any[]; // todo model
    speelschema: any[]; // todo model
    standLine: IStandLine;
    showWinnaarTroostFinale = false;
    winnaarTroostFinale: any;
    europeesKampioen: any;
    unsubscribe = new Subject<void>();
    gestureOpts: Gesture[] = [
        { name: 'swipe' }
    ];
    stand: IStandLine[];
    standIndex: number;

    constructor(private knockoutPredictionService: KnockoutPredictionsService,
        private knockoutService: KnockoutService,
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
            return combineLatest([
                this.knockoutPredictionService.getKnockoutForParticipant(params.id),
                this.knockoutService.getOriginalSpeelschema()])
        }))
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(([results, speelschema]) => {
                this.speelschema = speelschema;
                this.predictions = results.map(prediction => {
                    if (prediction.knockout.round === '2') {
                        this.setEuropeesKampioen(prediction);
                    }
                    if (prediction.knockout.round === '3') {
                        console.log('alleen wk')
                        this.setWinnaarTroostFinale(prediction);
                    }
                    return {
                        ...prediction,
                        homeInRound: !!speelschema.find(schema => {
                            return schema.round === prediction.knockout.round &&
                                (schema.homeTeam && prediction.homeTeam.id === schema.homeTeam.id ||
                                    schema.awayTeam && prediction.homeTeam.id === schema.awayTeam.id);
                        }),
                        awayInRound: !!speelschema.find(schema => {
                            return schema.round === prediction.knockout.round &&
                                (schema.homeTeam && prediction.awayTeam.id === schema.homeTeam.id ||
                                    schema.awayTeam && prediction.awayTeam.id === schema.awayTeam.id);
                        }),
                    };
                }).sort((a,b) => parseInt(a.knockout.round) - parseInt(b.knockout.round));
                console.log(this.predictions)
            });
        if (event) {
            event.target.complete();
        }
    }

    setEuropeesKampioen(finaleWedstrijd: any) {
        this.europeesKampioen = {
            team: finaleWedstrijd.selectedTeam,
            winnerSpelpunten: finaleWedstrijd.winnerSpelpunten
        };
        console.log(this.europeesKampioen)
    }
    setWinnaarTroostFinale(finaleWedstrijd: any) {
        this.winnaarTroostFinale = {
            team: finaleWedstrijd.selectedTeam,
            winnerSpelpunten: finaleWedstrijd.winnerSpelpunten
        };
        console.log(this.winnaarTroostFinale)

    }

    openKoTeam(team, round) {
        this.router.navigate([`stats/knockout/round/${round}/team/${team}`], { replaceUrl: false });
    }

    ionViewDidLeave(): void {
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }
}
