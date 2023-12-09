import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {IKnockout, UpdateKnockoutDto} from '../models/knockout.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class KnockoutService {

    constructor(private http: HttpClient) {
    }

    saveKnockoutRound(knockoutRounds: any[]): Observable<any> {
        return this.http.post<any[]>(`${environment.apiBaseUrl}/knockout`, knockoutRounds);
    }

    getPersonalSpeelschema(): Observable<IKnockout[]> {
        return this.http.get<IKnockout[]>(`${environment.apiBaseUrl}/knockout/mine`);
    }

    getOriginalSpeelschema(): Observable<IKnockout[]> {
        return this.http.get<IKnockout[]>(`${environment.apiBaseUrl}/knockout`);
    }

    updateKnockout(body: UpdateKnockoutDto): Observable<IKnockout> {
        return this.http.put<IKnockout>(`${environment.apiBaseUrl}/knockout`, body);
    }
}
