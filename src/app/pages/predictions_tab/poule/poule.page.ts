import { Component } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { MatchService } from '../../../services/match.service';
import { IMatchPrediction } from '../../../models/participant.model';
import { PoulepredictionService } from '../../../services/pouleprediction.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { UiService } from '../../../services/ui.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-poule',
    templateUrl: './poule.page.html',
    styleUrls: ['./poule.page.scss'],
})
export class PoulePage {

    unsubscribe = new Subject<void>();
    poules = [];

    constructor(private matchService: MatchService,
        private poulepredictionService: PoulepredictionService,
        private toastService: ToastService,
        public uiService: UiService,
        private router: Router) {
    }

    ionViewWillEnter() {
        this.poulepredictionService.getPoulePredictions().subscribe(
            poulePrediction => {
                this.uiService.isDirty$.next(this.isFirstTime(poulePrediction));
                this.poules = [{
                    poule: 'A',
                    stand: this.createStand(poulePrediction, 'A'),
                    isSortDisabled: true
                },
                {
                    poule: 'B',
                    stand: this.createStand(poulePrediction, 'B'),
                    isSortDisabled: true
                },
                {
                    poule: 'C',
                    stand: this.createStand(poulePrediction, 'C'),
                    isSortDisabled: true
                },
                {
                    poule: 'D',
                    stand: this.createStand(poulePrediction, 'D'),
                    isSortDisabled: true
                },
                {
                    poule: 'E',
                    stand: this.createStand(poulePrediction, 'E'),
                    isSortDisabled: true
                },
                {
                    poule: 'F',
                    stand: this.createStand(poulePrediction, 'F'),
                    isSortDisabled: true
                }];
            });

        this.uiService.updatePouleStand$.pipe(takeUntil(this.unsubscribe))
            .subscribe(stand => {
                if (stand)
                    this.poules = this.poules.map(item => {
                        if (item.poule === stand[0].poule) {
                            return { ...item, stand: stand }
                        } else {
                            return item
                        }
                    })
            })
    }

    createStand(poulePrediction, pouleName: string) {
        return poulePrediction.filter(p => p.poule === pouleName)
            .sort((a, b) => a.positie - b.positie);
    }

    canDeactivate(): Observable<boolean> | Promise<boolean> {
        if (this.uiService.isDirty$.value && !this.arePoulesInComplete()) {
            return this.toastService.presentAlertConfirm().then(alertResponse => {
                return alertResponse;
            });
        } else {
            return of(true);
        }
    }


    isFirstTime(poulePredictions): boolean {
        return !poulePredictions.find(p => p.id);
    }

    arePoulesInComplete(): boolean {
        const newPoules = this.poules.reduce((accumulator, poule) => [...accumulator, poule.stand], []);
        return [].concat(...newPoules).filter(item => item.gespeeld !== 3).length > 0;
    }

    save() {
        this.poulepredictionService.savePoulePredictions([
            ...this.poules[0].stand,
            ...this.poules[1].stand,
            ...this.poules[2].stand,
            ...this.poules[3].stand,
            ...this.poules[4].stand,
            ...this.poules[5].stand
        ]).subscribe(() => {
            this.toastService.presentToast('Opslaan is gelukt');
            this.uiService.isDirty$.next(false);
            this.router.navigate(['prediction/prediction/knockout'], { replaceUrl: false });
        }, error => {
            this.toastService.presentToast(error && error.error && error.error.message ? error.error.message : 'Er is iets misgegaan', 'warning');

        });
    }
}
