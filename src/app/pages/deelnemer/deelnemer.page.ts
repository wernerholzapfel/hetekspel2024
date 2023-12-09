import {Component} from '@angular/core';
import {IStandLine} from '../../models/stand.model';
import {UiService} from '../../services/ui.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-deelnemer',
    templateUrl: './deelnemer.page.html',
    styleUrls: ['./deelnemer.page.scss'],
})
export class DeelnemerPage {

    constructor() {
    }
}
