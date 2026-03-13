import {Injectable} from '@angular/core';
import {IPoulePrediction} from '../models/participant.model';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {ISaveKnockoutPredictionOneBody, ISaveKnockoutPredictionsBody} from '../models/knockout-predictions.model';
import { nummerDrieSchema } from './nummerdrieschema';

@Injectable({
    providedIn: 'root'
})
export class PoulepredictionService {

    constructor(private http: HttpClient) {
    }

    savePoulePredictions(poulePredictions: IPoulePrediction[]): Observable<any> {
        return this.http.post<IPoulePrediction[]>(`${environment.apiBaseUrl}/poule-prediction`, poulePredictions);
    }

    saveKnockoutPredictions(knockoutPredictions: ISaveKnockoutPredictionsBody[]): Observable<any> {
        return this.http.post<ISaveKnockoutPredictionsBody[]>(`${environment.apiBaseUrl}/knockout-prediction`, knockoutPredictions);
    }

    deleteKnockoutPredictions(): Observable<any> {
        return this.http.delete(`${environment.apiBaseUrl}/knockout-prediction`);
    }

    saveKnockoutPrediction(knockoutPredictions: ISaveKnockoutPredictionOneBody): Observable<any> {
        return this.http.post<ISaveKnockoutPredictionsBody[]>(`${environment.apiBaseUrl}/knockout-prediction/one`, knockoutPredictions);
    }

    getPoulePredictions(): Observable<any> {
        return this.http.get<any>(`${environment.apiBaseUrl}/poule-prediction`);
    }
    
    getStandBasedOnPredictionsForLoggedInUser(pouleName: string): Observable<any> {
        return this.http.get<any>(`${environment.apiBaseUrl}/poule-prediction/poule/${pouleName}`);
    }

    getPoulePredictionsByParticipant(participantId): Observable<any[]> {
        return this.http.get<any>(`${environment.apiBaseUrl}/poule-prediction/${participantId}`);
    }

    getPouleResults(): Observable<any> {
        return this.http.get<any>(`${environment.apiBaseUrl}/poule-prediction/admin/results`);
    }

   
    getPositionForThirdPlacedTeams(nummerDrieIdentifier: string): { identifier: string, WA: string, WB: string, WD: string, WE: string, WG: string, WI: string, WK: string, WL: string } {
        if (nummerDrieIdentifier.length === 8) {
            return nummerDrieSchema.find(p => p.identifier === nummerDrieIdentifier);
        } else {
            return {
                identifier: undefined,
                WA: 'WA',
                WB: 'WB',
                WD: 'WD',
                WE: 'WE',
                WG: 'WG',
                WI: 'WI',
                WK: 'WK',
                WL: 'WL'
            }
        }
   
    }
}

// return [
//     {
//         id: 38,
//         round: '16',
//         home: '2A',
//         away: '2B',
//         city: 'Amsterdam'
//     },
//     {
//         id: 37,
//         round: '16',
//         home: '1A',
//         away: '2C',
//         city: 'London'
//     },
//     {
//         id: 40,
//         round: '16',
//         home: '1C',
//         away: 'WC',
//         city: 'Budapest'
//     },
//     {
//         id: 39,
//         round: '16',
//         home: '1B',
//         away: 'WB',
//         city: 'Bilbao'
//     },
//     {
//         id: 42,
//         round: '16',
//         home: '2D',
//         away: '2E',
//         city: 'Kopenhagen'
//     },
//     {
//         id: 41,
//         round: '16',
//         home: '1F',
//         away: 'WF', // todo
//         city: 'Boekarest'
//     },
//     {
//         id: 44,
//         round: '16',
//         home: '1D',
//         away: '2F',
//         city: 'Dublin'
//     },{
//         id: 43,
//         round: '16',
//         home: '1E',
//         away: 'WE',
//         city: 'Glasgow'
//     },
//     {
//         id: 45,
//         round: '8',
//         home: '41',
//         away: '42',
//         city: 'st-petersburg'
//     }, {
//         id: 46,
//         round: '8',
//         home: '39',
//         away: '37',
//         city: 'munich'
//     },
//     {
//         id: 47,
//         round: '8',
//         home: '40',
//         away: '38',
//         city: 'baku'
//     },
//     {
//         id: 48,
//         round: '8',
//         home: '43',
//         away: '44',
//         city: 'rome'
//     },
//     {
//         id: 49,
//         round: '4',
//         home: '46',
//         away: '45',
//         city: 'london'
//     },
//     {
//         id: 50,
//         round: '4',
//         home: '48',
//         away: '47',
//         city: 'london'
//     }, {
//         id: 51,
//         round: '2',
//         home: '49',
//         away: '50',
//         city: 'london'
//     },
//
// ]
