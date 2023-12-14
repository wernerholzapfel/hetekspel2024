import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import {Observable} from 'rxjs';
import {UiService} from '../services/ui.service';
import {delay, map, retryWhen} from 'rxjs/operators';
import {HetwkspelService} from '../services/hetwkspel.service';

@Injectable({
    providedIn: 'root'
})
export class DonatieGuard  {
    constructor(private uiService: UiService, private hetwkspelService: HetwkspelService, private router: Router) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.hetwkspelService.getHetwkspel().pipe(map(response => {
            if (response === null) {
                throw new Error();
            } else {
                if (response.currentTable > 0 && localStorage.getItem('donatieGezien') !== 'true') {
                    this.router.navigate(['/doneren']);
                } else {
                    return true
                }

            }
        }), retryWhen(errors => {
            return this.uiService.isRegistrationOpen$.pipe(delay(200));
        }));
    }

}
