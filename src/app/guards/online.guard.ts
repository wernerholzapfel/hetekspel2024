import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UiService } from '../services/ui.service';
import { delay, map, retryWhen } from 'rxjs/operators';
import { HetwkspelService } from '../services/hetwkspel.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
    providedIn: 'root'
})
export class OnlineGuard {
    constructor(private router: Router, private db: AngularFireDatabase) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.db.object<any>(`offlineMode`)
            .valueChanges()
            .pipe(map(offlineMode => {
                if (!offlineMode) {
                    return route.data && route.data.redirectUrl ? this.router.createUrlTree([route.data.redirectUrl]) : false;
                }
                else { return true }
            }))
    }
}