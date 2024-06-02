import { Component, ViewChild } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { MatchService } from '../../../services/match.service';
import { IMatchPrediction } from '../../../models/participant.model';
import { PoulepredictionService } from '../../../services/pouleprediction.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { UiService } from '../../../services/ui.service';
import { takeUntil } from 'rxjs/operators';
import { AlertController, IonModal } from '@ionic/angular';

@Component({
    selector: 'app-poule',
    templateUrl: './poule.page.html',
    styleUrls: ['./poule.page.scss'],
})
export class PoulePage {
    @ViewChild(IonModal) modal: IonModal;

    unsubscribe = new Subject<void>();
    poules = [];
    thirdpositions = [];
    fourThirdpositions: boolean;

    constructor(private matchService: MatchService,
        private poulepredictionService: PoulepredictionService,
        private toastService: ToastService,
        public uiService: UiService,
        private alertController: AlertController,
        private router: Router) {
    }

    ionViewWillEnter() {
        this.poulepredictionService.getPoulePredictions().subscribe(
            poulePrediction => {
                this.thirdpositions = poulePrediction.filter(pp => pp.positie === 3)
                    .sort((a, b) => b.thirdPositionScore - a.thirdPositionScore)

                this.fourThirdpositions = this.thirdpositions.filter(tp => tp.selected).length === 4

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
                if (stand) {
                    this.poules = this.poules.map(item => {
                        if (item.poule === stand[0].poule) {
                            return { ...item, stand: stand }
                        } else {
                            return item
                        }
                    })
                }
                this.thirdpositions = this.thirdpositions.map(tp => {
                    const team = stand.find(line => line.positie === 3)
                    return tp.poule === team.poule ? { ...team } : { ...tp }
                }).sort((a, b) => b.thirdPositionScore - a.thirdPositionScore)

                this.fourThirdpositions = this.thirdpositions.filter(tp => tp.selected).length === 4

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
        if (this.thirdpositions.filter(tp => tp.selected).length === 4) {
            console.log(this.thirdpositions)
            this.poulepredictionService.savePoulePredictions([
                ...this.poules[0].stand.map(line => line.positie === 3 ? this.thirdpositions.find(tp => tp.poule === this.poules[0].poule) : {
                    ...line,
                    selected: line.positie != 4
                }),
                ...this.poules[1].stand.map(line => line.positie === 3 ? this.thirdpositions.find(tp => tp.poule === this.poules[1].poule) : {
                    ...line,
                    selected: line.positie != 4
                }),
                ...this.poules[2].stand.map(line => line.positie === 3 ? this.thirdpositions.find(tp => tp.poule === this.poules[2].poule) : {
                    ...line,
                    selected: line.positie != 4
                }),
                ...this.poules[3].stand.map(line => line.positie === 3 ? this.thirdpositions.find(tp => tp.poule === this.poules[3].poule) : {
                    ...line,
                    selected: line.positie != 4
                }),
                ...this.poules[4].stand.map(line => line.positie === 3 ? this.thirdpositions.find(tp => tp.poule === this.poules[4].poule) : {
                    ...line,
                    selected: line.positie != 4
                }),
                ...this.poules[5].stand.map(line => line.positie === 3 ? this.thirdpositions.find(tp => tp.poule === this.poules[5].poule) : {
                    ...line,
                    selected: line.positie != 4
                }),
            ]).subscribe(() => {
                this.modal.dismiss(null, 'save');

                this.toastService.presentToast('Opslaan is gelukt');
                this.uiService.isDirty$.next(false);
                this.router.navigate(['prediction/prediction/knockout'], { replaceUrl: false });
            }, error => {
                this.toastService.presentToast(error && error.error && error.error.message ? error.error.message : 'Er is iets misgegaan', 'warning');

            });
        } else {
            this.uiService.presentToast('Er zijn te veel teams geselecteerd. Sleep de teams zodat er achter exact 4 teams een vinkje staat', 'danger')
        }

    }

    doReorder(ev: any) {
        // Before complete is called with the items they will remain in the
        // order before the drag

        // Finish the reorder and position the item in the DOM based on
        // where the gesture ended. Update the items variable to the
        // new order of items
        this.thirdpositions = ev.detail.complete(this.thirdpositions).map((line, index) => {
            return {
                ...line,
                selected: index < 4
            };
        });

        //update poules
        this.poules = this.poules.map(p => {
            return {
                ...p,
                stand: p.stand.map(l => {
                    if (l.positie === 3) {
                        return {
                            ...l,
                            selected: !!this.thirdpositions.find(tp => tp.team.id === l.team.id).selected
                        }
                    } else {
                        return {
                            ...l,
                        }
                    }

                })

            }
        })

        this.recalcFourThirdpositions(ev)
        // After complete is called the items will be in the new order
    }

    cancel() {
        this.modal.dismiss(null, 'cancel');
    }

    async canDismiss(data?: any, role?: string) {
        return role !== 'gesture';
    }

    recalcFourThirdpositions(event) {
        this.fourThirdpositions = this.thirdpositions.filter(tp => tp.selected).length === 4

    }
    onWillDismiss(event: Event) {
        // const ev = event as CustomEvent<OverlayEventDetail<string>>;
        // if (ev.detail.role === 'confirm') {
        //   this.message = `Hello, ${ev.detail.data}!`;
        // }
    }

}
