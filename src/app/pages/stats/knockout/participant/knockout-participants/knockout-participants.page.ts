import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KnockoutPredictionsService } from '../../../../../services/knockout-predictions.service';
import { IParticipant } from '../../../../../models/participant.model';
import { ITeamKnockout } from '../../../../../models/poule.model';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UiService } from '../../../../../services/ui.service';

@Component({
    selector: 'app-knockout-participants',
    templateUrl: './knockout-participants.page.html',
    styleUrls: ['./knockout-participants.page.scss'],
})
export class KnockoutParticipantsPage implements OnInit, OnDestroy {

    constructor(private route: ActivatedRoute,
        private router: Router,
        private knockoutPredictionService: KnockoutPredictionsService,
        private uiService: UiService
    ) {
    }
    searchTerm$: BehaviorSubject<string> = new BehaviorSubject('');

    koTeamStats: { team: ITeamKnockout, participants: { participant: IParticipant, tableLine: any }[], round: string };
    unsubscribe = new Subject<void>();

    ngOnInit() {
        combineLatest([
            this.uiService.totaalstand$,
            this.knockoutPredictionService.getParticipantForKnockoutTeamInRound(
                this.route.snapshot.params.roundid, this.route.snapshot.params.teamid),
            this.searchTerm$,
            this.uiService.participant$])
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(([stand, koTeamStats, searchTerm, participant]) => {
                console.log(koTeamStats)
                if (stand.length > 0) {
                    this.koTeamStats = {
                        ...koTeamStats,
                        participants: this.uiService.filterDeelnemers(searchTerm, koTeamStats.participants.map(p => {
                            return {
                                ...p,
                                tableLine: stand.find(line => line.id === p.participant.id),
                                isMine: participant && p.participant.id === participant.id
                            };
                        })).sort((a, b) => a.tableLine.position - b.tableLine.position)
                    };
                }
            console.log(this.koTeamStats?.participants)

            });
    }

    openParticipant(participantId: string) {
        this.router.navigate([`deelnemer/deelnemer/${participantId}/knockout/`], { replaceUrl: false });

    }
    search($event) {
        this.searchTerm$.next($event.detail.value)
    }
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }

}
