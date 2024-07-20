import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { BehaviorSubject } from 'rxjs';

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
    hideInOfflineMode: boolean
}

@Injectable({
    providedIn: 'root'
})

export class MenuService {

    constructor(private db: AngularFireDatabase) {
    }

    public appPages$: BehaviorSubject<MenuItem[]> = new BehaviorSubject([
        {
            title: 'Home',
            url: '/home',
            urls: ['/home', '/offline'],
            icon: 'home',
            active: true,
            onlyForAdmin: false,
            onlyForUser: false,
            showAfterRegistration: false,
            hideInOfflineMode: false
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
            hideAfterRegistration: true,
            hideInOfflineMode: true


        }, {
            title: 'Deelnemers',
            url: '/deelnemers',
            urls: ['/deelnemers'],
            icon: 'people-outline',
            active: false,
            onlyForAdmin: false,
            onlyForUser: true,
            showAfterRegistration: false,
            hideAfterRegistration: true,
            hideInOfflineMode: true


        }, {
            title: 'Voorspelling',
            url: '/deelnemer/deelnemer/',
            urls: ['/prediction', '/deelnemer'],
            icon: 'football-outline',
            active: false,
            onlyForAdmin: false,
            onlyForUser: true,
            showAfterRegistration: true,
            hideBeforeRegistration: true,
            hideInOfflineMode: true


        }, {
            title: 'Stand',
            url: '/stand',
            urls: ['/stand'],
            icon: 'podium-outline',
            active: false,
            onlyForAdmin: false,
            onlyForUser: true,
            showAfterRegistration: true,
            hideInOfflineMode: false


        }, {
            title: 'Statistieken',
            url: '/stats',
            urls: ['/stats'],
            icon: 'stats-chart-outline',
            active: false,
            onlyForAdmin: false,
            onlyForUser: true,
            showAfterRegistration: true,
            hideInOfflineMode: false


        }, {
            title: 'Speelschema',
            url: '/speelschema',
            urls: ['/speelschema'],
            icon: 'calendar-outline',
            active: false,
            onlyForAdmin: false,
            onlyForUser: false,
            showAfterRegistration: false,
            hideInOfflineMode: true

        }, {
            title: 'Spelregels',
            url: '/spelregels',
            urls: ['/spelregels'],
            icon: 'bulb-outline',
            active: false,
            onlyForAdmin: false,
            onlyForUser: false,
            showAfterRegistration: false,
            hideInOfflineMode: false


        }, {
            title: 'Hall of Fame',
            url: '/halloffame',
            urls: ['/halloffame'],
            icon: 'ribbon-outline',
            active: false,
            onlyForAdmin: false,
            onlyForUser: false,
            showAfterRegistration: false,
            hideInOfflineMode: false

        }, {
            title: 'Admin',
            url: '/results',
            urls: ['/results'],
            icon: 'create-outline',
            active: false,
            onlyForAdmin: true,
            onlyForUser: false,
            showAfterRegistration: false,
            hideInOfflineMode: true


        }, {
            title: 'Profiel',
            url: '/profiel',
            urls: ['/profiel'],
            icon: 'person-outline',
            active: false,
            onlyForAdmin: false,
            onlyForUser: true,
            showAfterRegistration: false,
            hideInOfflineMode: false


        }, {
            title: 'Disclaimer',
            url: '/disclaimer',
            urls: ['/disclaimer'],
            icon: 'document-outline',
            active: false,
            onlyForAdmin: false,
            onlyForUser: false,
            showAfterRegistration: false,
            hideInOfflineMode: false


        }
    ]);


    setMenu(admin: boolean, user, registrationOpen: boolean, offlineMode: boolean) {
        console.log(registrationOpen)
        this.appPages$.next(this.appPages$.getValue().map(item => {
            return {
                ...item,
                show: offlineMode && item.hideInOfflineMode
                    ? false
                    : item.onlyForAdmin
                        ? admin
                        : item.hideBeforeRegistration
                            ? !registrationOpen && user
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
