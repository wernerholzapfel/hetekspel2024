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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: false
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

    private predictionTextCache = new Map<string, SafeHtml>();

    constructor(public uiService: UiService,
        public authService: AuthService,
        private matchService: MatchService,
        private teamService: TeamService,
        private headlineService: HeadlineService,
        private knockoutPredictionService: KnockoutPredictionsService,
        private router: Router,
        private sanitizer: DomSanitizer) {
    }

    getKnockoutPredictionHtml(knockout: any): SafeHtml {
        const key = knockout.match?.id ?? knockout.date;
        if (this.predictionTextCache.has(key)) {
            return this.predictionTextCache.get(key)!;
        }

        const hf = `<span class="fi fi-${knockout.homeTeam.logoUrl} fis"></span>`;
        const af = `<span class="fi fi-${knockout.awayTeam.logoUrl} fis"></span>`;
        const hn = knockout.homeTeam.name;
        const an = knockout.awayTeam.name;
        const isPlayed = knockout.homeScore != null;
        const homePredicted = knockout.homeTeamPredictionDoor;
        const awayPredicted = knockout.awayTeamPredictionDoor;
        const totalPunten = (knockout.homeTeam.spelPunten ?? 0) + (knockout.awayTeam.spelPunten ?? 0);

        let options: string[];

        if (!isPlayed) {
            if (homePredicted && awayPredicted) {
                options = [
                    `Je speelt vanavond op twee paarden: ${hf} ${hn} én ${af} ${an}. Er is maar één winnaar!`,
                    `Je hebt ${hf} ${hn} én ${af} ${an} door — eentje maakt je blij vanavond.`,
                    `Dubbel ingezet op ${hf} ${hn} en ${af} ${an}, maar er kan er maar één door!`,
                ];
            } else if (homePredicted) {
                options = [
                    `Juich vanavond voor ${hf} ${hn}!`,
                    `Spannende wedstrijd vanavond — zal het ${hf} ${hn} lukken punten voor je te pakken?`,
                    `Je rekent op ${hf} ${hn} voor een puntje vandaag. Succes!`,
                ];
            } else if (awayPredicted) {
                options = [
                    `Juich vanavond voor ${af} ${an}!`,
                    `Spannende wedstrijd vanavond — zal het ${af} ${an} lukken punten voor je te pakken?`,
                    `Je rekent op ${af} ${an} voor een puntje vandaag. Succes!`,
                ];
            } else {
                options = [
                    `Geen van deze landen zit in jouw rijtje. Lekker onbezorgd genieten!`,
                    `Neutraal genieten vanavond — deze wedstrijd levert je sowieso geen punten op.`,
                    `Je hebt geen van deze landen door. Gewoon genieten van de wedstrijd!`,
                ];
            }
        } else {
            if (homePredicted && awayPredicted) {
                options = [
                    `Je speelde op twee paarden: ${hf} ${hn} én ${af} ${an}. Er kon maar één door!`,
                    `Je had ${hf} ${hn} én ${af} ${an} door — heeft het gewerkt?`,
                    `Dubbel ingezet op ${hf} ${hn} en ${af} ${an}. Eén kans raak is ook mooi!`,
                ];
            } else if (homePredicted) {
                options = totalPunten > 0 ? [
                    `${hf} ${hn} is door — precies zoals jij voorspeld had! Punten binnen!`,
                    `Ja! Je had ${hf} ${hn} door en dat klopte. Mooi meegenomen!`,
                    `${hf} ${hn} door en jij had dat zien aankomen. Punten!`,
                ] : [
                    `${hf} ${hn} was jouw keuze, maar het pakte helaas anders uit.`,
                    `Jammer, ${hf} ${hn} is er niet doorgekomen. Volgende ronde beter!`,
                    `Pech — je had ${hf} ${hn} door, maar die gaat naar huis.`,
                ];
            } else if (awayPredicted) {
                options = totalPunten > 0 ? [
                    `${af} ${an} is door — precies zoals jij voorspeld had! Punten binnen!`,
                    `Ja! Je had ${af} ${an} door en dat klopte. Mooi meegenomen!`,
                    `${af} ${an} door en jij had dat zien aankomen. Punten!`,
                ] : [
                    `${af} ${an} was jouw keuze, maar het pakte helaas anders uit.`,
                    `Jammer, ${af} ${an} is er niet doorgekomen. Volgende ronde beter!`,
                    `Pech — je had ${af} ${an} door, maar die gaat naar huis.`,
                ];
            } else {
                options = [
                    `Geen van beide landen zat in jouw rijtje — deze wedstrijd leverde je geen punten op.`,
                    `Je had geen van deze landen door. Deze wedstrijd ging aan je voorbij.`,
                    `Geen punten uit deze wedstrijd, maar je wist het al!`,
                ];
            }
        }

        const text = options[Math.floor(Math.random() * options.length)];
        const result = this.sanitizer.bypassSecurityTrustHtml(text);
        this.predictionTextCache.set(key, result);
        return result;
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
                console.log(participant)
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
    
    navigateToKnockoutStats(round: string, teamId: string) {
        const nextRound = (parseInt(round,0) / 2)
        this.router.navigate([`stats/knockout/round/${nextRound}/team/${teamId}`], { replaceUrl: false });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }
}
