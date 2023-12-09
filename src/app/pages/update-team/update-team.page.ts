import {Component, Input, OnInit} from '@angular/core';
import {ITableLine} from '../../models/poule.model';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-update-team',
    templateUrl: './update-team.page.html',
    styleUrls: ['./update-team.page.scss'],
})
export class UpdateTeamPage implements OnInit {

    @Input() line: ITableLine;

    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
        this.line = {
            ...this.line,
            isPositionFinal: !!this.line.team.poulePosition || this.line.gespeeld === 3,
            team: {
                ...this.line.team,
                isEliminated: this.line.team.isEliminated === null ?
                    this.line.positie < 3 && this.line.gespeeld === 3 ?
                        false : this.line.gespeeld === 3 ?
                        true : null : this.line.team.isEliminated

            }
        };
    }

    updateIsEliminated(event) {
        this.line = {
            ...this.line,
            team: {
                ...this.line.team,
                isEliminated: event.detail.value
            }
        };
    }

    updateIsFinal(event) {
        this.line = {
            ...this.line,
            isPositionFinal: event.detail.checked
        };
    }

    save() {
        this.modalController.dismiss(
            this.line
        );
    }

    dismiss() {
        this.modalController.dismiss();
    }
}
