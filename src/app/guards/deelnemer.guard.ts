import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import {Observable} from 'rxjs';
import {UiService} from '../services/ui.service';
import {delay, map, retryWhen} from 'rxjs/operators';
import {HetwkspelService} from '../services/hetwkspel.service';

@Injectable({
    providedIn: 'root'
})
export class DeelnemerGuard  {
    constructor(private uiService: UiService, private router: Router) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
            return this.uiService.participant$.pipe(map(participant => {
                if (participant) {
                    const url: UrlTree =  this.router.createUrlTree([`deelnemer/deelnemer/${participant.id}/matches`]);
                    return url;
                } else {
                    return false;
                }
            }))
    }
}
