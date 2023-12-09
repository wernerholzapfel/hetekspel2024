import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {StatsService} from '../../services/stats.service';
import {UiService} from '../../services/ui.service';
import {RouteStateService} from '../../services/route-state.service';

@Component({
    selector: 'app-participant-list',
    templateUrl: './participant-list.page.html',
    styleUrls: ['./participant-list.page.scss'],
})
export class ParticipantListPage implements OnDestroy {

    constructor(private statsService: StatsService,
                private uiService: UiService,
                private routeStateService: RouteStateService) {
    }

    isAdmin$: Observable<boolean>;
    participants: {
        displayName: string;
        matchpredictions: number;
        poulepredictions: number;
        knockoutpredictions: number;
    }[];
    matchesPredicted: number;
    poulePredicted: number;
    knockoutPredicted: number;


    ionViewWillEnter() {
        this.getParticipants(null);
        this.isAdmin$ = this.uiService.isAdmin$;
    }

    getParticipants(event) {
        return this.statsService.getParticipantsStats().subscribe(participants => {
            this.participants = participants;
            this.matchesPredicted = this.participants.filter(p => p.matchpredictions === 48).length;
            this.poulePredicted = this.participants.filter(p => p.poulepredictions === 32).length;
            this.knockoutPredicted = this.participants.filter(p => p.knockoutpredictions === 16).length;
            if (event) {
                event.target.complete();
            }
        });
    }

    refresh(event) {
        this.getParticipants(event);
    }

    ngOnDestroy(): void {
    }

}
