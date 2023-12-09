import {Component, Input, OnInit} from '@angular/core';
import {IMatchPrediction} from '../../models/participant.model';
import {UiService} from '../../services/ui.service';
import {MatchService} from '../../services/match.service';
import {ToastService} from '../../services/toast.service';
import { LoadingController } from '@ionic/angular';
import { IMatch } from 'src/app/models/poule.model';
import { IKnockout } from 'src/app/models/knockout.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-speelschema-match-item',
    templateUrl: './speelschema-match-item.component.html',
    styleUrls: ['./speelschema-match-item.component.scss'],
})
export class SpeelschemaMatchItemComponent implements OnInit {

    @Input() url: string;

    private _match: any;

    @Input() set match(value) {
        this._match = value;
    }

    get match() {
        return this._match;
    }

    constructor(private router: Router) {
    }

    ngOnInit() {
    }
    openMatch(matchId: string) {
        if (this.url === 'poule') {
            this.router.navigate([`match/${matchId}`], {replaceUrl: false});
        } 
    }
    openKnockout(team: string, round: string) {
        if (this.url !== 'poule') {
            this.router.navigate([`stats/knockout/round/${round}/team/${team}`], {replaceUrl: false});

        } 
    }

}
