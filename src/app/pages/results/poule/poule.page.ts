import {Component} from '@angular/core';
import {Subject} from 'rxjs';
import {MatchService} from '../../../services/match.service';
import {IMatchPrediction} from '../../../models/participant.model';
import {PoulepredictionService} from '../../../services/pouleprediction.service';

@Component({
    selector: 'app-poule',
    templateUrl: './poule.page.html',
    styleUrls: ['./poule.page.scss'],
    standalone: false
})
export class PoulePage {

    unsubscribe = new Subject<void>();
    matchPredictions: IMatchPrediction[];
    allMatchPredictions: IMatchPrediction[];
    poules = [];

    constructor(private matchService: MatchService,
                private poulepredictionService: PoulepredictionService) {
    }

    ionViewWillEnter() {
        this.poulepredictionService.getPouleResults().subscribe(
           poulePrediction => {
            const pouleNames = [...new Set(poulePrediction.map(p => p.poule))].sort();
          this.poules = pouleNames.map(poule => ({
            poule,
            stand: poulePrediction.filter(p => p.poule === poule).sort((a, b) => a.positie - b.positie),
            isSortDisabled: true
          }));
        });
    }
}
