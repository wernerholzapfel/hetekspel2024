import { Component, OnDestroy, OnInit } from '@angular/core';
import { KnockoutPredictionsService } from '../../../services/knockout-predictions.service';
import { KnockoutService } from '../../../services/knockout.service';
import { combineLatest, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from '../../../services/ui.service';
import { IStandLine } from '../../../models/stand.model';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-knockout',
    templateUrl: './knockout.page.html',
    styleUrls: ['./knockout.page.scss'],
})
export class KnockoutPage {

    predictions: any[]; // todo model
    speelschema: any[]; // todo model
    standLine: IStandLine;
    winnaarTroostFinale: any;
    europeesKampioen: any;
    unsubscribe = new Subject<void>();

    constructor(private knockoutPredictionService: KnockoutPredictionsService,
        private knockoutService: KnockoutService,
        private uiService: UiService,
        private router: Router,
        private route: ActivatedRoute) {
    }


    ionViewWillEnter() {
        this.unsubscribe = new Subject<void>();

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
                });
                console.log(this.predictions)
            });

        combineLatest([this.uiService.totaalstand$, this.route.params])
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(([stand, params]) => {
                if (stand && params.id) {
                    this.standLine = stand.find(line => line.id === params.id);
                }
            })

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
