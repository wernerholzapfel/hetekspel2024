import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {IKnockout, UpdateKnockoutDto} from '../models/knockout.model';
import {HttpClient} from '@angular/common/http';
import { ITeam } from '../models/poule.model';

@Injectable({
    providedIn: 'root'
})
export class KnockoutHelperService {

    constructor() {
    }

    public rounds = [
        {
            round: '16',
            text: '1/8 F',
            next: '8',
            teams: []
        }, {
            round: '8',
            text: '1/4 F',
            next: '4',
            teams: []
        }, {
            round: '4',
            text: '1/2 F',
            next: '3',
            teams: []
        }, {
            round: '3',
            text: '3p',
            next: '2',
            teams: []
        }, {
            round: '2',
            text: 'F',
            next: null,
            teams: []
        },
    ];

    public setTeam(speelschema, id, round, poules, selectedTeam: string): ITeam {
        if (round === '16') {
            return poules.find(p => id === `${p.positie}${p.poule}`) ? poules.find(p => id === `${p.positie}${p.poule}`).team : '';
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
    private getWinnerTeam(matchWinner, selectedTeam, id): ITeam {
        const team = selectedTeam ?
        matchWinner && matchWinner.homeTeam && matchWinner.homeTeam.id === selectedTeam ?
            matchWinner.homeTeam :
            matchWinner.awayTeam :
        matchWinner && matchWinner.prediction && matchWinner.prediction.selectedTeam?
            matchWinner.prediction.selectedTeam :
            matchWinner && matchWinner.selectedTeam ?
                matchWinner.homeTeam.id === matchWinner.selectedTeam.id ?
                    matchWinner.homeTeam :
                    matchWinner.awayTeam :
                {name: id};
                return team;
    }

    private getLoserTeam(matchLoser, selectedTeam, id) {
        
        if (selectedTeam) {
            if (matchLoser && matchLoser.homeTeam && matchLoser.homeTeam.id === selectedTeam) {
                return matchLoser.awayTeam
            } else {
                return matchLoser.homeTeam
            }
        } else {
            if (matchLoser && ((matchLoser.prediction && matchLoser.prediction.selectedTeam) || matchLoser.selectedTeam)) {
                if (matchLoser.homeTeam.id === matchLoser.selectedTeam.id) {
                    return matchLoser.awayTeam
                } else {
                    return matchLoser.homeTeam
                }
            } else {
                return { name: id };
            }
        }
    }
}
