import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import {Observable} from 'rxjs';
import {UiService} from '../services/ui.service';
import {delay, map, retryWhen} from 'rxjs/operators';
import {HetwkspelService} from '../services/hetwkspel.service';
import { DEELNEMER_LAST_TAB_KEY } from '../pages/deelnemer/deelnemer.page';

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
                    const lastTab = localStorage.getItem(DEELNEMER_LAST_TAB_KEY) ?? 'matches';
                    const url: UrlTree = this.router.createUrlTree([`deelnemer/deelnemer/${participant.id}/${lastTab}`]);
                    return url;
                } else {
                    return false;
                }
            }))
    }
}
