import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IKnockout } from '../models/knockout.model';
import { ISaveKnockoutResultBody, ISaveKnockoutResultLoserBody } from '../models/knockout-result.model';

@Injectable({
    providedIn: 'root'
})
export class KnockoutResultService {

    constructor(private http: HttpClient) {
    }

    getOriginalSpeelschema(): Observable<IKnockout[]> {
        return this.http.get<IKnockout[]>(`${environment.apiBaseUrl}/knockout`);
    }

    saveKnockoutResult(body: ISaveKnockoutResultBody): Observable<any> {
        return this.http.post<any>(`${environment.apiBaseUrl}/knockout-result/one`, body);
    }
    
    saveKnockoutLoserResult(body: ISaveKnockoutResultLoserBody): Observable<any> {
        return this.http.post<any>(`${environment.apiBaseUrl}/knockout-result/loser`, body);
    }
}
