import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StatsService {

    constructor(private http: HttpClient) {
    }

    createTotoStats(): Observable<any[]> {
        return this.http.post<any[]>(`${environment.apiBaseUrl}/stats/toto`, {});
    }

    createKnockoutStats(): Observable<any[]> {
        return this.http.post<any[]>(`${environment.apiBaseUrl}/stats/knockout`, {});
    }

    getParticipantsStats(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiBaseUrl}/stats/participants`, {});
    }
}
