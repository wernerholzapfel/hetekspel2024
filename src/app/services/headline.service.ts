import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {IHeadline} from '../models/headline.model';

@Injectable({
    providedIn: 'root'
})
export class HeadlineService {

    constructor(private http: HttpClient) {
    }

    getHeadlines(): Observable<IHeadline[]> {

        return this.http.get<IHeadline[]>(`${environment.apiBaseUrl}/headline/`);
    }

    saveHeadline(body: IHeadline): Observable<IHeadline> {
        return this.http.post<IHeadline>(`${environment.apiBaseUrl}/headline`, body);
    }
}
