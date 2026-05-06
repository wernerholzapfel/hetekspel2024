import { ChangeDetectorRef, Component } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, Subject } from 'rxjs';
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

    selectKnockoutRound($event: any) {
        this.activeKnockoutRound = $event.detail.value;
        this.cdr.detectChanges();
    }

    scrollSegments(index: number) {
        console.log('Scrolling to segment:', index);
        this.segmentIndex = index - 1;
        const segment = document.querySelector('ion-segment');
        const active = segment?.querySelectorAll('ion-segment-button')[index];
        if (active) {
            active.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
    }

    setSelectedTeam(match: IKnockout, $event: any) {
        this.speelschema = this.speelschema.map(m => {
            if (m.id === match.id) {
                return { ...m, selectedTeam: { id: $event.detail.value } };
            }
            return m;
        });
        console.log(this.speelschema)
    }



    save(match: IKnockout) {
        const knockoutResult = {
            knockoutId: match.id,
            winnerTeam: match.selectedTeam!,
            loserTeam: match?.selectedTeam?.id === match.homeTeam?.id ? match.awayTeam! : match.homeTeam!,
            round: match.round,
            knockoutMatchPosition: match.matchId,
            homeScore: match.homeScore,
            awayScore: match.awayScore
        }

        const saves$ = match.round === '4' ?

            forkJoin([
                this.knockoutResultService.saveKnockoutResult(knockoutResult),
                this.knockoutResultService.saveKnockoutLoserResult({
                    team: { id: (match.selectedTeam?.id === match.homeTeam?.id ? match.awayTeam! : match.homeTeam!).id },
                    knockoutMatchPosition: 'V' + match.matchId,
                    round: '3'
                })
            ])
            : this.knockoutResultService.saveKnockoutResult(knockoutResult);

        saves$.subscribe({
            next: () => {
                this.toastService.presentToast('Opslaan is gelukt');
                this.refresh$.next();

            },
            error: (error) => {
                this.toastService.presentToast(error && error.error && error.error.message ? error.error.message : 'Er is iets misgegaan', 'warning');
            }
        });
    }
}
