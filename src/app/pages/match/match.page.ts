import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatchService} from '../../services/match.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IMatch} from '../../models/poule.model';
import {takeUntil} from 'rxjs/operators';
import {UiService} from '../../services/ui.service';
import {BehaviorSubject, combineLatest, Subject} from 'rxjs';

@Component({
    selector: 'app-match',
    templateUrl: './match.page.html',
    styleUrls: ['./match.page.scss'],
})
export class MatchPage implements OnInit, OnDestroy {

    initial = true;
    showFilter = false;
    match: IMatch;
    totoUitslagen:
        {
            toto: number, uitslagen?:
                { homeScore: number, awayScore: number, count?: number, aantal?: number, active: boolean }[]
        }[];
    unsubscribe = new Subject<void>();
    searchTerm$: BehaviorSubject<string> = new BehaviorSubject('');
    selectedUitslagen$: BehaviorSubject<{ homeScore: number, awayScore: number, aantal?: number, count?: number }[]>
        = new BehaviorSubject([]);

    constructor(private matchService: MatchService,
                private route: ActivatedRoute,
                private router: Router,
                private uiService: UiService) {
    }

    ngOnInit() {

        combineLatest([
            this.uiService.totaalstand$,
            this.matchService.getMatch(this.route.snapshot.params.id),
            this.searchTerm$,
            this.selectedUitslagen$,
        this.uiService.participant$])
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(([stand, match, searchTerm, selectedUitslagen,participant]) => {
                if (stand && match) {
                    this.totoUitslagen = [{toto: 1, uitslagen: []}, {toto: 2, uitslagen: []}, {toto: 3, uitslagen: []}];
                    const map = new Map();
                    for (const item of match.matchPredictions) {
                        if (!map.has(`${item.homeScore}-${item.awayScore}`)) {
                            map.set(`${item.homeScore}-${item.awayScore}`, true);    // set any value to Map
                            const toto = this.determineToto(item);
                            this.totoUitslagen[toto - 1].uitslagen.push({
                                homeScore: item.homeScore,
                                awayScore: item.awayScore,
                                active: selectedUitslagen.length > 0 &&
                                    !!selectedUitslagen.find(su => su.homeScore === item.homeScore && su.awayScore === item.awayScore)
                            });
                        }
                    }
                    if (stand.length > 0) {
                        this.match = {
                            ...match,
                            matchPredictions: this.uiService.filterDeelnemers(searchTerm, match.matchPredictions.map(mp => {
                                return {
                                    ...mp,
                                    tableLine: stand.find(line => line.id === mp.participant.id),
                                    isMine: participant && mp.participant.id === participant.id
                                };
                            }).sort((a, b) => a.tableLine.position - b.tableLine.position))
                                .filter(mp => selectedUitslagen.length === 0 ||
                                    !!selectedUitslagen.find(u => u.homeScore === mp.homeScore && u.awayScore === mp.awayScore))
                        };

                        this.totoUitslagen = this.totoUitslagen.map(
                            toto => {
                                return {
                                    ...toto,
                                    uitslagen: toto.uitslagen.map(uitslagMap => {
                                        return {
                                            ...uitslagMap,
                                            aantal: match.matchPredictions
                                                .filter(mpMap =>
                                                    mpMap.homeScore === uitslagMap.homeScore &&
                                                    mpMap.awayScore === uitslagMap.awayScore).length,
                                            count: match.matchPredictions
                                                    .filter(mpMap =>
                                                        mpMap.homeScore === uitslagMap.homeScore &&
                                                        mpMap.awayScore === uitslagMap.awayScore).length /
                                                match.matchPredictions.length
                                        };
                                    }).sort((a, b) => b.count - a.count)
                                };
                            });
                        if (this.route.snapshot.params.totoId && this.initial) {
                            this.initial = false;
                            this.selectedUitslagen$.next(this.totoUitslagen
                                .find(t => t.toto.toString() === this.route.snapshot.params.totoId).uitslagen);
                        }
                    }
                }
            });

    }

    navigateToParticipant(participantId) {
        this.router.navigate([`deelnemer/deelnemer/${participantId}/matches/`], {replaceUrl: false});
    }

    search($event) {
        this.searchTerm$.next($event.detail.value);
    }

    filterUitslag(uitslag) {
        if (uitslag) {
            if (uitslag.active) {
                this.selectedUitslagen$.value ?
                    this.selectedUitslagen$.next([...this.selectedUitslagen$.value
                        .filter(su => su.homeScore !== uitslag.homeScore || su.awayScore !== uitslag.awayScore)]) :
                    this.selectedUitslagen$.next([uitslag]);
            } else {
                this.selectedUitslagen$.value ?
                    this.selectedUitslagen$.next([...this.selectedUitslagen$.value, uitslag]) :
                    this.selectedUitslagen$.next([uitslag]);
            }
        }
        this.showFilter = false;
    }

    resetFilter() {
        this.selectedUitslagen$.next([]);
        this.showFilter = false;
    }

    setTotoUitslagenAsFilter(uitslagen: any[]) {
        this.selectedUitslagen$.next(uitslagen);
        this.showFilter = false;
    }

    determineToto(item: any) {
        return item.homeScore > item.awayScore ? 1 : item.homeScore < item.awayScore ? 2 : 3;
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }
}
