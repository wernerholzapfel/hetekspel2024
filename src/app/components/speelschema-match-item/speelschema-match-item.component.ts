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
    standalone: false
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
        if (this.url === 'poule' && matchId !== undefined) {
            this.router.navigate([`match/${matchId}`], {replaceUrl: false});
        } 
    }
    openKnockout(team: string, round: string) {
        if (this.url !== 'poule' && team !== undefined) {
            this.router.navigate([`stats/knockout/round/${round}/team/${team}`], {replaceUrl: false});

        } 
    }

    /**
     * Returns the label to display for the home side.
     * - If homeTeam.id exists -> homeTeam.name
     * - Otherwise, if round !== '16' -> 'Winnaar ' + homeId
     * - Otherwise -> homeId
     */
    getHomeLabel(match: any): string {
        if (match?.homeTeam?.id) {
            return match.homeTeam.name;
        }
        // if round is the specific '3' (could be number or string) -> show loser (Verliezer)
        if (String(match?.round) === '3') {
            return `Verliezer ${match?.homeId ?? ''}`;
        }
        // use previous logic: winner label for rounds other than '32'
        if (String(match?.round)  !== '32') {
            return `Winnaar ${match?.homeId ?? ''}`;
        }
        return `${match?.homeId ?? ''}`;
    }

    /**
     * Returns the label to display for the away side (same logic as home).
     */
    getAwayLabel(match: any): string {
        if (match?.awayTeam?.id) {
            return match.awayTeam.name;
        }
        if (String(match?.round) === '3') {
            return `Verliezer ${match?.awayId ?? ''}`;
        }
        if (String(match?.round)  !== '32') {
            return `Winnaar ${match?.awayId ?? ''}`;
        }
        return `${match?.awayId ?? ''}`;
    }

}
