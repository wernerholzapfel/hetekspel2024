import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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

    getKnockoutForParticipant(participantId: string): Observable<IDeelnemerSpeelschema> {
        return this.http.get<IDeelnemerSpeelschema>(`${environment.apiBaseUrl}/knockout-prediction/${participantId}`);
    }

    getParticipantForKnockoutTeamInRound(roundId: string, teamId: string): Observable<any> {
        return this.http.get<any>(`${environment.apiBaseUrl}/knockout-prediction/round/${roundId}/team/${teamId}`);
    }


}
