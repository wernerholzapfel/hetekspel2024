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
})
export class KnockoutPage {

    predictions: IKnockout[]; // todo model
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
            return this.knockoutPredictionService.getKnockoutForParticipant(params.id)
        }))
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((results) => {
                this.predictions = results.knockouts;
                this.europeesKampioen = results.europeeskampioen
                this.winnaarTroostFinale = results.winnaarTroostFinale
            });
        if (event) {
            event.target.complete();
        }
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
