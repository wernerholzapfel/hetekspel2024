import {Component, Input, OnInit} from '@angular/core';
import {IHeadline} from '../../models/headline.model';
import {HeadlineService} from '../../services/headline.service';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-edit-headline',
    templateUrl: './edit-headline.component.html',
    styleUrls: ['./edit-headline.component.scss'],
})
export class EditHeadlineComponent implements OnInit {

    constructor(private headlineService: HeadlineService, private modalController: ModalController) {
    }

    @Input() headline: IHeadline;

    ngOnInit() {
    }

    async saveHeadline() {
        this.headlineService.saveHeadline(this.headline).subscribe(async response => {
            await this.modalController.dismiss(response);
        });
    }

    async cancel() {
        await this.modalController.dismiss();
    }

}
