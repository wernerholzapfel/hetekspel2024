import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KnockoutPredictionsService } from '../../../../../services/knockout-predictions.service';
import { IParticipant } from '../../../../../models/participant.model';
import { ITeamKnockout } from '../../../../../models/poule.model';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UiService } from '../../../../../services/ui.service';
import { IStandLine } from '../../../../../models/stand.model';
import { ActionSheetController } from '@ionic/angular';

@Component({
    selector: 'app-knockout-participants',
    templateUrl: './knockout-participants.page.html',
    styleUrls: ['./knockout-participants.page.scss'],
    standalone: false
})
export class KnockoutParticipantsPage implements OnInit, OnDestroy {

    constructor(private route: ActivatedRoute,
        private router: Router,
        private knockoutPredictionService: KnockoutPredictionsService,
        private uiService: UiService,
        private actionSheetCtrl: ActionSheetController
    ) {
        this.roundId = this.route.snapshot.params.roundid;
    }
    searchTerm$: BehaviorSubject<string> = new BehaviorSubject('');
    roundId: string;
    koTeamStats: { team: ITeamKnockout, participants: { participant: IParticipant, tableLine: any, isMine?: boolean }[], round: string };
    participantsWithout: { participant: { id: string, displayName: string }, tableLine: IStandLine, isMine: boolean }[] = [];
    selectedView: 'heeft' | 'heeft-niet' = 'heeft';
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
                if (stand.length > 0) {
                    const withIds = new Set(koTeamStats.participants.map(p => p.participant.id));

                    this.koTeamStats = {
                        ...koTeamStats,
                        participants: this.uiService.filterDeelnemers(searchTerm, koTeamStats.participants.map((p: { participant: IParticipant }) => {
                            return {
                                ...p,
                                tableLine: stand.find(line => line.id === p.participant.id),
                                isMine: participant && p.participant.id === participant.id
                            };
                        })).sort((a, b) => a.tableLine.position - b.tableLine.position)
                    };

                    const withoutList = stand
                        .filter(line => !withIds.has(line.id))
                        .map(line => ({
                            participant: { id: line.id, displayName: line.displayName },
                            tableLine: line,
                            isMine: participant && line.id === participant.id
                        }))
                        .sort((a, b) => a.tableLine.position - b.tableLine.position);

                    this.participantsWithout = this.uiService.filterDeelnemers(searchTerm, withoutList);
                }
            });
    }

    async openViewSheet() {
        const sheet = await this.actionSheetCtrl.create({
            header: 'Weergave',
            buttons: [
                {
                    text: 'Heeft dit land',
                    icon: this.selectedView === 'heeft' ? 'checkmark-outline' : 'people-outline',
                    handler: () => { this.selectedView = 'heeft'; }
                },
                {
                    text: 'Heeft dit land niet',
                    icon: this.selectedView === 'heeft-niet' ? 'checkmark-outline' : 'people-outline',
                    handler: () => { this.selectedView = 'heeft-niet'; }
                },
                { text: 'Annuleren', role: 'cancel' }
            ]
        });
        await sheet.present();
    }

    openParticipant(participantId: string) {
        this.router.navigate([`deelnemer/deelnemer/${participantId}/knockout/`], { replaceUrl: false });
    }

    search($event) {
        this.searchTerm$.next($event.detail.value);
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }

}
