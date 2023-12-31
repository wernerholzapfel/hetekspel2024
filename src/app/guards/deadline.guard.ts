import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import {Observable} from 'rxjs';
import {UiService} from '../services/ui.service';
import {delay, map, retryWhen} from 'rxjs/operators';
import {HetwkspelService} from '../services/hetwkspel.service';

@Injectable({
    providedIn: 'root'
})
export class DeadlineGuard  {
    constructor(private uiService: UiService, private hetwkspelService: HetwkspelService) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.uiService.isRegistrationOpen$.pipe(map(response => {
            if (response === null) {
                throw new Error();
            } else {
                return response;
            }
        }), retryWhen(errors => {
            return this.uiService.isRegistrationOpen$.pipe(delay(200));
        }));
    }

}
