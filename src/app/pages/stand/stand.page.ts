import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UiService } from '../../services/ui.service';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { IStandLine } from '../../models/stand.model';
import { StandService } from '../../services/stand.service';
import { PopoverController } from '@ionic/angular';
import { ToggleStandListComponent } from '../../components/toggle-stand-list/toggle-stand-list.component';

@Component({
    selector: 'app-stand',
    templateUrl: './stand.page.html',
    styleUrls: ['./stand.page.scss'],
})
export class StandPage {

    searchTerm$: BehaviorSubject<string> = new BehaviorSubject('');
    isMatchStandActive = false;
    mijnStand: IStandLine;
    stand: IStandLine[];
    unsubscribe: Subject<void>;

    constructor(public uiService: UiService,
        private standService: StandService,
        private router: Router,
        private popoverController: PopoverController) {
    }

    ionViewWillEnter() {
        this.unsubscribe = new Subject<void>();

        combineLatest([
            this.uiService.totaalstand$,
            this.searchTerm$,
            this.uiService.participant$])
            .subscribe(([stand, searchTerm, participant]) => {
                console.log(stand)
                this.stand = this.uiService.filterDeelnemers(searchTerm, stand.map(line => {
                    return {
                        ...line,
                        isMine: participant && line.id === participant.id
                    }
                }));

                this.mijnStand = stand.find(item => participant && item.id === participant.id)
                console.log(this.mijnStand)
            });
    }

    changeStand(isMatchStandActive) {
        this.isMatchStandActive = !isMatchStandActive
        this.stand = this.stand.sort((a,b) => this.isMatchStandActive ? a.matchPosition - b.matchPosition : a.position - b.position)

    }
    search($event) {
        this.searchTerm$.next($event.detail.value);
    }

    navigateToParticipant(participantId) {
        this.router.navigate([`deelnemer/deelnemer/${participantId}/matches/`], { replaceUrl: false });
    }

    openMatches(participantId) {
        this.router.navigate([`deelnemer/deelnemer/${participantId}/matches/`], { replaceUrl: false });
    }

    openPoules(participantId) {
        this.router.navigate([`deelnemer/deelnemer/${participantId}/poule/`], { replaceUrl: false });
    }

    openKnockout(participantId) {
        this.router.navigate([`deelnemer/deelnemer/${participantId}/knockout/`], { replaceUrl: false });
    }

    ionViewDidLeave(): void {
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }

    // async toggleMatchStand() {

    // this.uiService.isMatchStandActive$.next(!this.uiService.isMatchStandActive$.getValue());
    // }
}
