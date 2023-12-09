import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {IHetwkspel} from '../models/hetwkspel.model';

@Injectable({
  providedIn: 'root'
})
export class HetwkspelService {

  constructor(private http: HttpClient) {
  }

  getHetwkspel(): Observable<IHetwkspel> {
    return this.http.get<IHetwkspel>(`${environment.apiBaseUrl}/hetekspel/`);
  }
}
