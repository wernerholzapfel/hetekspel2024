import {Component, ElementRef, ViewChild} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {IMatchPrediction} from '../../../models/participant.model';
import {VoorspellingHelperService} from '../../../services/voorspelling-helper.service';
import {MatchService} from '../../../services/match.service';
import {Router} from '@angular/router';
import {UiService} from '../../../services/ui.service';
import {switchMap, takeUntil} from 'rxjs/operators';
import {PouleNav} from '../../../models/poule.model';
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
    matchPredictions: IMatchPrediction[];
    unsubscribe: Subject<void>;
    pouleNavigatie: PouleNav[];
    activePoule: PouleNav;
    standCardPoule: { poule: string, stand: any[], isSortDisabled: boolean }

    constructor(private voorspellingHelper: VoorspellingHelperService,
                private matchService: MatchService,
                private router: Router,
                private modalCtrl: ModalController,
                private routerOutlet: IonRouterOutlet,
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
        this.uiService.matchPredictions$.pipe(takeUntil(this.unsubscribe))
            .pipe(switchMap(() => {
                return this.poulePredictionService.getStandBasedOnPredictionsForLoggedInUser(this.activePoule.current)
            }))
            .subscribe(stand => {
                this.standCardPoule.stand = stand;
            })
    }

    getPredictedMatches() {
        this.matchService.getMatchPredictions().subscribe(
            matchPredictions => {
                this.matchPredictions = matchPredictions;
                this.uiService.matchPredictions$.next(matchPredictions);
            });
    }

    selectPoule($event) {
        console.log('selectpoule aangeroepen met ' + $event.detail.value)
        this.activePoule = this.pouleNavigatie.find(p => p.current === $event.detail.value);
        this.uiService.matchPredictions$.next(this.matchPredictions)
        this.standCardPoule = {...this.standCardPoule, poule: this.pouleName};


    }

    scrollSegments(index: number) {
        const segment = document.querySelector('ion-segment');
        const active = segment.querySelectorAll('ion-segment-button')[index];
        if (active) {
            setTimeout(() => this.topScroll.nativeElement.scrollIntoView({behavior: 'smooth'}), 500);
            active.scrollIntoView({behavior: 'smooth', inline: 'center'});
        }
    }
    
    next() {
        const activePoule = this.pouleNavigatie.find(p => p.current === this.pouleName);
        this.activePoule = this.pouleNavigatie.find(p => p.current === this.pouleName);
        this.pouleName = activePoule.next;
        this.pouleNavigatie = this.pouleNavigatie.map(pn => {
            if (pn.current === activePoule.next) {
                return {
                    ...pn,
                    disabled: false
                };
            } else {
                return {
                    ...pn
                };
            }
        });
        this.uiService.matchPredictions$.next(this.matchPredictions)
        this.standCardPoule = {...this.standCardPoule, poule: this.pouleName};
        this.scrollSegments(this.pouleNavigatie.findIndex(poule => poule.next === this.pouleName));
    }

    navigateToPoulePredictions() {
        this.router.navigate([`prediction/prediction/poule/`]);
    }
    ionViewDidLeave(): void {
        this.matchPredictions = [];
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();

    }
}
