import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IParticipant } from 'src/app/models/participant.model';
import { ParticipantService } from 'src/app/services/participant.service';
import { UiService } from 'src/app/services/ui.service';
import { CapacitorUpdater } from '@capgo/capacitor-updater'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  constructor(public uiService: UiService,
    private participantService: ParticipantService) {
  }

  unsubscribe = new Subject<void>();

  newDisplayName: string;
  editNewDisplayName: boolean;
  participant: IParticipant;
  deviceId: string;
  currentVersion: {
    bundle: BundleInfo;
    native: string;
  }
  versionState: any;

  ionViewWillEnter() {
    this.uiService.participant$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(participant => {
        this.participant = participant;
      })

    CapacitorUpdater.getDeviceId().then(response => {
      this.deviceId = response.deviceId;
    })
    CapacitorUpdater.list().then(response => {
      this.versionState = response;
      console.log(response)
    })
    CapacitorUpdater.current().then(response => {
      this.currentVersion = response
      console.log(response)
    })

  }

  updateDisplayName() {
    this.participantService.updateDisplayName({
      id: this.participant.id,
      displayName: this.newDisplayName
    }).subscribe(response => {
      this.uiService.participant$.next({ ...this.participant, displayName: this.newDisplayName })
      this.editNewDisplayName = false;
      this.uiService.presentToast('Opslaan is gelukt, je naam wordt in de volgende stand meegenomen', 'success')
    })
  }

  ionViewDidLeave(): void {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }

}

export interface BundleInfo {
  id: string;
  version: string;
  downloaded: string;
  checksum: string;
  status: BundleStatus;
}
export declare type BundleStatus = 'success' | 'error' | 'pending' | 'downloading';
