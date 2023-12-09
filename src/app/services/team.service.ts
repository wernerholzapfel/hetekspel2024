import {Injectable} from '@angular/core';
import {ITeam, UpdateTeamPositionDto} from '../models/poule.model';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient) {
  }

  updateTeam(body: UpdateTeamPositionDto): Observable<ITeam> {
    return this.http.put<ITeam>(`${environment.apiBaseUrl}/team`, body);
  }
  getLatestActive(): Observable<{team: ITeam, round: string}[]> {
    return this.http.get<{team: ITeam, round: string}[]>(`${environment.apiBaseUrl}/team/latestActive`);
  }
}
