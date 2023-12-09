import {Injectable} from '@angular/core';
import {IPoulePrediction} from '../models/participant.model';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ISaveKnockoutPredictionOneBody, ISaveKnockoutPredictionsBody} from '../models/knockout-predictions.model';

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

    getPositionForThirdPlacedTeams(nummerDrieIdentifier: string): { identifier: string, WB: string, WC: string, WE: string, WF: string } {
        return [
            {
                identifier: 'ABCD',
                WB: '3A',
                WC: '3D',
                WE: '3B',
                WF: '3C'
            }, {
                identifier: 'ABCE',
                WB: '3A',
                WC: '3E',
                WE: '3B',
                WF: '3C'
            }, {
                identifier: 'ABCF',
                WB: '3A',
                WC: '3F',
                WE: '3B',
                WF: '3C'
            }, {
                identifier: 'ABDE',
                WB: '3D',
                WC: '3E',
                WE: '3A',
                WF: '3B'
            }, {
                identifier: 'ABDF',
                WB: '3D',
                WC: '3F',
                WE: '3A',
                WF: '3B'
            }, {
                identifier: 'ABEF',
                WB: '3E',
                WC: '3F',
                WE: '3B',
                WF: '3A'
            }, {
                identifier: 'ACDE',
                WB: '3E',
                WC: '3D',
                WE: '3C',
                WF: '3A'
            }, {
                identifier: 'ACDF',
                WB: '3F',
                WC: '3D',
                WE: '3C',
                WF: '3A'
            }, {
                identifier: 'ACEF',
                WB: '3E',
                WC: '3F',
                WE: '3C',
                WF: '3A'
            }, {
                identifier: 'ADEF',
                WB: '3E',
                WC: '3F',
                WE: '3D',
                WF: '3A'
            }, {
                identifier: 'BCDE',
                WB: '3E',
                WC: '3D',
                WE: '3B',
                WF: '3C'
            }, {
                identifier: 'BCDF',
                WB: '3F',
                WC: '3D',
                WE: '3C',
                WF: '3B'
            }, {
                identifier: 'BCEF',
                WB: '3F',
                WC: '3E',
                WE: '3C',
                WF: '3B'
            }, {
                identifier: 'BDEF',
                WB: '3F',
                WC: '3E',
                WE: '3D',
                WF: '3B'
            }, {
                identifier: 'CDEF',
                WB: '3F',
                WC: '3E',
                WE: '3D',
                WF: '3C'
            }
        ].find(p => p.identifier === nummerDrieIdentifier);
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
