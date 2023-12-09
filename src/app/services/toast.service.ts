import {Injectable} from '@angular/core';
import {AlertController, ToastController} from '@ionic/angular';
import {UiService} from './ui.service';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(private toastController: ToastController, private alertController: AlertController, private uiService: UiService) {
    }

    async presentToast(message: string,
                       color: string = 'success',
                       showCloseButton: boolean = true,
                       closeButtonText: string = 'OK',
                       duration: number = 3000) {
        const toast = await this.toastController.create({
            position: 'top',
            color,
            message,
            duration,
            mode: 'md',
            buttons: [
                {
                    text: closeButtonText,
                    role: 'cancel',
                    handler: () => {
                    }
                }
            ]
        });
        toast.present();
    }

    async presentAlertConfirm(): Promise<boolean> {
        const alert = await this.alertController.create({
            header: 'Wijzigingen niet opgeslagen',
            message: 'Weet je zeker dat je de pagina wilt verlaten?',
            buttons: [
                {
                    text: 'Ja',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        this.uiService.isDirty$.next(false);
                    }
                }, {
                    text: 'Nee',
                    handler: () => {
                    }
                }
            ]
        });

        await alert.present();
        return await alert.onDidDismiss().then(result => result.role === 'cancel');
    }
}
