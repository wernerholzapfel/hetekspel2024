import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UiService } from '../../services/ui.service';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { IStandLine } from '../../models/stand.model';
import { ModalController } from '@ionic/angular';
import { SelectDeelnemersModalComponent } from './select-deelnemers-modal/select-deelnemers-modal.component';

const STORAGE_KEY = 'mijn-stand-deelnemers';

export type MijnStandLine = IStandLine & { mijnStandPosition: number };

@Component({
    selector: 'app-mijn-stand',
    templateUrl: './mijn-stand.page.html',
    styleUrls: ['./mijn-stand.page.scss'],
    standalone: false
})
export class MijnStandPage {

    searchTerm$: BehaviorSubject<string> = new BehaviorSubject('');
    selectedIds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

    isMatchStandActive = false;
    mijnStand: IStandLine | undefined;
    stand!: MijnStandLine[];
    allStand: IStandLine[] = [];
    participantId: string | undefined;
    unsubscribe!: Subject<void>;

    get selectedIds(): string[] {
        return this.selectedIds$.getValue();
    }

    constructor(
        public uiService: UiService,
        private router: Router,
        private modalController: ModalController
    ) {}

    ionViewWillEnter() {
        this.unsubscribe = new Subject<void>();
        this.selectedIds$.next(this.loadSelectedIds());

        combineLatest([
            this.uiService.totaalstand$,
            this.searchTerm$,
            this.uiService.participant$,
            this.selectedIds$])
            .subscribe(([stand, searchTerm, participant, selectedIds]) => {
                this.allStand = stand;

                const filtered = selectedIds.length > 0
                    ? stand.filter(line => selectedIds.includes(line.id) || (participant && line.id === participant.id))
                    : stand;

                const withIsMine = filtered.map(line => ({
                    ...line,
                    isMine: participant && line.id === participant.id
                }));

                const withPositions = this.assignMijnStandPositions(withIsMine, this.isMatchStandActive);

                this.stand = this.uiService.filterDeelnemers(searchTerm, withPositions) as MijnStandLine[];

                this.participantId = participant?.id;
                this.mijnStand = stand.find(item => participant && item.id === participant.id);
            });
    }

    changeStand(isMatchStandActive: boolean) {
        this.isMatchStandActive = !isMatchStandActive;
        const sorted = this.stand.sort((a, b) =>
            this.isMatchStandActive
                ? (a.matchPosition ?? 0) - (b.matchPosition ?? 0)
                : a.position - b.position
        );
        this.stand = this.assignMijnStandPositions(sorted, this.isMatchStandActive);
    }

    private assignMijnStandPositions(lines: IStandLine[], isMatchActive: boolean): MijnStandLine[] {
        const sorted = [...lines].sort((a, b) =>
            isMatchActive
                ? (b.matchPoints ?? 0) - (a.matchPoints ?? 0)
                : b.totalPoints - a.totalPoints
        );

        let currentPos = 1;
        return sorted.map((line, i) => {
            if (i > 0) {
                const prevPoints = isMatchActive ? sorted[i - 1].matchPoints : sorted[i - 1].totalPoints;
                const currPoints = isMatchActive ? line.matchPoints : line.totalPoints;
                if (currPoints < prevPoints) {
                    currentPos = i + 1;
                }
            }
            return { ...line, mijnStandPosition: currentPos };
        });
    }

    search($event: any) {
        this.searchTerm$.next($event.detail.value);
    }

    navigateToParticipant(participantId: string) {
        this.router.navigate([`deelnemer/deelnemer/${participantId}/matches/`], { replaceUrl: false });
    }

    openMatches(participantId: string) {
        this.router.navigate([`deelnemer/deelnemer/${participantId}/matches/`], { replaceUrl: false });
    }

    openPoules(participantId: string) {
        this.router.navigate([`deelnemer/deelnemer/${participantId}/poule/`], { replaceUrl: false });
    }

    openKnockout(participantId: string) {
        this.router.navigate([`deelnemer/deelnemer/${participantId}/knockout/`], { replaceUrl: false });
    }

    async openSelectDeelnemers() {
        const modal = await this.modalController.create({
            component: SelectDeelnemersModalComponent,
            componentProps: {
                allDeelnemers: [...this.allStand].sort((a, b) => a.displayName.localeCompare(b.displayName)),
                selectedIds: [...this.selectedIds],
                ownId: this.participantId
            }
        });

        modal.onDidDismiss().then(({ data }) => {
            if (data !== null) {
                this.saveSelectedIds(data);
                this.selectedIds$.next(data);
            }
        });

        return await modal.present();
    }

    private loadSelectedIds(): string[] {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    private saveSelectedIds(ids: string[]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }

    ionViewDidLeave(): void {
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }
}
