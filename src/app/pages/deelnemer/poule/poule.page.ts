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

    this.route.params.pipe(switchMap((params) => {
      return  this.poulepredictionService.getPoulePredictionsByParticipant(params.id)
    }))
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        poulePrediction => {
          this.poules = [{
            poule: 'A', stand: poulePrediction.filter(p => p.poule === 'A')
                .sort((a, b) => a.positie - b.positie),
            isSortDisabled: true
          },
            {
              poule: 'B', stand: poulePrediction.filter(p => p.poule === 'B')
                  .sort((a, b) => a.positie - b.positie),
              isSortDisabled: true
            },
            {
              poule: 'C', stand: poulePrediction.filter(p => p.poule === 'C')
                  .sort((a, b) => a.positie - b.positie),
              isSortDisabled: true
            },
            {
              poule: 'D', stand: poulePrediction.filter(p => p.poule === 'D')
                  .sort((a, b) => a.positie - b.positie),
              isSortDisabled: true
            },
            {
              poule: 'E', stand: poulePrediction.filter(p => p.poule === 'E')
                  .sort((a, b) => a.positie - b.positie),
              isSortDisabled: true
            },
            {
              poule: 'F', stand: poulePrediction.filter(p => p.poule === 'F')
                  .sort((a, b) => a.positie - b.positie),
              isSortDisabled: true
            },
            {
              poule: 'G', stand: poulePrediction.filter(p => p.poule === 'G')
                  .sort((a, b) => a.positie - b.positie),
              isSortDisabled: true
            },
            {
              poule: 'H', stand: poulePrediction.filter(p => p.poule === 'H')
                  .sort((a, b) => a.positie - b.positie),
              isSortDisabled: true
            }];
        });

    combineLatest([this.uiService.totaalstand$, this.route.params])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([stand, params]) => {
        if (stand && params.id) {
          this.standLine = stand.find(line => line.id === params.id);

        }
      })

  }

  ionViewDidLeave(): void {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }

}
