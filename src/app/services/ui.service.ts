import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {IStandLine} from '../models/stand.model';
import {IMatchPrediction, IParticipant} from '../models/participant.model';
import {switchMap} from 'rxjs/operators';
import {PouleNav} from '../models/poule.model';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class UiService {

    updatePouleStand$: BehaviorSubject<any> = new BehaviorSubject(null);
    isRegistrationOpen$: BehaviorSubject<boolean> = new BehaviorSubject(null);
    isDirty$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    participant$: BehaviorSubject<IParticipant> = new BehaviorSubject(null);
    isAdmin$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    pushToken$: BehaviorSubject<string> = new BehaviorSubject(null);
    totaalstand$: BehaviorSubject<IStandLine[]> = new BehaviorSubject([]);
    lastUpdated$: BehaviorSubject<{ lastUpdated?: number }> = new BehaviorSubject({});
    isMatchStandActive$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    prefersDark$: BehaviorSubject<boolean> = new BehaviorSubject(null);
    matchPredictions$: BehaviorSubject<IMatchPrediction[]> = new BehaviorSubject([]);
    pouleNav: PouleNav[] = [
        {
            current: 'A',
            previous: null,
            next: 'B',
            disabled: false,
            text: 'Poule A'
        }, {
            current: 'B',
            previous: 'A',
            next: 'C',
            disabled: true,
            text: 'Poule B'
        }, {
            current: 'C',
            previous: 'B',
            next: 'D',
            disabled: true,
            text: 'Poule C'
        }, {
            current: 'D',
            previous: 'C',
            next: 'E',
            disabled: true,
            text: 'Poule D'
        }, {
            current: 'E',
            previous: 'D',
            next: 'F',
            disabled: true,
            text: 'Poule E'
        }, {
            current: 'F',
            previous: 'E',
            next: null,
            disabled: true,
            text: 'Poule F'
        },];

    constructor(private toastController: ToastController) {
    }

    getArePouleMatchesPredicted(): Observable<PouleNav[]> {
        return this.matchPredictions$.pipe(switchMap(mp => {
            return of(this.pouleNav.map(pn => {
                return {
                    ...pn,
                    isFinal: mp.filter(m => m.homeScore === null && m.awayScore === null && m.match.poule === pn.current).length === 0,
                    disabled: mp.filter(match =>
                        match.homeScore === null && match.awayScore === null && match.match.poule === pn.previous).length !== 0
                };
            }));
        }));
    }

    filterDeelnemers(searchTerm: string, deelnemers: any[]): any[] {
        if ((searchTerm === undefined || searchTerm.length < 2)) {
            return deelnemers;
        } else {
            searchTerm = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            return deelnemers.filter(deelnemer => {
                const searchableWords: string[] = (`${deelnemer?.displayName} ${deelnemer?.participant?.displayName}`)
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .split(' ');

                return (!searchTerm || searchTerm
                    .trim()
                    .split(' ')
                    .map(word => word)
                    .filter(searchWord => {
                        return searchableWords.filter(searchableWord => {
                            return searchableWord.indexOf(searchWord.trim()) > -1;
                        }).length > 0;
                    }).length > 0);
            });
        }
    }

    async presentToast(message, color, keyboardClose = false) {
        const toast = await this.toastController.create({
            message: message,
            duration: 3000,
            position: 'top',
            cssClass: 'custom-toast',
            color,
            keyboardClose
        });

        await toast.present();
    }
}
