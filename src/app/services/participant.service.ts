import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {IParticipant} from '../models/participant.model';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {UiService} from './ui.service';

@Injectable()
export class ParticipantService {

    constructor(private http: HttpClient, private uiService: UiService) {
    }


    postParticipant(body: IParticipant): Observable<IParticipant> {
        return this.http.post<IParticipant>(`${environment.apiBaseUrl}/participant`, body)
            .pipe(map(res => {
                this.uiService.participant$.next(res);
                return res as IParticipant;
            }));
    }

    getParticipant(): Observable<IParticipant> {
        return this.http.get<IParticipant>(`${environment.apiBaseUrl}/participant/mine`)
            .pipe(map(res => {
                this.uiService.participant$.next(res);
                return res as IParticipant;
            }));
    }

    getParticipants(): Observable<IParticipant[]> {
        return this.http.get<IParticipant[]>(`${environment.apiBaseUrl}/participant`);
    }

    putPushToken(body: { pushtoken: string }): Observable<IParticipant> {
        return this.http.put<IParticipant>(`${environment.apiBaseUrl}/participant/pushtoken`, body);
    }

    updateDisplayName(body: {id: string, displayName: string}): Observable<IParticipant> {
        return this.http.put<IParticipant>(`${environment.apiBaseUrl}/participant/displayname`, body);
    }

}
