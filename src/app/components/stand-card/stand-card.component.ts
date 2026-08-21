import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonReorderGroup } from '@ionic/angular';
import { UiService } from '../../services/ui.service';
import { Observable, Subject } from 'rxjs';
import { IMatchPrediction } from 'src/app/models/participant.model';
import { PoulepredictionService } from 'src/app/services/pouleprediction.service';

@Component({
    selector: 'app-stand-card',
    templateUrl: './stand-card.component.html',
    styleUrls: ['./stand-card.component.scss'],
    standalone: false
})
export class StandCardComponent implements OnInit, OnDestroy {
    @ViewChild(IonReorderGroup, { static: true }) reorderGroup: IonReorderGroup;
    unsubscribe = new Subject<void>();
    constructor(public uiService: UiService, private poulepredictionService: PoulepredictionService) {
    }

    private _poule: { poule: string, isSortDisabled: boolean, stand: any[] };
    @Input() set poule(value) {
        this._poule = value;
    }
    get poule() {
        return this._poule;
    }

    @Input() showSortedCorrectly = false;
    @Input() isToolbar = false;
    @Input() admin = false;
    @Input() editMode = true;
    @Input() isTableOpen = true;
    isRegistrationOpen: Observable<boolean>;
    isSortedCorrectly: boolean;

    private _stand: any[];
    @Input() set stand(value) {
        this._stand = value;
        this.isSortedCorrectly = this.stand ? this.stand.every((value, index, array) => {
            return index === 0 || value.sortering <= array[index - 1].sortering
        }) : false
    }
    get stand() {
        return this._stand
    }

    ngOnInit() {
        this.isRegistrationOpen = this.uiService.isRegistrationOpen$;
    }

    doReorder(ev: any) {
        this.stand = this.mapWithPositieAndSelected(ev.detail.complete(this.stand));
        this.updateAndSaveStand(this.stand);
    }

    toggleReorderGroup() {
        this.poule.isSortDisabled = !this.poule.isSortDisabled;
    }

    setSortBackToOriginal() {
        this.stand = this.mapWithPositieAndSelected(this.stand.sort((a, b) => b.sortering - a.sortering));
        this.updateAndSaveStand(this.stand);
    }

    private mapWithPositieAndSelected(stand: any[]): any[] {
        const previousThirdSelected = this.stand.find(line => line.positie === 3)?.selected;
        return stand.map((line, index) => {
            const positie = index + 1;
            return {
                ...line,
                positie,
                selected: positie === 1 || positie === 2 ? true
                    : positie === 3 ? previousThirdSelected ? true : false
                        : false
            };
        });
    }

    private updateAndSaveStand(stand: any[]) {
        this.poulepredictionService.savePoulePredictions(stand)
            .subscribe({
                next: response_stand => {
                    this.stand = response_stand;
                    // Notify other parts of the app that this poule stand was updated
                    try {
                        this.uiService.updatePouleStand$?.next(response_stand);
                    } catch (e) {
                        // swallow if uiService is not available for some reason
                    }
                },
                error: () => this.uiService.presentToast('Opslaan mislukt', 'warning')
            });
    }

    closeOrOpenTable() {
        this.isTableOpen = !this.isTableOpen
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }
}
