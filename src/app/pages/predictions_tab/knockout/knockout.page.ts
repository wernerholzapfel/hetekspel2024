import { Component, ElementRef, ViewChild } from '@angular/core';
import { PoulepredictionService } from '../../../services/pouleprediction.service';
import { IPoulePrediction } from '../../../models/participant.model';
import { IKnockout } from '../../../models/knockout.model';
import { ITeam } from '../../../models/poule.model';
import { ToastService } from '../../../services/toast.service';
import { UiService } from '../../../services/ui.service';
import { KnockoutService } from '../../../services/knockout.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { take } from 'rxjs/operators';
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
    public eliminatedEarlier: IKnockout[]
    public landDoubleInRound: any[]
    public rounds = this.knockoutHelper.rounds;
    private nummerDries: IPoulePrediction[];
    private nummerDrieIdentifier: string;

    ionViewWillEnter() {
        this.activeKnockoutRound = '16';
        this.receivePredictions();
    }

    receivePredictions() {

        this.poulePredictionService.getPoulePredictions().subscribe(pp => {

            this.poules = pp;

            this.nummerDries = pp.filter(item => item.positie === 3 && item.selected)

            this.nummerDrieIdentifier = this.nummerDries.sort((a, b) => {
                if (b.poule > a.poule) {
                    return -1;
                }
                if (a.poule > b.poule) {
                    return 1;
                }
                return 0;
            }).reduce((acc: string, val) => acc + val.poule, '');

            // find the right spot for the team in the knockout stage.
            const thirdplaces = this.poulePredictionService.getPositionForThirdPlacedTeams(this.nummerDrieIdentifier);

            this.knockoutService.getPersonalSpeelschema().subscribe(speelschema => {
                this.speelschema = speelschema.map(match => {
                    switch (match.awayId) {
                        case 'WB':
                            match.awayId = thirdplaces.WB;
                            break;
                        case 'WC':
                            match.awayId = thirdplaces.WC;
                            break;
                        case 'WE':
                            match.awayId = thirdplaces.WE;
                            break;
                        case 'WF':
                            match.awayId = thirdplaces.WF;
                            break;
                        default:
                        // code block
                    }
                    return {
                        ...match,
                        homeTeam: this.knockoutHelper.setTeam(speelschema, match.homeId, match.round, this.poules, null),
                        awayTeam: this.knockoutHelper.setTeam(speelschema, match.awayId, match.round, this.poules, null)
                    };
                });
                this.setWrongSelectedTeams()
                this.setLandDoubleInRound(true)
                this.calculateCanIGoToNextStep();
            });

            // this.knockoutService.getPersonalSpeelschema().subscribe(speelschema => {
            //     this.speelschema = speelschema.reduce((speelschemaWithTeams, match) => {
            //         return [...speelschemaWithTeams,
            //             {
            //             ...match,
            //             homeTeam: this.knockoutHelper.setTeam(speelschemaWithTeams, match.homeId, match.round, this.poules, null),
            //             awayTeam: this.knockoutHelper.setTeam(speelschemaWithTeams, match.awayId, match.round, this.poules, null)
            //         }];
            //     }, []);

            //     this.setWrongSelectedTeams()
            //     this.setLandDoubleInRound(true)
            //     this.calculateCanIGoToNextStep();
            // });
        });
    }

    private setWrongSelectedTeams() {

        const round16teams = [...this.speelschema.filter(match => match.round === '16').map(r16 => r16.homeTeam.id),
        ...this.speelschema.filter(match => match.round === '16').map(r16 => r16.awayTeam.id)]
        console.log(round16teams)
        const round8teams = [...this.speelschema.filter(match => match.round === '8').map(r16 => r16.homeTeam.id),
        ...this.speelschema.filter(match => match.round === '8').map(r16 => r16.awayTeam.id)]
        console.log(round8teams)
        const round4teams = [...this.speelschema.filter(match => match.round === '4').map(r16 => r16.homeTeam.id),
        ...this.speelschema.filter(match => match.round === '4').map(r16 => r16.awayTeam.id)]
        console.log(round4teams)
        const round2teams = [...this.speelschema.filter(match => match.round === '2').map(r16 => r16.homeTeam.id),
        ...this.speelschema.filter(match => match.round === '2').map(r16 => r16.awayTeam.id)]
        console.log(round2teams)

        this.eliminatedEarlier = []

        const wrong2teams = round2teams.filter(rt => (!round4teams.includes(rt) || !round8teams.includes(rt) || !round16teams.includes(rt)) && rt !== undefined)
        const wrong4teams = round4teams.filter(rt => (!round8teams.includes(rt) || !round16teams.includes(rt))  && rt !== undefined)
        const wrong8teams = round8teams.filter(rt => !round16teams.includes(rt) && rt !== undefined)


        this.eliminatedEarlier = [...this.eliminatedEarlier,
            ...this.speelschema.filter(match => match.round === '2' && 
            (wrong2teams.includes(match.homeTeam.id) || wrong2teams.includes(match.awayTeam.id))).map(sp => {
                return {
                    ...sp,
                    roundText: this.knockoutHelper.rounds.find(r => r.round === sp.round).text
                }
            }),
            ...this.speelschema.filter(match => match.round === '4' && 
            (wrong4teams.includes(match.homeTeam.id) || wrong4teams.includes(match.awayTeam.id))).map(sp => {
                return {
                    ...sp,
                    roundText: this.knockoutHelper.rounds.find(r => r.round === sp.round).text
                }
            }),
            ...this.speelschema.filter(match => match.round === '8' && 
            (wrong8teams.includes(match.homeTeam.id) || wrong8teams.includes(match.awayTeam.id))).map(sp => {
                return {
                    ...sp,
                    roundText: this.knockoutHelper.rounds.find(r => r.round === sp.round).text
                }
            })]

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


        if (notifyWithAlert && this.landDoubleInRound.length > 0) {
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
                return {
                    ...r,
                    teams: [...r.teams, match.homeTeam, match.awayTeam]
                }
            } else return { ...r };
        })
    }


    selectKnockoutRound($event) {
        this.activeKnockoutRound = $event.detail.value;
        setTimeout(() => this.topScroll.nativeElement.scrollIntoView({ behavior: 'smooth' }), 500);
        this.calculateCanIGoToNextStep();
    }

    scrollSegments(index: number) {
        this.segmentIndex = index - 1;
        const segment = document.querySelector('ion-segment');
        const active = segment.querySelectorAll('ion-segment-button')[index];
        if (active) {
            active.scrollIntoView({ behavior: 'smooth', inline: 'center' });
            setTimeout(() => this.topScroll.nativeElement.scrollIntoView({ behavior: 'smooth' }), 500);
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
                    selectedTeam: { id: $event.detail.value },
                    homeTeam: match.homeTeam,
                    awayTeam: match.awayTeam,
                    knockout: { id: match.id },
                    round: match.round
                } : {
                    selectedTeam: { id: $event.detail.value },
                    matchId: match.matchId,
                    homeTeam: match.homeTeam,
                    awayTeam: match.awayTeam,
                    knockout: { id: match.id },
                    round: match.round
                }
        ).subscribe(response => {
            loading.dismiss();
            match.isLoading = false;
            match.prediction = response;
            match.selectedTeam = { id: $event.detail.value };

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
        setTimeout(() => this.topScroll.nativeElement.scrollIntoView({ behavior: 'smooth' }), 500);
        this.calculateCanIGoToNextStep();
    }

    updateSpeelschema(match, selectedTeam, loserMatch = false) {
        const matchToUpdate = loserMatch ? this.speelschema.find(m => m.homeId === "V" + match.matchId ||
            m.awayId === "V" + match.matchId) : this.speelschema.find(m => m.homeId === match.matchId ||
                m.awayId === match.matchId);

        // 3/4 P hoeft niet geupdate te worden?
        if (matchToUpdate) {
            this.speelschema = this.speelschema.map(m => {
                if (matchToUpdate && m.matchId === matchToUpdate.matchId) {
                    if (m.homeId === match.matchId || m.homeId === "V" + match.matchId) {
                        return {
                            ...m,
                            homeTeam: this.knockoutHelper.setTeam(this.speelschema, m.homeId, m.round, null, selectedTeam)
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
