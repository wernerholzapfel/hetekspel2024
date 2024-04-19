import { Component, ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IMatchPrediction } from '../../../models/participant.model';
import { MatchService } from '../../../services/match.service';
import { Router } from '@angular/router';
import { UiService } from '../../../services/ui.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { PouleNav } from '../../../models/poule.model';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { StandCardComponent } from 'src/app/components/stand-card/stand-card.component';
import { PoulepredictionService } from 'src/app/services/pouleprediction.service';

@Component({
    selector: 'app-matches',
    templateUrl: './matches.page.html',
    styleUrls: ['./matches.page.scss'],
})
export class MatchesPage {
    @ViewChild('topScrollAnchor') topScroll: ElementRef;

    public pouleName = 'A';
    isRegistrationOpen$: BehaviorSubject<boolean>;
    unsubscribe: Subject<void>;
    pouleNavigatie: PouleNav[];
    activePoule: PouleNav;
    standCardPoule: { poule: string, stand: any[], isSortDisabled: boolean }

    constructor(
        private matchService: MatchService,
        private router: Router,
        private poulePredictionService: PoulepredictionService,
        public uiService: UiService) {
    }

    ionViewWillEnter() {

        this.standCardPoule = { poule: this.pouleName, stand: [], isSortDisabled: true }

        this.unsubscribe = new Subject<void>();
        this.getPredictedMatches();
        this.uiService.getArePouleMatchesPredicted()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(response => {
                this.pouleNavigatie = response;
                this.activePoule = this.pouleNavigatie.find(p => p.current === this.pouleName);
            });

        this.isRegistrationOpen$ = this.uiService.isRegistrationOpen$;
        
        this.uiService.fetchTable$.pipe(takeUntil(this.unsubscribe))
            .pipe(switchMap((pouleName: string) => {
                return this.poulePredictionService.getStandBasedOnPredictionsForLoggedInUser(pouleName)
            }))
            .subscribe(stand => {
                this.standCardPoule = { ...this.standCardPoule, stand: stand, poule: this.pouleName };
            })
    }

    getPredictedMatches() {
        this.matchService.getMatchPredictions().subscribe(
            matchPredictions => {
                this.uiService.matchPredictions$.next(matchPredictions);
            });
    }

    scrollSegments(index: number) {
        const segment = document.querySelector('ion-segment');
        const active = segment.querySelectorAll('ion-segment-button')[index];
        if (active) {
            setTimeout(() => this.topScroll.nativeElement.scrollIntoView({ behavior: 'smooth' }), 500);
            active.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
    }

    next(nextPoule: string) {
        this.pouleName = nextPoule;
        this.activePoule = this.pouleNavigatie.find(pn => pn.current === nextPoule)
        this.uiService.fetchTable$.next(nextPoule);
        this.scrollSegments(this.pouleNavigatie.findIndex(poule => poule.next === nextPoule));

    }

    navigateToPoulePredictions() {
        this.router.navigate([`prediction/prediction/poule/`]);
    }
    ionViewDidLeave(): void {
        this.uiService.matchPredictions$.next([]);
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();

    }
}
