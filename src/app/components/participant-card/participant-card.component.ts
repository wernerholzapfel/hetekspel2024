import {Component, Input, OnInit} from '@angular/core';
import {IStandLine} from '../../models/stand.model';
import {Router} from '@angular/router';
import { UiService } from 'src/app/services/ui.service';

@Component({
    selector: 'app-participant-card',
    templateUrl: './participant-card.component.html',
    styleUrls: ['./participant-card.component.scss'],
})
export class ParticipantCardComponent implements OnInit {

    @Input() ownCard: boolean;
    @Input() standLine: IStandLine;
    @Input() lastUpdated: number;
    @Input() color = 'primary';

    constructor(private router: Router,
        public uiService: UiService) {
    }

    ngOnInit() {
    }

    openStand() {
        this.router.navigate(['stand'], {replaceUrl: false});
    }

    openMatches() {
        this.router.navigate([`deelnemer/deelnemer/${this.standLine.id}/matches/`], {replaceUrl: false});
    }

    openPoules() {
        this.router.navigate([`deelnemer/deelnemer/${this.standLine.id}/poule/`], {replaceUrl: false});
    }

    openKnockout() {
        this.router.navigate([`deelnemer/deelnemer/${this.standLine.id}/knockout/`], {replaceUrl: false});
    }

}
