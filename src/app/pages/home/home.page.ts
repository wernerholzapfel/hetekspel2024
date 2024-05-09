import { Component, OnDestroy, OnInit } from '@angular/core';
import { UiService } from '../../services/ui.service';
import { mergeMap, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { IStandLine } from '../../models/stand.model';
import { BehaviorSubject, combineLatest, from, Observable, of, Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { IParticipant } from '../../models/participant.model';
import { MatchService } from '../../services/match.service';
import { Router } from '@angular/router';
import { TeamService } from 'src/app/services/team.service';
import { ITeam } from 'src/app/models/poule.model';
import { KnockoutPredictionsService } from 'src/app/services/knockout-predictions.service';
import { IonItemSliding } from '@ionic/angular';
import { IHeadline } from 'src/app/models/headline.model';
import { HeadlineService } from 'src/app/services/headline.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

    standLine: IStandLine;
    participantStandLine: IStandLine;
    lastUpdated: number;
    participant$: Observable<IParticipant>;
    // getRequest$ = new Subject<any>();
    fullscore$: Observable<any[]>;
    upcomingMatches: any[];
    knockoutScores: any = [];
    unsubscribe = new Subject<void>();
    headlines: IHeadline[]
    todaysMatches: { predictionType: string, matchPredictions: any[], knockout: any[] }

    constructor(public uiService: UiService,
        public authService: AuthService,
        private matchService: MatchService,
        private teamService: TeamService,
        private headlineService: HeadlineService,
        private knockoutPredictionService: KnockoutPredictionsService,
        private router: Router) {
    }

    ionViewWillEnter() {
        this.refresh(null)

        this.uiService.participant$.pipe(switchMap(participant => {
            if (participant) {
                return this.matchService.getTodaysMatchPredictionsForParticipant()
            } else return of([])
        }))
            .subscribe(
                result => {
                    this.todaysMatches = result;
                }
            );

    }

    refresh(event): void {
        this.headlineService.getHeadlines().subscribe(response => {
            this.headlines = response;
        })
        this.fullscore$ = this.matchService.getMatchesFullScore();

        this.matchService.getUpcomingMatches().subscribe(result => this.upcomingMatches = result)
        this.teamService.getLatestActive().pipe(mergeMap(response => {
            let items: Observable<unknown>[] = []
            response.map(item => {
                items = [...items, this.knockoutPredictionService.getParticipantForKnockoutTeamInRound(
                    item.round, item.team.id)]
            })
            return of(items)
        })).subscribe(item => {
            this.knockoutScores = item;
        })

        if (event) {
            event.target.complete();
        }
    }

    ngOnInit() {
        combineLatest([this.uiService.totaalstand$, this.uiService.participant$])
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(([s, participant]) => {
                this.standLine = s[0];
                this.participantStandLine = s.find(line => participant && line.id === participant.id);
            });

        this.uiService.lastUpdated$
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(item => {
                this.lastUpdated = item ? item.lastUpdated : 0;
            });

        this.participant$ = this.uiService.participant$;

    }

    openMatch(matchId: string) {
        this.router.navigate([`match/${matchId}`], { replaceUrl: false });
    }

    openMatchWithTotoFilter(matchId: string, totoId) {
        this.router.navigate([`match/${matchId}/toto/${totoId}`], { replaceUrl: false });
    }

    openParticipant(participantId: string) {
        this.router.navigate([`deelnemer/deelnemer/${participantId}/matches`], { replaceUrl: false });
    }

    openParticipantKnockout(participantId: string) {
        this.router.navigate([`deelnemer/deelnemer/${participantId}/knockout`], { replaceUrl: false });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }
}
