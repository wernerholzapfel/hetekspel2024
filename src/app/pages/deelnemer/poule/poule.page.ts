import {Component, OnDestroy, OnInit} from '@angular/core';
import {IStandLine} from '../../../models/stand.model';
import {combineLatest, Subject} from 'rxjs';
import {UiService} from '../../../services/ui.service';
import {ActivatedRoute} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs/operators';
import {PoulepredictionService} from '../../../services/pouleprediction.service';
import {IPoulePrediction} from '../../../models/participant.model';

@Component({
    selector: 'app-poule',
    templateUrl: './poule.page.html',
    styleUrls: ['./poule.page.scss'],
    standalone: false
})
export class PoulePage {

  standLine: IStandLine
  poules = [];
  unsubscribe = new Subject<void>();

  constructor(private uiService: UiService,
              private route: ActivatedRoute,
              private poulepredictionService: PoulepredictionService) { }


  ionViewWillEnter() {
    this.unsubscribe = new Subject<void>();

    this.refresh(null);

    combineLatest([this.uiService.totaalstand$, this.route.params])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([stand, params]) => {
        if (stand && params.id) {
          this.standLine = stand.find(line => line.id === params.id);
        }
      })

  }

  refresh(event):void {
    this.route.params.pipe(switchMap((params) => {
      return  this.poulepredictionService.getPoulePredictionsByParticipant(params.id)
    }))
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        poulePrediction => {
            const pouleNames = [...new Set(poulePrediction.map(p => p.poule))].sort();
          this.poules = pouleNames.map(poule => ({
            poule,
            stand: poulePrediction.filter(p => p.poule === poule).sort((a, b) => a.positie - b.positie),
            isSortDisabled: true
          }));
        });
        if (event) {
          event.target.complete();
      }
  }
  ionViewDidLeave(): void {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }

}
