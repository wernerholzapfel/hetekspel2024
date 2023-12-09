import { Component, OnDestroy, OnInit } from '@angular/core';
import { switchMap, takeUntil } from 'rxjs/operators';
import { UiService } from '../../../services/ui.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IStandLine } from '../../../models/stand.model';
import { combineLatest, Subject } from 'rxjs';
import { MatchService } from '../../../services/match.service';
import { IMatchPrediction } from '../../../models/participant.model';
import { Gesture } from '../../../directives/gestures.directive';

@Component({
    selector: 'app-matches',
    templateUrl: './matches.page.html',
    styleUrls: ['./matches.page.scss'],
})
export class MatchesPage {

    standLine: IStandLine;
    unsubscribe = new Subject<void>();
    predictions: IMatchPrediction[];
    gestureOpts: Gesture[] = [
        // {name: 'tap'},
        // {name: 'doubleTap'},
        // {name: 'press'},
        { name: 'swipe' },
    ];
    stand: IStandLine[];
    standIndex: number;

    constructor(private uiService: UiService,
        private route: ActivatedRoute,
        private router: Router,
        private matchService: MatchService
    ) {
    }

    ionViewWillEnter() {
        this.unsubscribe = new Subject<void>();

        this.route.params.pipe(switchMap((params) => {
            return this.matchService.getMatchPredictionsForParticipant(params.id)
        }))
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(
                matchPredictions => {
                    this.predictions = matchPredictions;
                });

        combineLatest([this.uiService.totaalstand$, this.route.params])
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(([stand, params]) => {
                if (stand && params.id) {
                    this.stand = stand;
                    this.standIndex = stand.findIndex(line => line.id === params.id);
                    this.standLine = stand[this.standIndex];    
                }
            })

    }

    openMatch(matchId: string) {
        this.router.navigate([`match/${matchId}`], { replaceUrl: false });
    }

    onTap($event) {
    }

    onSwipe($event) {
        if ($event.swipeType === 'moveend') {
            this.standIndex = $event.dirX === 'right' && this.standIndex === 0 ?
                0 : $event.dirX === 'right' ? this.standIndex - 1 :
                    (this.standIndex + 1 === this.stand.length) ?
                        this.standIndex : this.standIndex + 1;

            this.router.navigate([`deelnemer/deelnemer/${this.stand[this.standIndex].id}/matches/`]);

        }
    }

    onDoubleTap($event) {
    }

    onPress($event) {
    }
    ionViewDidLeave(): void {
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }

}
