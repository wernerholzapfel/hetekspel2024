import { ChangeDetectorRef, Component } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { IKnockout } from '../../../models/knockout.model';
import { ToastService } from '../../../services/toast.service';
import { KnockoutResultService } from '../../../services/knockout-result.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { KnockoutHelperService } from 'src/app/services/knockoutHelper.service';

@Component({
    selector: 'app-knockout',
    templateUrl: './knockout.page.html',
    styleUrls: ['./knockout.page.scss'],
    standalone: false
})
export class KnockoutPage {
    constructor(
        private knockoutResultService: KnockoutResultService,
        private toastService: ToastService,
        private knockoutHelper: KnockoutHelperService,
        private cdr: ChangeDetectorRef) {
    }

    public speelschema: IKnockout[];
    public segmentIndex = 1;
    public rounds = this.knockoutHelper.rounds;
    private refresh$ = new BehaviorSubject<void>(undefined);
    private activeRound$ = new BehaviorSubject<number>(32);
    private destroy$ = new Subject<void>();

    get activeKnockoutRound() { return this.activeRound$.value; }
    set activeKnockoutRound(val: number) { this.activeRound$.next(val); }

    ionViewWillEnter() {
        this.activeRound$.next(32);

        combineLatest([
            this.refresh$.pipe(switchMap(() => this.knockoutResultService.getOriginalSpeelschema())),
            this.activeRound$
        ]).pipe(takeUntil(this.destroy$))
            .subscribe(([speelschema]) => {
                this.speelschema = speelschema;
            });
    }

    ionViewWillLeave() {
        this.destroy$.next();
    }

    selectKnockoutRound($event) {
        this.activeKnockoutRound = $event.detail.value;
        this.cdr.detectChanges();
    }

    scrollSegments(index: number) {
        console.log('Scrolling to segment:', index);
        this.segmentIndex = index - 1;
        const segment = document.querySelector('ion-segment');
        const active = segment.querySelectorAll('ion-segment-button')[index];
        if (active) {
            active.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
    }

    setSelectedTeam(match: IKnockout, $event) {
        this.speelschema = this.speelschema.map(m => {
            if (m.id === match.id) {
                return { ...m, prediction: { ...m.prediction, selectedTeam: { id: $event.detail.value } } };
            }
            return m;
        });
        console.log(this.speelschema)
    }

    save(match: IKnockout) {
        this.knockoutResultService.saveKnockoutResult({
            knockoutId: match.id,
            winnerTeam: match.prediction?.selectedTeam,
            loserTeam: match.prediction?.selectedTeam?.id === match.prediction?.homeTeam?.id ? match.prediction?.awayTeam : match.prediction?.homeTeam,
            round: match.round,
            knockoutMatchPosition: match.matchId,
            homeScore: match.homeScore,
            awayScore: match.awayScore
        }).subscribe({
            next: () => {
                this.toastService.presentToast('Opslaan is gelukt');
                this.refresh$.next();
            },
            error: (error) => {
                this.toastService.presentToast(error?.error?.message ?? 'Er is iets misgegaan', 'warning');
            }
        });
    }
}
