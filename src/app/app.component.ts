import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { MenuItem, MenuService } from './services/menu.service';
import { combineLatest, of, Subject, timer } from 'rxjs';
import { NavigationEnd, Router, Event, RouterEvent } from '@angular/router';
import { switchMap, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { UiService } from './services/ui.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { LoaderService } from './services/loader.service';
import { ParticipantService } from './services/participant.service';
import * as moment from 'moment';
import { HetwkspelService } from './services/hetwkspel.service';
import { RouteStateService } from './services/route-state.service';
import {
    PushNotifications,
    PushNotificationSchema,
    Token,
} from '@capacitor/push-notifications';
import { CapacitorUpdater } from '@capgo/capacitor-updater'

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    public appPages: MenuItem[];
    unsubscribe = new Subject<void>();

    constructor(
        private platform: Platform,
        private router: Router,
        private db: AngularFireDatabase,
        private menuService: MenuService,
        public authService: AuthService,
        public uiService: UiService,
        private loaderService: LoaderService,
        private hetwkspelService: HetwkspelService,
        private participantService: ParticipantService,
        private routeStateService: RouteStateService,
        private ngZone: NgZone
    ) {
        this.initializeApp();
    }


    initializeApp() {
        this.checkDeadline();
        this.checkDarkmode();
        this.platform.ready().then(async () => {

            if (this.platform.is('hybrid')) {

                CapacitorUpdater.notifyAppReady();

                // await StatusBar.styleDefault();
                await SplashScreen.hide();
                this.registerToken()
                // Request permission to use push notifications
                // iOS will prompt user and return if they granted permission or not
                // Android will just grant without prompting
                PushNotifications.requestPermissions().then(result => {
                    if (result.receive === 'granted') {
                        // Register with Apple / Google to receive push via APNS/FCM
                        PushNotifications.register();
                    } else {
                        // Show some error
                    }
                });

                // On success, we should be able to receive notifications
                PushNotifications.addListener('registration',
                    (token: Token) => {
                        this.uiService.pushToken$.next(token.value)
                    }
                );

                // Some issue with our setup and push will not work
                PushNotifications.addListener('registrationError',
                    (error: any) => {
                        alert('Error on registration: ' + JSON.stringify(error));
                    }
                );

                // Show us the notification payload if the app is open on our device
                PushNotifications.addListener('pushNotificationReceived',
                    (notification: PushNotificationSchema) => {
                    }
                );

                // Method called when tapping on a notification
                // PushNotifications.addListener('pushNotificationActionPerformed',
                // (notification: ActionPerformed) => {
                // alert('Push action performed: ' + JSON.stringify(notification));
                // }
                // );

            }
        });
    }

    ngOnInit() {
        combineLatest([this.authService.user$, this.uiService.participant$])
            .subscribe(([user, participant]) => {
                if (participant === null && user && user.uid) {
                    console.log(' ingelogd maar geen db record')
                }
            })
        this.menuService.appPages$.pipe(takeUntil(this.unsubscribe)).subscribe(menu => {
            if (menu) {
                this.appPages = menu;
            }
        });

        this.db.list<any>(`ek2024/totaal`)
            .valueChanges()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(totaalstand => {
                this.uiService.totaalstand$.next(totaalstand);
            });

        this.db.object<{ lastUpdated: number }>(`ek2024/lastUpdated`)
            .valueChanges()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(item => {
                this.uiService.lastUpdated$.next(item);
            });


        // set linkactive.
        this.router.events.pipe(takeUntil(this.unsubscribe)
        ).subscribe((event: Event | RouterEvent) => {
            if (event instanceof NavigationEnd) {
                this.menuService.appPages$.getValue().map(p => {
                    return Object.assign(p, {
                        active: p.urls.filter(url =>
                            (event.urlAfterRedirects.toLowerCase().startsWith(url.toLowerCase()))).length > 0
                    });
                });
            }
        });

        this.platform.resume.subscribe(() => {
            if (this.platform.is('cordova')) {
                this.refresh();
            }
        });
    }

    public refresh(): void {
        const currentPage = this.routeStateService.getCurrentRouteComponent();
        if (currentPage && currentPage.refresh) {
            currentPage.refresh(null);
        }
    }



    checkDarkmode() {
        // const prefersDarkMQL = window.matchMedia('(prefers-color-scheme: dark)');
        // this.uiService.prefersDark$.next(prefersDarkMQL.matches);
        // prefersDarkMQL.addListener((e) => {
        // this.ngZone.run(() => {
        // this.uiService.prefersDark$.next(e.matches);
        // });
        // });
        this.uiService.prefersDark$.next(false);

    }

    checkDeadline() {
        this.hetwkspelService.getHetwkspel().pipe(take(1))
            .pipe(switchMap((hetwkspel) => {
                const deadline = moment(hetwkspel.deadline);
                const now = moment(new Date());
                const diffDays = deadline.diff(now, 'milliseconds');
                console.log(diffDays)
                this.uiService.isRegistrationOpen$.next(diffDays > 0);

                return timer(diffDays);
            }))
            .pipe(takeUntil(this.unsubscribe)).subscribe(
                (x) => { },
                (y) => { },
                () => {
                    // this.uiService.isRegistrationOpen$.next(false); // todo timer complets before deadline
                }
            );
    }

    registerToken() {
        combineLatest([this.uiService.participant$, this.uiService.pushToken$])
            .pipe(switchMap(([participant, pushtoken]) => {
                if (participant && pushtoken) {
                    return this.participantService.putPushToken({ pushtoken: pushtoken })
                } else {
                    return of(null)
                }
            }))
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(token => {
                if (token) {
                }
            })

    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }
}
