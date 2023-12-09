import {Component, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {UiService} from '../../services/ui.service';

@Component({
    selector: 'app-toggle-stand-list',
    templateUrl: './toggle-stand-list.component.html',
    styleUrls: ['./toggle-stand-list.component.scss'],
})
export class ToggleStandListComponent implements OnInit {

    isMatchStandActive: boolean;

    constructor(private popoverController: PopoverController, private uiService: UiService) {
    }

    ngOnInit() {
        this.isMatchStandActive = this.uiService.isMatchStandActive$.getValue();
    }

    async toggleStand(isMatchStandActive: boolean) {
        await this.popoverController.dismiss({isMatchStandActive});
    }
}
