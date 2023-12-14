import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard  {
    canDeactivate(component: CanComponentDeactivate,
                  route: ActivatedRouteSnapshot,
                  state: RouterStateSnapshot) {

        const url: string = state.url;

        return component.canDeactivate ? component.canDeactivate() : true;
    }
}
