import { Component, ElementRef, ViewChild } from '@angular/core';
import { PoulepredictionService } from '../../../services/pouleprediction.service';
import { IPoulePrediction } from '../../../models/participant.model';
import { IDeelnemerSpeelschema, IKnockout } from '../../../models/knockout.model';
import { ITeam } from '../../../models/poule.model';
import { ToastService } from '../../../services/toast.service';
import { UiService } from '../../../services/ui.service';
import { KnockoutService } from '../../../services/knockout.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject, combineLatest, forkJoin } from 'rxjs';
import { TeamService } from 'src/app/services/team.service';
import { KnockoutHelperService } from 'src/app/services/knockoutHelper.service';
import { KnockoutPredictionsService } from 'src/app/services/knockout-predictions.service';

@Component({
    selector: 'app-knockout',
    templateUrl: './knockout.page.html',
    styleUrls: ['./knockout.page.scss'],
    standalone: false
})
export class KnockoutPage {
    @ViewChild('topScrollAnchor') topScroll: ElementRef;

    constructor(private poulePredictionService: PoulepredictionService,
        private knockoutService: KnockoutService,
        private toastService: ToastService,
        private router: Router,
        public uiService: UiService,
        public alertController: AlertController,
        private loadingCtrl: LoadingController,
        private knockoutHelper: KnockoutHelperService) {
    }

    public isLoadingColor = 'primary';
    public speelschema: IKnockout[];
    public poules: any[] = []
    public segmentIndex = 1;
    public canIGoToNextStep: boolean;
    public wrongSelectedTeam: IKnockout[]
    public rounds = this.knockoutHelper.rounds;
    private refresh$ = new BehaviorSubject<void>(undefined);
    private activeRound$ = new BehaviorSubject<number>(32);
    private destroy$ = new Subject<void>();

    get activeKnockoutRound() { return this.activeRound$.value; }
    set activeKnockoutRound(val: number) { this.activeRound$.next(val); }

    ionViewWillEnter() {
        this.activeRound$.next(32);

        combineLatest([
            this.refresh$.pipe(switchMap(() => this.knockoutService.getPersonalSpeelschema())),
            this.activeRound$
        ]).pipe(takeUntil(this.destroy$))
        .subscribe(([speelschema]) => {
            this.speelschema = speelschema;
            this.setWrongSelectedTeams();
            this.calculateCanIGoToNextStep();
        });
    }

    ionViewWillLeave() {
        this.destroy$.next();
    }

    private setWrongSelectedTeams() {
        this.wrongSelectedTeam = this.speelschema
            .filter(match => match.prediction?.selectedTeamEliminated)
            .map(sp => ({
                ...sp,
                roundText: this.knockoutHelper.rounds.find(r => r.round.toString() === sp.round).text
            }));
        console.log('Wrong selected teams:', this.wrongSelectedTeam);
    }

    selectKnockoutRound($event) {
        this.activeKnockoutRound = $event.detail.value;
        setTimeout(() => this.topScroll.nativeElement.scrollIntoView({ behavior: 'smooth' }), 500);
    }

    scrollSegments(index: number) {
        this.segmentIndex = index - 1;
        const segment = document.querySelector('ion-segment');
        const active = segment.querySelectorAll('ion-segment-button')[index];
        if (active) {
            active.scrollIntoView({ behavior: 'smooth', inline: 'center' });
            setTimeout(() => this.topScroll.nativeElement.scrollIntoView({ behavior: 'smooth' }), 500);
        }
    }

    async setSelectedTeam(match: IKnockout, $event) {

        const loading = await this.loadingCtrl.create({
            message: 'Wedstrijd wordt opgeslagen',
        });

        loading.present();
        match.isLoading = true;

        const winnerSave = {
            team: { id: $event.detail.value },
            knockoutMatchPosition: match.matchId,
            round: String(+match.round / 2)
        };

        const saves$ = match.round === '4'
            ? forkJoin([
                this.poulePredictionService.saveKnockoutPrediction(winnerSave),
                this.poulePredictionService.saveKnockoutPrediction({
                    team: { id: ($event.detail.value === match.prediction.homeTeam.id ? match.prediction.awayTeam : match.prediction.homeTeam).id },
                    knockoutMatchPosition: 'V' + match.matchId,
                    round: '3'
                })
            ])
            : this.poulePredictionService.saveKnockoutPrediction(winnerSave);

        saves$.subscribe({
            next: () => {
                this.refresh$.next();
                loading.dismiss();
                match.isLoading = false;
            },
            error: (error) => {
                match.isLoading = false;
                loading.dismiss();
                this.toastService.presentToast(error && error.error && error.error.message ? error.error.message : 'Er is iets misgegaan', 'warning');
            }
        });
    }


    next() {
        this.activeKnockoutRound = this.knockoutHelper.rounds.find(r => r.round === this.activeKnockoutRound).next;
        setTimeout(() => this.topScroll.nativeElement.scrollIntoView({ behavior: 'smooth' }), 500);
    }


    private calculateCanIGoToNextStep(): void {
        const matchesInActiveRound = this.speelschema?.filter(sp => sp.round === this.activeKnockoutRound.toString());
        const matchesInActiveRoundWithSelectedTeam = matchesInActiveRound?.filter(av => av.prediction?.selectedTeam);

        this.canIGoToNextStep = (this.speelschema &&
            matchesInActiveRound.length === matchesInActiveRoundWithSelectedTeam.length);
    }

    predictionInComplete(): boolean {
        const missing = this.speelschema.filter(sp => !sp.prediction?.selectedTeam);
        console.log('Matches ZONDER prediction:', missing.map(m => ({
            matchId: m.matchId,
            round: m.round,
            home: m.homeTeam?.name,
            away: m.awayTeam?.name,
            prediction: m.prediction
        })));
        return this.speelschema &&
            (this.speelschema.filter(sp => sp.prediction?.selectedTeam).length !== this.speelschema.length ||
                this.speelschema.filter(match => match.prediction?.selectedTeam &&
                    (match.prediction?.selectedTeam.id !== match.homeTeam?.id &&
                        match.prediction?.selectedTeam.id !== match.awayTeam?.id)).length > 0);
    }

    navigateToHome() {
        this.router.navigate([`deelnemers`]);
    }

    async deleteKnockoutPredictions() {
        const alert = await this.alertController.create({
            header: 'Weet je het zeker?',
            subHeader: 'Verwijder knockout voorspellingen',
            message: 'Hiermee verwijder je al jouw knockoutvoorspellingen. De voorspellingen van de wedstrijden en poulestanden blijven bewaard.',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                    }
                }, {
                    text: 'Verwijder',
                    cssClass: 'hes-alert-danger',
                    handler: () => {
                        this.poulePredictionService.deleteKnockoutPredictions()
                            .pipe(take(1))
                            .subscribe(res => {
                                this.toastService.presentToast('Knockout wedstrijden verwijderd. Vul alle knockout wedstrijden opnieuw in.',
                                    'success', true, 'OK', 5000);
                                this.activeKnockoutRound = 32;
                                this.refresh$.next();
                            });
                    }
                }
            ]
        });

        await alert.present();
    }
}
