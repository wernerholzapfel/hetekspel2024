import {Component, Input, OnInit} from '@angular/core';
import {ITableLine} from '../../models/poule.model';
import {ModalController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {UpdateTeamPage} from '../../pages/update-team/update-team.page';
import {TeamService} from '../../services/team.service';
import {ToastService} from '../../services/toast.service';

@Component({
    selector: 'app-league-table-row',
    templateUrl: './league-table-row.component.html',
    styleUrls: ['./league-table-row.component.scss'],
})
export class LeagueTableRowComponent implements OnInit {

    @Input() line: ITableLine;
    @Input() admin: boolean;
    @Input() isSortDisabled: boolean;
    @Input() index: number;
    @Input() isRegistrationOpen$: Observable<boolean>;

    constructor(private modalController: ModalController,
                private teamService: TeamService,
                private toastService: ToastService) {
    }

    ngOnInit() {
    }

    async openSelect() {
        const modal = await this.modalController.create({
            component: UpdateTeamPage,
            componentProps: {line: this.line}
        });

        await modal.present();

        const {data} = await modal.onWillDismiss();
        if (data) {
            this.save(data);
        }
    }

    save(line: ITableLine) {
        this.teamService.updateTeam({
            id: line.team.id,
            poulePosition: line.positie,
            isEliminated: line.team.isEliminated,
            eliminationRound: '32',
            isPositionFinal: line.isPositionFinal
        }).subscribe(() => {
            this.toastService.presentToast('opslaan gelukt');
            this.line = {
                ...line,
                team: {
                    ...line.team,
                    eliminationRound: '32'
                }
            };
        }, () => this.toastService.presentToast('opslaan mislukt', 'danger'));
    }

}
