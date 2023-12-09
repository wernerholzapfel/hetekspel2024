import {Component, OnInit} from '@angular/core';
import {StandService} from '../../../services/stand.service';
import {ToastService} from '../../../services/toast.service';
import {NotificationService} from '../../../services/notification.service';
import {StatsService} from '../../../services/stats.service';

@Component({
    selector: 'app-stand',
    templateUrl: './stand.page.html',
    styleUrls: ['./stand.page.scss'],
})
export class StandPage implements OnInit {

    constructor(private standService: StandService,
                private statsService: StatsService,
                private notificationService: NotificationService,
                private toastService: ToastService) {
    }

    ngOnInit() {
    }

    berekenStand() {
        this.standService.createStand().subscribe(stand => {
            this.toastService.presentToast('stand bijgewerkt');
        });
    }

    createTotoStats() {
        this.statsService.createTotoStats().subscribe(stand => {
            this.toastService.presentToast('toto statistieken bijgewerkt');
        });
    }

    createKnockoutStats() {
        this.statsService.createKnockoutStats().subscribe(stand => {
            this.toastService.presentToast('knockout statistieken bijgewerkt');
        });
    }

    sendNotification() {
        this.notificationService.sendNotification().subscribe(() => {
            this.toastService.presentToast('notificatie vestuurd');
        });
    }
}
