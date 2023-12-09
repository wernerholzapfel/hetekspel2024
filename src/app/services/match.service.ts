import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IMatchPrediction} from '../models/participant.model';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {IMatch, UpdateMatchDto} from '../models/poule.model';

@Injectable({
    providedIn: 'root'
})
export class MatchService {

    constructor(private http: HttpClient) {
    }

    getMatches(): Observable<IMatch[]> {
        return this.http.get<IMatch[]>(`${environment.apiBaseUrl}/match`)
            .pipe(map(res => res as IMatch[]));
    }

    getMatchesFullScore(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiBaseUrl}/match/fullscore`);
    }
    
    getUpcomingMatches(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiBaseUrl}/match/upcoming`);
    }

    getMatch(matchId): Observable<IMatch> {
        return this.http.get<IMatch>(`${environment.apiBaseUrl}/match/${matchId}`);
    }

    updateMatch(body: UpdateMatchDto): Observable<IMatch> {
        return this.http.put<IMatch>(`${environment.apiBaseUrl}/match`, body);
    }

    getMatchPredictions(): Observable<IMatchPrediction[]> {
        return this.http.get<IMatchPrediction[]>(`${environment.apiBaseUrl}/match-prediction`)
            .pipe(map(res => res as IMatchPrediction[]));
    }

    getMatchPredictionsForParticipant(participantId): Observable<IMatchPrediction[]> {
        return this.http.get<IMatchPrediction[]>(`${environment.apiBaseUrl}/match-prediction/${participantId}`);
    }
    
    getTodaysMatchPredictionsForParticipant(): Observable<any> {
        return this.http.get<any>(`${environment.apiBaseUrl}/match-prediction/today`);
    }


    saveMatchPrediction(matchPredictions: IMatchPrediction): Observable<IMatchPrediction> {
        return this.http.post<IMatchPrediction>(`${environment.apiBaseUrl}/match-prediction`, matchPredictions);
    }
}
