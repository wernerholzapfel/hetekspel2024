import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RouteStateService {
  private component;

  constructor() {
  }

  public setCurrentRouteComponent(component) {
    this.component = component;
  }

  public getCurrentRouteComponent() {
    return this.component;
  }
}
