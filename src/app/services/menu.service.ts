import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export interface MenuItem {
    title: string;
    url: string;
    urls: string[];
    icon: string;
    active: boolean;
    onlyForAdmin: boolean;
    onlyForUser: boolean;
    showAfterRegistration?: boolean;
    hideAfterRegistration?: boolean;
    hideBeforeRegistration?: boolean;
    show?: boolean;
}

@Injectable({
    providedIn: 'root'
})

export class MenuService {

    constructor() {
    }

    public appPages$: BehaviorSubject<MenuItem[]> = new BehaviorSubject([
        {
            title: 'Home',
            url: '/home',
            urls: ['/home'],
            icon: 'home',
            active: true,
            onlyForAdmin: false,
            onlyForUser: false,
            showAfterRegistration: false
        },
        {
            title: 'Voorspellen',
            url: '/prediction',
            urls: ['/prediction'],
            icon: 'football-outline',
            active: false,
            onlyForAdmin: false,
            onlyForUser: true,
            showAfterRegistration: false,
            hideAfterRegistration: true

        }, {
            title: 'Deelnemers',
            url: '/deelnemers',
            urls: ['/deelnemers'],
            icon: 'people-outline',
            active: false,
            onlyForAdmin: false,
            onlyForUser: true,
            showAfterRegistration: false,
            hideAfterRegistration: true

        }, {
            title: 'Voorspelling',
            url: '/deelnemer/deelnemer/',
            urls: ['/prediction', '/deelnemer'],
            icon: 'football-outline',
            active: false,
            onlyForAdmin: false,
            onlyForUser: true,
            showAfterRegistration: true,
            hideBeforeRegistration: true

        }, {
            title: 'Stand',
            url: '/stand',
            urls: ['/stand'],
            icon: 'podium-outline',
            active: false,
            onlyForAdmin: false,
            onlyForUser: true,
            showAfterRegistration: true

        }, {
            title: 'Statistieken',
            url: '/stats',
            urls: ['/stats'],
            icon: 'stats-chart-outline',
            active: false,
            onlyForAdmin: false,
            onlyForUser: true,
            showAfterRegistration: true

        }, {
            title: 'Speelschema',
            url: '/speelschema',
            urls: ['/speelschema'],
            icon: 'calendar-outline',
            active: false,
            onlyForAdmin: false,
            onlyForUser: false,
            showAfterRegistration: false
        }, {
            title: 'Spelregels',
            url: '/spelregels',
            urls: ['/spelregels'],
            icon: 'bulb-outline',
            active: false,
            onlyForAdmin: false,
            onlyForUser: false,
            showAfterRegistration: false

        }, {
            title: 'Hall of Fame',
            url: '/halloffame',
            urls: ['/halloffame'],
            icon: 'ribbon-outline',
            active: false,
            onlyForAdmin: false,
            onlyForUser: false,
            showAfterRegistration: false
        }, {
            title: 'Admin',
            url: '/results',
            urls: ['/results'],
            icon: 'create-outline',
            active: false,
            onlyForAdmin: true,
            onlyForUser: false,
            showAfterRegistration: false

        },{
            title: 'Profiel',
            url: '/profiel',
            urls: ['/profiel'],
            icon: 'person-outline',
            active: false,
            onlyForAdmin: false,
            onlyForUser: true,
            showAfterRegistration: false

        }, {
            title: 'Disclaimer',
            url: '/disclaimer',
            urls: ['/disclaimer'],
            icon: 'document-outline',
            active: false,
            onlyForAdmin: false,
            onlyForUser: false,
            showAfterRegistration: false

        }
    ]);

    
    setMenu(admin: boolean, user, registrationOpen: boolean) {
        console.log(registrationOpen)
        this.appPages$.next(this.appPages$.getValue().map(item => {
            return {
                ...item,
                show: item.onlyForAdmin
                    ? admin
                    : item.hideBeforeRegistration ?
                        !registrationOpen && user
                        : item.hideAfterRegistration
                            ? registrationOpen && user
                            : item.showAfterRegistration
                                ? !registrationOpen && user
                                : item.onlyForUser
                                    ? user
                                    : true
            };
        }));
    }
}
