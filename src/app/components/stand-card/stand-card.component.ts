import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonReorderGroup } from '@ionic/angular';
import { UiService } from '../../services/ui.service';
import { Observable, Subject } from 'rxjs';
import { IMatchPrediction } from 'src/app/models/participant.model';
import { PoulepredictionService } from 'src/app/services/pouleprediction.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-stand-card',
    templateUrl: './stand-card.component.html',
    styleUrls: ['./stand-card.component.scss'],
})
export class StandCardComponent implements OnInit, OnDestroy {
    @ViewChild(IonReorderGroup, { static: true }) reorderGroup: IonReorderGroup;
    unsubscribe = new Subject<void>();
    constructor(public uiService: UiService) {
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
        // Before complete is called with the items they will remain in the
        // order before the drag

        // Finish the reorder and position the item in the DOM based on
        // where the gesture ended. Update the items variable to the
        // new order of items
        this.stand = ev.detail.complete(this.stand).map((line, index) => {
            return {
                ...line,
                positie: index + 1
            };

        });

        this.uiService.updatePouleStand$.next(this.stand)
        this.uiService.isDirty$.next(true);
        // After complete is called the items will be in the new order
        // console.log('After complete', this.poule.stand);
    }

    toggleReorderGroup() {
        this.poule.isSortDisabled = !this.poule.isSortDisabled;
    }

    setSortBackToOriginal() {
        this.stand = this.stand.sort((a, b) => b.sortering - a.sortering).map((line, index) => {
            return {
                ...line,
                positie: index + 1,
                // positieVoorspelling: index + 1
            }
        })
        this.uiService.updatePouleStand$.next(this.stand)
        this.uiService.isDirty$.next(true);

    }

    closeOrOpenTable() {
        this.isTableOpen = !this.isTableOpen
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }
}
