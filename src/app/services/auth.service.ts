import {Injectable, OnInit} from '@angular/core';
import {combineLatest, from, Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {MenuService} from './menu.service';
import {distinctUntilChanged, switchMap, take} from 'rxjs/operators';
import {UiService} from './ui.service';
import {ParticipantService} from './participant.service';
import IdTokenResult = firebase.auth.IdTokenResult;

@Injectable()
export class AuthService {
    public user$: Observable<firebase.User>;
    public isAdmin = false;
    public displayName: string;
    public user: firebase.User;

    constructor(private fireAuth: AngularFireAuth,
                private router: Router,
                private menuService: MenuService,
                private uiService: UiService,
                private participantService: ParticipantService) {

        this.user$ = fireAuth.user;

        combineLatest([this.getTokenResult(), this.uiService.isRegistrationOpen$])
            .subscribe(
                ([tokenResult, isRegistrationOpen]) => {

                    if (tokenResult) {
                        this.isAdmin = tokenResult && tokenResult.claims ? tokenResult.claims.admin : false;
                        this.uiService.isAdmin$.next(this.isAdmin);
                        this.menuService.setMenu(this.isAdmin, !!tokenResult, isRegistrationOpen);
                    } else {
                        this.isAdmin = false;
                        this.uiService.isAdmin$.next(this.isAdmin);

                        this.menuService.setMenu(false, null, isRegistrationOpen);

                    }
                })

        this.user$.pipe(distinctUntilChanged())
            .pipe(switchMap(user => {
                if (user) {
                    return combineLatest([this.participantService.getParticipant(),
                        of(user)]);
                } else {
                    return combineLatest([of(null), of(null)]);
                }

            })).subscribe(([participant, user]) => {
            if (user) {
                this.user = user;
                this.displayName = user.displayName;
                if (participant) {
                    this.uiService.participant$.next(participant);
                }
            } else {
                this.user = null;
                this.displayName = null;
                this.uiService.participant$.next(null);
            }
        });
    }

    signInRegular(email, password) {
        return from(this.fireAuth.signInWithEmailAndPassword(email, password));
    }

    updateProfile(displayName: string) {
        this.fireAuth.user.pipe(take(1)).subscribe(user => {
            user.updateProfile({displayName});
        });
    }

    signUpRegular(email, password, displayName) {
        return this.fireAuth.createUserWithEmailAndPassword(email, password);
    }

    isLoggedIn() {
        return this.fireAuth.authState;
    }

    logout() {
        this.fireAuth.signOut()
            .then(() => {
                this.router.navigate(['/'], {replaceUrl: false});
            });
    }

    getToken(): Observable<string> {
        return this.fireAuth.idToken;
    }

    getTokenResult(): Observable<IdTokenResult> {
        return this.fireAuth.idTokenResult;
    }

    sendPasswordResetEmail(email: string): Promise<any> {
        return this.fireAuth.sendPasswordResetEmail(email);
    }
}
