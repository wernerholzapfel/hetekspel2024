import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-prediction-messages-modal',
    templateUrl: './prediction-messages-modal.component.html',
    styleUrls: ['./prediction-messages-modal.component.scss'],
    standalone: false
})
export class PredictionMessagesModalComponent {

    @Input() groups: Array<{ title?: string; messages: string[] }> = [];
    @Input() title: string = '';

    constructor(private modalController: ModalController) {}

    dismiss() {
        this.modalController.dismiss();
    }
}
