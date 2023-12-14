import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {ToastController} from '@ionic/angular';
import {ParticipantService} from '../../services/participant.service';
import {takeUntil} from 'rxjs/operators';
import {UiService} from '../../services/ui.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    user = {
        email: '',
        password: '',
        displayName: '',
    };
    activeSegment = 'inschrijven';

    unsubscribe = new Subject<void>();

    constructor(public authService: AuthService,
                public uiService: UiService,
                public toastController: ToastController,
                private participantService: ParticipantService
    ) {
    }

    userForm = new UntypedFormGroup({
        emailFormControl: new UntypedFormControl('', [
            Validators.required,
            Validators.email,
        ]),
        displayName: new UntypedFormControl('', [
            Validators.required,
        ]),
        passwordFormControl: new UntypedFormControl('', [
            Validators.required,
            Validators.minLength(8),
        ])
    });

    wachtwoordvergeten = false;

    ngOnInit() {
        this.uiService.isRegistrationOpen$
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(isRegistrationOpen => {
               this.activeSegment = isRegistrationOpen ? 'inschrijven' : 'inloggen';
            })
    }

    signInWithEmail() {
        this.authService.signInRegular(this.user.email, this.user.password)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(() => {
                
                this.user.email = '';
                this.user.password = '';
            }, async err => {
                const toast = await this.toastController.create({
                    message: err.message,
                    duration: 2000,
                    color: 'danger',
                    position: 'top',
                    cssClass: 'hes-toast',
                    animated: true,
                    mode: 'md'
                });
                toast.present();
            });
    }

    sendPasswordResetEmail() {
        this.authService.sendPasswordResetEmail(this.user.email)
            .then(async () => {
                const toast = await this.toastController.create({
                    message: 'Verzoek om wachtwoord te wijzigen is ontvangen.',
                    duration: 2000
                });
                toast.present();
            })
            .catch(async (err) => {
                const toast = await this.toastController.create({
                    message: err.message,
                    duration: 2000
                });
                toast.present();
            });
    }

    signUpRegular() {
        this.authService.signUpRegular(this.user.email, this.user.password, this.user.displayName)
            .then((res) => {
                    if (res) {
                        delete this.user.password;
                        this.authService.updateProfile(this.user.displayName);
                        this.participantService.postParticipant({
                            displayName: this.user.displayName,
                            email: this.user.email
                        })
                            .subscribe(() => {
                                this.user.displayName = '';
                                this.user.email = '';
                                this.user.password = '';
                            }, () => {
                            });
                    }
                }
            )
            .catch(async (err) => {
                const toast = await this.toastController.create({
                    message: err.message,
                    duration: 2000
                });
                toast.present();
            });
    }

    logout() {
        this.authService.logout();
    }

    activateResetPassword(isTrue: boolean) {
        this.wachtwoordvergeten = isTrue;
    }

    segmentChanged($event) {
        this.activeSegment = $event.detail.value;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}

