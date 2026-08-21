import { Component } from '@angular/core';
import { KnockoutPredictionsService } from '../../../services/knockout-predictions.service';
import { combineLatest, of, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from '../../../services/ui.service';
import { IStandLine } from '../../../models/stand.model';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { Gesture } from 'src/app/directives/gestures.directive';
import { IKnockout } from 'src/app/models/knockout.model';
import { ActionSheetController } from '@ionic/angular';

@Component({
    selector: 'app-knockout',
    templateUrl: './knockout.page.html',
    styleUrls: ['./knockout.page.scss'],
    standalone: false
})
export class KnockoutPage {

    knockoutSpeelschema: { round: string; matches: IKnockout[] }[];
    standLine: IStandLine;
    showWinnaarTroostFinale = true;
    winnaarTroostFinale: any;
    kampioen: any;
    unsubscribe = new Subject<void>();
    gestureOpts: Gesture[] = [{ name: 'swipe' }];
    stand: IStandLine[];
    standIndex: number;

    isViewingOthers = false;
    myTeamsByRound: Map<string, Set<string>> | null = null;
    myKampioen: any = null;
    myWinnaarTroostFinale: any = null;
    myFullKnockout: IKnockout[] = [];

    selectedSegment: 'voorspellingen' | 'vergelijk' = 'voorspellingen';
    compareByRound: { round: string; both: any[]; onlyThey: any[]; onlyMe: any[] }[] = [];
    compareKampioen: { both: any[]; onlyThey: any[]; onlyMe: any[] } = { both: [], onlyThey: [], onlyMe: [] };
    compareTroostfinale: { both: any[]; onlyThey: any[]; onlyMe: any[] } = { both: [], onlyThey: [], onlyMe: [] };

    private readonly STORAGE_KEY = 'knockout_view_segment';

    constructor(private knockoutPredictionService: KnockoutPredictionsService,
        private uiService: UiService,
        private router: Router,
        private route: ActivatedRoute,
        private actionSheetCtrl: ActionSheetController) {
    }

    ionViewWillEnter() {
        this.unsubscribe = new Subject<void>();

        this.refresh(null);

        combineLatest([this.uiService.totaalstand$, this.route.params])
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(([stand, params]) => {
                if (stand && params.id) {
                    this.stand = stand;
                    this.standLine = stand.find(line => line.id === params.id);
                    this.standIndex = stand.findIndex(line => line.id === params.id);
                }
            });

        combineLatest([this.uiService.participant$, this.route.params])
            .pipe(
                takeUntil(this.unsubscribe),
                switchMap(([me, params]) => {
                    if (me?.id && params.id && me.id !== params.id) {
                        return combineLatest([
                            this.knockoutPredictionService.getKnockoutForParticipant(me.id),
                            this.knockoutPredictionService.getWinnersForParticipant(me.id)
                        ]).pipe(map(([myKnockout, myWinners]) => ({ isOther: true, myKnockout, myWinners })));
                    }
                    return of({ isOther: false, myKnockout: [], myWinners: [] });
                })
            )
            .subscribe(({ isOther, myKnockout, myWinners }) => {
                this.isViewingOthers = isOther;
                if (isOther) {
                    const teamMap = new Map<string, Set<string>>();
                    myKnockout.forEach(match => {
                        if (!teamMap.has(match.round)) { teamMap.set(match.round, new Set()); }
                        if (match.prediction?.homeTeam?.id) { teamMap.get(match.round).add(match.prediction.homeTeam.id); }
                        if (match.prediction?.awayTeam?.id) { teamMap.get(match.round).add(match.prediction.awayTeam.id); }
                    });
                    this.myTeamsByRound = teamMap;
                    this.myKampioen = myWinners.find(r => r.round === '1') ?? null;
                    this.myWinnaarTroostFinale = myWinners.find(r => r.round === '1.5') ?? null;
                    this.myFullKnockout = myKnockout;
                    this.buildCompareData();
                    const saved = localStorage.getItem(this.STORAGE_KEY) as 'voorspellingen' | 'vergelijk' | null;
                    if (saved) { this.selectedSegment = saved; }
                    this.uiService.tabToolbarAction$.next({ icon: 'eye-outline', handler: () => this.openViewSheet() });
                } else {
                    this.myTeamsByRound = null;
                    this.myKampioen = null;
                    this.myWinnaarTroostFinale = null;
                    this.myFullKnockout = [];
                    this.compareByRound = [];
                    this.selectedSegment = 'voorspellingen';
                    this.uiService.tabToolbarAction$.next(null);
                }
            });
    }

    async openViewSheet() {
        const sheet = await this.actionSheetCtrl.create({
            header: 'Weergave',
            buttons: [
                {
                    text: 'Voorspellingen',
                    icon: this.selectedSegment === 'voorspellingen' ? 'checkmark-outline' : 'list-outline',
                    handler: () => { this.selectedSegment = 'voorspellingen'; localStorage.setItem(this.STORAGE_KEY, 'voorspellingen'); }
                },
                {
                    text: 'Vergelijk met mij',
                    icon: this.selectedSegment === 'vergelijk' ? 'checkmark-outline' : 'people-outline',
                    handler: () => { this.selectedSegment = 'vergelijk'; localStorage.setItem(this.STORAGE_KEY, 'vergelijk'); }
                },
                { text: 'Annuleren', role: 'cancel' }
            ]
        });
        await sheet.present();
    }

    private buildCompareData(): void {
        if (!this.isViewingOthers) {
            this.compareByRound = [];
            this.compareKampioen = { both: [], onlyThey: [], onlyMe: [] };
            this.compareTroostfinale = { both: [], onlyThey: [], onlyMe: [] };
            return;
        }

        if (this.knockoutSpeelschema?.length && this.myFullKnockout?.length) {
            const myTeamsMap = new Map<string, Map<string, any>>();
            this.myFullKnockout
                .filter(m => m.round !== '1' && m.round !== '1.5' && m.round !== '3')
                .forEach(match => {
                    if (!myTeamsMap.has(match.round)) { myTeamsMap.set(match.round, new Map()); }
                    const roundMap = myTeamsMap.get(match.round);
                    if (match.prediction?.homeTeam?.id) { roundMap?.set(match.prediction.homeTeam.id, match.prediction.homeTeam); }
                    if (match.prediction?.awayTeam?.id) { roundMap?.set(match.prediction.awayTeam.id, match.prediction.awayTeam); }
                });

            this.compareByRound = this.knockoutSpeelschema.map(({ round, matches }) => {
                const theyTeamsMap = new Map<string, any>();
                matches.forEach(match => {
                    if (match.prediction?.homeTeam?.id) { theyTeamsMap.set(match.prediction.homeTeam.id, match.prediction.homeTeam); }
                    if (match.prediction?.awayTeam?.id) { theyTeamsMap.set(match.prediction.awayTeam.id, match.prediction.awayTeam); }
                });

                const myRoundTeams = myTeamsMap.get(round) ?? new Map();
                const both: any[] = [];
                const onlyThey: any[] = [];
                const onlyMe: any[] = [];

                theyTeamsMap.forEach((team, id) => {
                    if (myRoundTeams.has(id)) { both.push(team); } else { onlyThey.push(team); }
                });
                myRoundTeams.forEach((team, id) => {
                    if (!theyTeamsMap.has(id)) { onlyMe.push(team); }
                });

                return { round, both, onlyThey, onlyMe };
            });
        }

        this.compareKampioen = this.buildWinnerCompare(this.kampioen, this.myKampioen);
        this.compareTroostfinale = this.buildWinnerCompare(this.winnaarTroostFinale, this.myWinnaarTroostFinale);
    }

    private buildWinnerCompare(they: any, me: any): { both: any[]; onlyThey: any[]; onlyMe: any[] } {
        const theyTeam = they?.team ? { ...they.team, spelPunten: they.spelPunten } : null;
        const myTeam = me?.team ? { ...me.team, spelPunten: me.spelPunten } : null;

        if (theyTeam && myTeam) {
            return theyTeam.id === myTeam.id
                ? { both: [theyTeam], onlyThey: [], onlyMe: [] }
                : { both: [], onlyThey: [theyTeam], onlyMe: [myTeam] };
        }
        return { both: [], onlyThey: theyTeam ? [theyTeam] : [], onlyMe: myTeam ? [myTeam] : [] };
    }

    onSwipe($event) {
        if ($event.swipeType === 'moveend') {
            this.standIndex = $event.dirX === 'right' && this.standIndex === 0 ?
                0 : $event.dirX === 'right' ? this.standIndex - 1 :
                    (this.standIndex + 1 === this.stand.length) ?
                        this.standIndex : this.standIndex + 1;

            this.router.navigate([`deelnemer/deelnemer/${this.stand[this.standIndex].id}/knockout/`]);
        }
    }

    refresh(event): void {
        combineLatest([
            this.route.params.pipe(switchMap(params => this.knockoutPredictionService.getKnockoutForParticipant(params.id))),
            this.route.params.pipe(switchMap(params => this.knockoutPredictionService.getWinnersForParticipant(params.id)))
        ])
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(([knockoutResults, winnerResults]) => {
                const grouped = knockoutResults
                    .filter(r => r.round !== '1' && r.round !== '1.5' && r.round !== '3')
                    .reduce((acc, match) => {
                        const existing = acc.find(g => g.round === match.round);
                        if (existing) {
                            existing.matches.push(match);
                        } else {
                            acc.push({ round: match.round, matches: [match] });
                        }
                        return acc;
                    }, [] as { round: string; matches: IKnockout[] }[]);
                this.knockoutSpeelschema = grouped.sort((a, b) => +b.round - +a.round);
                this.kampioen = winnerResults.find(r => r.round === '1');
                this.winnaarTroostFinale = winnerResults.find(r => r.round === '1.5');
                this.buildCompareData();
            });

        if (event) {
            event.target.complete();
        }
    }

    openKoTeam(team, round) {
        this.router.navigate([`stats/knockout/round/${round}/team/${team}`], { replaceUrl: false });
    }

    ionViewDidLeave(): void {
        console.log("KnockoutPage ionViewDidLeave");
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }
    ngOnDestroy(): void {
        this.uiService.tabToolbarAction$.next(null);

    }
}
