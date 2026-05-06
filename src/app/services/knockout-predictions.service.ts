import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {IKnockoutPrediction} from '../models/knockout-predictions.model';
import { IDeelnemerSpeelschema, IKnockout } from '../models/knockout.model';

@Injectable({
    providedIn: 'root'
})
export class KnockoutPredictionsService {

    constructor(private http: HttpClient) {
    }

    getKnockoutForParticipant(participantId: string): Observable<IKnockout[]> {
        return this.http.get<IKnockout[]>(`${environment.apiBaseUrl}/knockout/${participantId}`);
    }
    getWinnersForParticipant(participantId: string): Observable<IKnockout[]> {
        return this.http.get<IKnockout[]>(`${environment.apiBaseUrl}/knockout/winners/${participantId}`);
    }
    
    // getKnockoutForLoggedInUser(): Observable<IKnockout[]> {
        // return this.http.get<IKnockout[]>(`${environment.apiBaseUrl}/knockout-prediction/mine`);
    // }

    getParticipantForKnockoutTeamInRound(roundId: string, teamId: string): Observable<any> {
        return this.http.get<any>(`${environment.apiBaseUrl}/stats/round/${roundId}/team/${teamId}`);
    }


}
