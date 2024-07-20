import { Component } from '@angular/core';
import { PoulepredictionService } from '../../../services/pouleprediction.service';
import { IPoulePrediction } from '../../../models/participant.model';
import { IKnockout } from '../../../models/knockout.model';
import { ITeam } from '../../../models/poule.model';
import { ToastService } from '../../../services/toast.service';
import { UiService } from '../../../services/ui.service';
import { KnockoutService } from '../../../services/knockout.service';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-knockout',
    templateUrl: './knockout.page.html',
    styleUrls: ['./knockout.page.scss'],
})
export class KnockoutPage {
    constructor(private poulePredictionService: PoulepredictionService,
        private knockoutService: KnockoutService,
        private toastService: ToastService,
        private uiService: UiService) {
    }

    public activeKnockoutRound = '16';
    public speelschema: IKnockout[];
    private nummerDries: IPoulePrediction[];
    private nummerDrieIdentifier: string;
    private poules: any[];
    public segmentIndex = 1;

    public rounds = [
        {
            round: '16',
            text: '1/8 F',
            next: '8'
        }, {
            round: '8',
            text: '1/4 F',
            next: '4'
        }, {
            round: '4',
            text: '1/2 F',
            next: '3'
        }, {
            round: '3',
            text: '3/4 p',
            next: '2'
        }, {
            round: '2',
            text: 'F'
        },
    ]

    ionViewWillEnter() {

        this.poulePredictionService.getPouleResults()
            .pipe(switchMap((pp) => {
                this.poules = pp;
                this.nummerDries = pp.filter(item => item.positie === 3)
                .sort((a, b) => b.thirdPositionScore - a.thirdPositionScore)
                .slice(0, 4);
    
                this.nummerDrieIdentifier = this.nummerDries.sort((a, b) => {
                    if (b.poule > a.poule) {
                        return -1;
                    }
                    if (a.poule > b.poule) {
                        return 1;
                    }
                    return 0;
                }).reduce((acc: string, val) => acc + val.poule, '');
    
                return this.knockoutService.getOriginalSpeelschema()
            })).subscribe(speelschema => {
                
                const thirdplaces = this.poulePredictionService.getPositionForThirdPlacedTeams(this.nummerDrieIdentifier);

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
                        homeTeam: this.setTeam(speelschema, match.homeId, match.round, null),
                        awayTeam: this.setTeam(speelschema, match.awayId, match.round, null)
                    }
                });
            });
    }

    setTeam(speelschema, id, round, selectedTeam: string): ITeam {
        if (round === '16') {
            let poule = this.poules.find(p => {
                var combinedId = p.positie + p.poule
                console.log(id)
                console.log(combinedId)
                return id === combinedId
            })
            if (poule) {
                console.log('poule gevonden')
                return poule.team
            } else {
                console.log('poule niet gevonden')
                return this.poules[0].team
            }
        } else if (round === '3') {
            // uitzondering voor Verliezer
            const matchLoser = speelschema.find(sp => sp.matchId === id.substring(1));
            const team = this.getLoserTeam(matchLoser, selectedTeam, id)
            return team;
        } else {
            const matchWinner = speelschema.find(sp => sp.matchId === id);
            const team = this.getWinnerTeam(matchWinner, selectedTeam, id)
            return team;
        }
    }

    getWinnerTeam(matchWinner, selectedTeam, id): ITeam {
        const team = selectedTeam ?
            matchWinner && matchWinner.homeTeam && matchWinner.homeTeam.id === selectedTeam ?
                matchWinner.homeTeam :
                matchWinner.awayTeam :
            matchWinner && matchWinner.prediction && matchWinner.prediction.selectedTeam ?
                matchWinner.prediction.selectedTeam :
                matchWinner && matchWinner.selectedTeam ?
                    matchWinner.homeTeam.id === matchWinner.selectedTeam.id ?
                        matchWinner.homeTeam :
                        matchWinner.awayTeam :
                    { name: id };
        return team;
    }

    getLoserTeam(matchLoser, selectedTeam, id) {
        const team =
            selectedTeam ? // als team geselecteerd in UI
                matchLoser && matchLoser.homeTeam && matchLoser.homeTeam.id === selectedTeam ? // bepaal wie de winnaar is en geef de andere door
                    matchLoser.awayTeam :
                    matchLoser.homeTeam :
                matchLoser && matchLoser.selectedTeam ? // bij initieel inladen, kijk wie er geselecteerd is
                    matchLoser.homeTeam.id === matchLoser.selectedTeam.id ? // bepaal wie de winnaar is en geef de andere door
                        matchLoser.awayTeam :
                        matchLoser.homeTeam :
                    { name: id }; // geef anders originele id terug
        return team;
    }

    selectKnockoutRound($event) {
        this.activeKnockoutRound = $event.detail.value;
    }

    scrollSegments(index: number) {
        this.segmentIndex = index - 1;
        const segment = document.querySelector('ion-segment');
        const active = segment.querySelectorAll('ion-segment-button')[index];
        if (active) {
            active.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
    }

    setSelectedTeam(match: IKnockout, $event) {
        this.speelschema = this.speelschema
            .map(m => {
                if (m.id === match.id) {
                    this.uiService.isDirty$.next(false);
                    return {
                        ...m,
                        selectedTeam: { id: $event.detail.value }
                    }
                } else {
                    return m;
                }
            })

        const matchToUpdate = this.speelschema.find(m => m.homeId === match.matchId || m.awayId === match.matchId)
        this.speelschema = this.speelschema.map(m => {
            if (matchToUpdate && m.matchId === matchToUpdate.matchId) {
                if (m.homeId === match.matchId) {
                    return {
                        ...m,
                        homeTeam: this.setTeam(this.speelschema, m.homeId, m.round, $event.detail.value)
                    }
                } else {
                    return {
                        ...m,
                        awayTeam: this.setTeam(this.speelschema, m.awayId, m.round, $event.detail.value)
                    }
                }
            } else {
                return m;
            }
        })
    }

    save(match: IKnockout) {
        this.knockoutService.updateKnockout({
            id: match.id,
            winnerTeam: match.selectedTeam,
            homeTeam: { id: match.homeTeam.id },
            awayTeam: { id: match.awayTeam.id },
            homeScore: match.homeScore,
            awayScore: match.awayScore
        })
            .subscribe(response => {
                this.toastService.presentToast('Opslaan is gelukt')
                this.speelschema = this.speelschema.map(item => {
                    return {
                        ...item,
                        prediction: { selectedTeam: match.selectedTeam }
                    };
                }
                )
            }, error => {
                this.toastService.presentToast(error && error.error && error.error.message ? error.error.message : 'Er is iets misgegaan', 'warning');
            });
    }
}