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
import { ModalController } from '@ionic/angular';
import { IHeadline } from 'src/app/models/headline.model';
import { HeadlineService } from 'src/app/services/headline.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PoulepredictionService } from 'src/app/services/pouleprediction.service';
import { PredictionMessagesModalComponent } from './prediction-messages-modal/prediction-messages-modal.component';

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
    fullscore$: Observable<any[]>;
    upcomingMatches: any[];
    knockoutScores: any = [];
    unsubscribe = new Subject<void>();
    headlines: IHeadline[]
    todaysMatches: { predictionType: string, matchPredictions: any[], knockout: any[] }
    checkPredictionResult: {
        matchPredictions: { count: number; messages: string[] };
        poulePredictions: { count: number; messages: string[] };
        knockoutPredictions: { count: number; messages: Array<{ round: number; messages: string[] }> };
        knockoutPredictionsComplete: { count: number; messages: Array<{ round: number; message: string }> };
    } | null = null;

    private predictionTextCache = new Map<string, SafeHtml>();

    constructor(public uiService: UiService,
        public authService: AuthService,
        private matchService: MatchService,
        private teamService: TeamService,
        private headlineService: HeadlineService,
        private knockoutPredictionService: KnockoutPredictionsService,
        private poulePredictionService: PoulepredictionService,
        private router: Router,
        private sanitizer: DomSanitizer,
        private modalController: ModalController) {
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
                    `Je heb beide ploegen naar de volgende ronde: ${hf} ${hn} én ${af} ${an}. Er is maar één winnaar!`,
                    `Je hebt ${hf} ${hn} én ${af} ${an} door — slechts eentje maakt je blij vanavond.`,
                    `Een dilemma, ${hf} ${hn} of ${af} ${an}? — jij hebt ze beide door.`,
                    `${hf} ${hn} én ${af} ${an} staan allebei in jouw volgende ronde, je pakt sowieso punten.`,
                    `Je koos voor zowel ${hf} ${hn} als ${af} ${an}, maar er kan er maar één door!`,
                ];
            } else if (homePredicted) {
                options = [
                    `Juich vanavond voor ${hf} ${hn}!`,
                    `Spannende wedstrijd vanavond — zal het ${hf} ${hn} lukken om door deze ronde te komen?`,
                    `Jouw hoop op punten ligt vanavond bij ${hf} ${hn}`,
                    `Gaat ${hf} ${hn} de punten voor jou pakken?`,
                    `Je hebt gekozen voor ${hf} ${hn}, dat wordt spannend!`,
                ];
            } else if (awayPredicted) {
                options = [
                    `Jij hoopt vanavond op winst voor ${af} ${an}!`,
                    `In deze ronde heb je gekozen voor ${af} ${an} als winnaar, we duimen met je mee!`,
                    `Vol overtuiging noteerde jij ${af} ${an}, gaan ze jou aan punten helpen?`,
                    `Oei oei oei wat spannend, ${af} ${an} als winnaar voorspeld, succes!`,
                    `${af} ${an} is jouw land vanavond, zij moeten het gaan doen!`,
                ];
            } else {
                options = [
                    `Geen van deze landen zit in jouw volgende ronde. Lekker onbezorgd genieten!`,
                    `Neutraal genieten vanavond — deze wedstrijd levert je sowieso geen punten op.`,
                    `Doet deze wedstrijd er voor jou toe? Je hebt geen van deze landen door.`,
                    `Wie gaat er door vanavond? Één ding weet je zeker, het kan jou geen punten opleveren helaas.`,
                    `Je hebt geen van deze landen door. Gewoon genieten van de wedstrijd!`,
                ];
            }
        } else {
            if (homePredicted && awayPredicted) {
                options = [
                    `Je koos voor beide landen: ${hf} ${hn} én ${af} ${an}. Er kon maar één door!`,
                    `Je had ${hf} ${hn} én ${af} ${an} door — heeft het gewerkt?`,
                    `Een dubbele optie, ${hf} ${hn} én ${af} ${an} had je beide door, 1 keer punten!`,
                    `${hf} ${hn} en ${af} ${an} had je genoteerd, het levert je 1x punten op.`,
                    `Jij koos voor zowel ${hf} ${hn} als ${af} ${an}. Eén kans raak is ook mooi!`,
                ];
            } else if (homePredicted) {
                options = totalPunten > 0 ? [
                    `${hf} ${hn} is door — precies zoals jij voorspeld had! Punten binnen!`,
                    `Ja! Je had ${hf} ${hn} door en dat klopte. Mooi meegenomen!`,
                    `De volle mep voor jou, ${hf} ${hn} geeft je punten!`,
                    `Ja hoor! The story of ${hf} ${hn} continues. Points in the pocket!`,
                    `${hf} ${hn} door en jij had dat zien aankomen. Punten!`,
                ] : [
                    `${hf} ${hn} was jouw keuze, maar het pakte helaas anders uit.`,
                    `Jammer, ${hf} ${hn} is er niet doorgekomen. Volgende ronde beter!`,
                    `Huilen om ${hf} ${hn}, ze hebben je voorspelling niet waargemaakt.`,
                    `${hf} ${hn} stelt je teleur. Volgende keer beter!`,
                    `Pech — je had ${hf} ${hn} door, maar dat land gaat naar huis.`,
                ];
            } else if (awayPredicted) {
                options = totalPunten > 0 ? [
                    `${af} ${an} heeft een ronde overleefd! Punten binnen!`,
                    `Yes! ${af} ${an} to the next round. Punten voor jou!`,
                    `${af} ${an} weer een stap verder op het WK. En jij zag dat aankomen!`,
                    `Je pakt de punten met ${af} ${an}, goede voorspelling!`,
                    `${af} ${an} stond in jouw glazen bol. Gefeliciteerd!`,
                ] : [
                    `${af} ${an} zou jouw punten moeten pakken, maar dat feest ging niet door.`,
                    `Jammer, ${af} ${an} moet naar huis. Volgende keer beter!`,
                    `Oh nee, ${af} ${an} verlaat het toernooi. Geen punten voor jou`,
                    `Traantje gelaten? ${af} ${an} is uitgeschakeld.`,
                    `Oh jee — je dacht dat ${af} ${an} door zou gaan, maar het mocht niet zo zijn.`,
                ];
            } else {
                options = [
                    `Geen van beide landen zat in jouw voorspelling — deze wedstrijd leverde je geen punten op.`,
                    `Je had geen van deze landen door. Deze wedstrijd ging aan je voorbij.`,
                    `Heb je wel gekeken? Je kon met beide landen in deze wedstrijd al geen punten meer pakken.`,
                    `Een wedstrijd die jou geen punten opleverde.`,
                    `Geen punten uit deze wedstrijd, maar dat wist je al!`,
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

        this.uiService.participant$.pipe(take(1)).subscribe(participant => {
            if (participant?.isAllowed) {
                this.poulePredictionService.checkPrediction().subscribe({
                    next: result => { this.checkPredictionResult = result; },
                    error: () => { this.checkPredictionResult = null; }
                });
            }
        });
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

    async openPredictionMessages(groups: Array<{ title?: string; messages: string[] }>, title: string) {
        const modal = await this.modalController.create({
            component: PredictionMessagesModalComponent,
            componentProps: { groups, title },
            breakpoints: [0, 0.5, 1],
            initialBreakpoint: 0.8
        });
        await modal.present();
    }

    openKnockoutMessages() {
        if (!this.checkPredictionResult) { return; }
        const groups = this.checkPredictionResult.knockoutPredictions.messages.map(g => ({
            title: this.roundToText(g.round),
            messages: g.messages
        }));
        this.openPredictionMessages(groups, 'Inconsistenties in knockoutschema');
    }

    openKnockoutCompleteMessages() {
        if (!this.checkPredictionResult) { return; }
        const groups = this.checkPredictionResult.knockoutPredictionsComplete.messages.map(g => ({
            title: this.roundToText(g.round),
            messages: [g.message]
        }));
        this.openPredictionMessages(groups, 'Knockout volledigheid');
    }

    private roundToText(round: number): string {
        const map: Record<number, string> = {
            32: 'Zestiende finale', 16: 'Achtste finale', 8: 'Kwartfinale',
            4: 'Halve finale', 3: 'Troostfinale', 1.5: 'Winnaar troostfinale', 2: 'Finale'
        };
        return map[round] ?? 'Wereldkampioen';
    }

    navigateToPredictions() {
        this.router.navigate(['prediction']);
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }
}
