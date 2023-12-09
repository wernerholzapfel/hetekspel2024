import {Component} from '@angular/core';
import {Subject} from 'rxjs';
import {MatchService} from '../../../services/match.service';
import {Router} from '@angular/router';
import {ToastService} from '../../../services/toast.service';
import {IMatch} from '../../../models/poule.model';

@Component({
    selector: 'app-matches',
    templateUrl: './matches.page.html',
    styleUrls: ['./matches.page.scss'],
})
export class MatchesPage {
    matches: IMatch[];
    unsubscribe = new Subject<void>();

    constructor(private matchService: MatchService,
                private router: Router,
                private toastService: ToastService) {
    }

    ionViewWillEnter() {
        this.matchService.getMatches().subscribe(matches => this.matches = matches);
    }

    save(match: IMatch) {
        this.matchService.updateMatch({id: match.id, homeScore: match.homeScore, awayScore: match.awayScore}).subscribe(result => {
            this.toastService.presentToast('Opslaan is gelukt');
        }, error => {
            this.toastService.presentToast(error && error.error && error.error.message ? error.error.message : 'Er is iets misgegaan', 'warning');

        });
    }

    ionViewDidLeave(): void {
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();

    }
}
