import {Component} from '@angular/core';
import {Subject} from 'rxjs';
import {MatchService} from '../../../services/match.service';
import {IMatchPrediction} from '../../../models/participant.model';
import {PoulepredictionService} from '../../../services/pouleprediction.service';

@Component({
    selector: 'app-poule',
    templateUrl: './poule.page.html',
    styleUrls: ['./poule.page.scss'],
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
                    }, {
                        poule: 'G', stand: poulePrediction.filter(p => p.poule === 'G')
                            .sort((a, b) => a.positie - b.positie),
                        isSortDisabled: true
                    }, {
                        poule: 'H', stand: poulePrediction.filter(p => p.poule === 'H')
                            .sort((a, b) => a.positie - b.positie),
                        isSortDisabled: true
                    }];
            });
    }
}
