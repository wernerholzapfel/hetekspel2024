import {Component, ElementRef, ViewChild} from '@angular/core';
import {PoulepredictionService} from '../../../services/pouleprediction.service';
import {IPoulePrediction} from '../../../models/participant.model';
import {IKnockout} from '../../../models/knockout.model';
import {ITeam} from '../../../models/poule.model';
import {ToastService} from '../../../services/toast.service';
import {UiService} from '../../../services/ui.service';
import {KnockoutService} from '../../../services/knockout.service';
import {Router} from '@angular/router';
import {AlertController, LoadingController} from '@ionic/angular';
import {take} from 'rxjs/operators';
import { TeamService } from 'src/app/services/team.service';
import { KnockoutHelperService } from 'src/app/services/knockoutHelper.service';

@Component({
    selector: 'app-knockout',
    templateUrl: './knockout.page.html',
    styleUrls: ['./knockout.page.scss'],
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
    public activeKnockoutRound = '16';
    public speelschema: IKnockout[];
    private poules: any[];
    public segmentIndex = 1;
    public canIGoToNextStep: boolean;
    public wrongSelectedTeam: IKnockout[]
    public landDoubleInRound: any[]
    public rounds = this.knockoutHelper.rounds;

    ionViewWillEnter() {
        this.activeKnockoutRound = '16';
        this.receivePredictions();
    }

    receivePredictions() {

        this.poulePredictionService.getPoulePredictions().subscribe(pp => {

            this.poules = pp;

            this.knockoutService.getPersonalSpeelschema().subscribe(speelschema => {
                this.speelschema = speelschema.reduce((speelschemaWithTeams, match) => {
                    return [...speelschemaWithTeams,
                        {
                        ...match,
                        homeTeam: this.knockoutHelper.setTeam(speelschemaWithTeams, match.homeId, match.round, this.poules, null),
                        awayTeam: this.knockoutHelper.setTeam(speelschemaWithTeams, match.awayId, match.round, this.poules, null)
                    }];
                }, []);

                this.setWrongSelectedTeams()
                this.setLandDoubleInRound(true)
                this.calculateCanIGoToNextStep();
            });
        });
    }

    private setWrongSelectedTeams() {
        this.wrongSelectedTeam = this.speelschema.filter(match => match.selectedTeam && match.selectedTeam.id != match.homeTeam.id && match.selectedTeam.id != match.awayTeam.id)
                .map(sp => {
                    return {
                    ...sp,
                    roundText: this.knockoutHelper.rounds.find(r => r.round === sp.round).text
                }
                });
            }

    toFindDuplicates(arry) {
        const uniqueElements = new Set(arry);
        const filteredElements = arry.filter(item => {
            if (uniqueElements.has(item)) {
                uniqueElements.delete(item);
            } else {
                return item;
            }
        });

        return [...new Set(filteredElements)]
    }

    
    private setLandDoubleInRound(notifyWithAlert) {
        const landenPerRonde = this.speelschema.reduce((acc, index) => {
            return this.addMatchToRound(index, acc)
        }, this.knockoutHelper.rounds);

        this.landDoubleInRound = landenPerRonde.map(ronde => {
            return {
                ...ronde,
                duplicateTeams: this.toFindDuplicates(ronde.teams.map(team => {
                    return team.name;
                }))
            }
        }).filter(r => r.duplicateTeams.length > 0);


        if (notifyWithAlert && this.landDoubleInRound.length > 0 ) {
            let text = 'Je hebt een of meer landen dubbel in een ronde:'
            this.landDoubleInRound.forEach(round => {
                round.duplicateTeams.forEach(team => {
                    text = `${text} ${round.text} ${team}`                   
                });
            });
            this.uiService.presentToast(text, 'danger', true);
        }
    }

    private addMatchToRound(match, rounds: any[]) {
        return rounds.map(r => {
            if (r.round === match.round) {
                return {...r,
                    teams: [...r.teams, match.homeTeam, match.awayTeam]
                }
            } else return { ...r };
        })
    }


    selectKnockoutRound($event) {
        this.activeKnockoutRound = $event.detail.value;
        setTimeout(() => this.topScroll.nativeElement.scrollIntoView({behavior: 'smooth'}), 500);
        this.calculateCanIGoToNextStep();
    }

    scrollSegments(index: number) {
        this.segmentIndex = index - 1;
        const segment = document.querySelector('ion-segment');
        const active = segment.querySelectorAll('ion-segment-button')[index];
        if (active) {
            active.scrollIntoView({behavior: 'smooth', inline: 'center'});
            setTimeout(() => this.topScroll.nativeElement.scrollIntoView({behavior: 'smooth'}), 500);
        }
        this.calculateCanIGoToNextStep();
    }

    async setSelectedTeam(match: IKnockout, $event, hasLoserMatch = false) {
        const loading = await this.loadingCtrl.create({
            message: 'Wedstrijd wordt opgeslagen',
          });
      
          if (!match.prediction && !match.prediction?.id) {
            loading.present();
          }
        match.isLoading = true;
        this.poulePredictionService.saveKnockoutPrediction(
            (match.prediction && match.prediction.id) ?
                {
                    id: match.prediction.id,
                    matchId: match.matchId,
                    selectedTeam: {id: $event.detail.value},
                    homeTeam: match.homeTeam,
                    awayTeam: match.awayTeam,
                    knockout: {id: match.id},
                    round: match.round
                } : {
                    selectedTeam: {id: $event.detail.value},
                    matchId: match.matchId,
                    homeTeam: match.homeTeam,
                    awayTeam: match.awayTeam,
                    knockout: {id: match.id},
                    round: match.round
                }
        ).subscribe(response => {
            loading.dismiss();
            match.isLoading = false;
            match.prediction = response;
            match.selectedTeam = {id: $event.detail.value};

            this.calculateCanIGoToNextStep();
            this.updateSpeelschema(match, $event.detail.value);
            if (match.round === "4") {
                this.updateSpeelschema(match, $event.detail.value, true);
            }
        
        }, error => {
            match.isLoading = false;
            this.toastService.presentToast(error && error.error && error.error.message ? error.error.message : 'Er is iets misgegaan', 'warning');
        });
    }

    next() {
        this.activeKnockoutRound = this.knockoutHelper.rounds.find(r => r.round === this.activeKnockoutRound).next;
        setTimeout(() => this.topScroll.nativeElement.scrollIntoView({behavior: 'smooth'}), 500);
    }

    updateSpeelschema(match, selectedTeam, loserMatch = false) {
        const matchToUpdate = loserMatch ? this.speelschema.find(m => m.homeId === "V"+match.matchId || 
            m.awayId === "V"+match.matchId) : this.speelschema.find(m => m.homeId === match.matchId || 
            m.awayId === match.matchId);

        // 3/4 P hoeft niet geupdate te worden?
        if (matchToUpdate) {
            this.speelschema = this.speelschema.map(m => {
                if (matchToUpdate && m.matchId === matchToUpdate.matchId) {
                    if (m.homeId === match.matchId || m.homeId === "V"+match.matchId) {
                        return {
                            ...m,
                            homeTeam: this.knockoutHelper.setTeam(this.speelschema, m.homeId, m.round,null, selectedTeam)
                        };
                    } else {
                        return {
                            ...m,
                            awayTeam: this.knockoutHelper.setTeam(this.speelschema, m.awayId, m.round, null, selectedTeam)
                        };
                    }
                } else {
                    return m;
                }
            });
            this.setWrongSelectedTeams();
            this.setLandDoubleInRound(true);

        }
    }
    calculateCanIGoToNextStep(): void {
        const matchesInActiveRound = this.speelschema?.filter(sp => sp.round === this.activeKnockoutRound);
        const matchesInActiveRoundWithSelectedTeam = matchesInActiveRound?.filter(av => av.selectedTeam);

        this.canIGoToNextStep = (this.speelschema &&
            matchesInActiveRound.length === matchesInActiveRoundWithSelectedTeam.length);
    }

    predictionInComplete(): boolean {
        return this.speelschema &&
            (this.speelschema.filter(sp => sp.selectedTeam).length !== this.speelschema.length ||
                this.speelschema.filter(match => match.selectedTeam &&
                    (match.selectedTeam.id !== match.homeTeam.id &&
                        match.selectedTeam.id !== match.awayTeam.id)).length > 0);
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
                                this.activeKnockoutRound = '16';
                                this.receivePredictions();
                            });
                    }
                }
            ]
        });

        await alert.present();
    }
}
