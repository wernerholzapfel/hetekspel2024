import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StandService {

    constructor(private http: HttpClient) {
    }

    createStand(): Observable<any[]> {
        return this.http.post<any[]>(`${environment.apiBaseUrl}/stand`, {});
    }

    // calculatePosition(stand: any[], isMatchStand) {
    //     let previousPosition = 1;
    //     return stand.map((participant, index) => {
    //         if (isMatchStand) {
    //             if (index > 0 && participant && participant.matchPoints === stand[index - 1].matchPoints) {
    //                 return {
    //                     ...participant,
    //                     position: previousPosition,
    //                     deltaPosition: participant.previousMatchPosition - participant.matchPosition
    //                 };
    //             } else {
    //                 previousPosition = index + 1;
    //                 return {
    //                     ...participant,
    //                     position: index + 1,
    //                     deltaPosition: participant.previousMatchPosition - participant.matchPosition 
    //                 };
    //             }
    //         } else {
    //         if (index > 0 && participant && participant.totalPoints === stand[index - 1].totalPoints) {
    //             return {
    //                 ...participant,
    //                 position: previousPosition,
    //                 deltaPosition: participant.previousPosition - participant.position
    //             };
    //         } else {
    //             previousPosition = index + 1;
    //             return {
    //                 ...participant,
    //                 position: index + 1,
    //                 deltaPosition: participant.previousPosition - participant.position
    //             };
    //         }
    //         }
    //     });
    // }
}
