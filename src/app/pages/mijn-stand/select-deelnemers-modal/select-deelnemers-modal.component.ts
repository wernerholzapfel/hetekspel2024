import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IStandLine } from '../../../models/stand.model';

@Component({
    selector: 'app-select-deelnemers-modal',
    templateUrl: './select-deelnemers-modal.component.html',
    styleUrls: ['./select-deelnemers-modal.component.scss'],
    standalone: false
})
export class SelectDeelnemersModalComponent implements OnInit {

    @Input() allDeelnemers: IStandLine[] = [];
    @Input() selectedIds: string[] = [];
    @Input() ownId: string | undefined;

    searchTerm = '';
    private sortedDeelnemers: IStandLine[] = [];

    constructor(private modalController: ModalController) {}

    ngOnInit() {
        this.sortedDeelnemers = [...this.allDeelnemers].sort((a, b) => {
            const aSelected = this.isSelected(a.id);
            const bSelected = this.isSelected(b.id);
            if (aSelected !== bSelected) return aSelected ? -1 : 1;
            return a.displayName.localeCompare(b.displayName);
        });
    }

    get displayDeelnemers(): IStandLine[] {
        const term = this.searchTerm.toLowerCase();
        return term
            ? this.sortedDeelnemers.filter(d => d.displayName.toLowerCase().includes(term))
            : this.sortedDeelnemers;
    }

    isSelected(id: string): boolean {
        return id === this.ownId || this.selectedIds.includes(id);
    }

    isOwn(id: string): boolean {
        return id === this.ownId;
    }

    toggle(id: string) {
        if (this.isOwn(id)) { return; }
        if (this.isSelected(id)) {
            this.selectedIds = this.selectedIds.filter(s => s !== id);
        } else {
            this.selectedIds = [...this.selectedIds, id];
        }
    }

    async save() {
        await this.modalController.dismiss(this.selectedIds);
    }

    async cancel() {
        await this.modalController.dismiss(null);
    }
}
