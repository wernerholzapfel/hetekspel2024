import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IKnockout } from 'src/app/models/knockout.model';
import { IMatch, ITeam } from 'src/app/models/poule.model';
import { KnockoutService } from 'src/app/services/knockout.service';
import { KnockoutHelperService } from 'src/app/services/knockoutHelper.service';
import { MatchService } from 'src/app/services/match.service';
import { PoulepredictionService } from 'src/app/services/pouleprediction.service';

@Component({
  selector: 'app-speelschema',
  templateUrl: './speelschema.page.html',
  styleUrls: ['./speelschema.page.scss'],
})
export class SpeelschemaPage implements OnInit {

  constructor(private matchService: MatchService,
    private knockoutService: KnockoutService,
    private knockoutHelper: KnockoutHelperService,
    private poulePredictionService: PoulepredictionService) { }

  matches: IMatch[];
  public knockout: IKnockout[];
  poules: any[];
  speelschema: any[];
  nummerDries: any[]
  nummerDrieIdentifier: string;
  unsubscribe = new Subject<void>();
  ionViewWillEnter() {
    this.matchService.getMatches().subscribe(matches => {
      this.matches = matches
    })

    this.poulePredictionService.getPouleResults()
      .pipe(switchMap((pp) => {
        this.nummerDries = pp.filter(item => item.positie === 3)
        .sort((a, b) => b.thirdPositionScore - a.thirdPositionScore)
        .slice(0, 4);

        this.nummerDrieIdentifier = this.nummerDries.sort((a, b) => {
            if (b.poule > a.poule) {
                return -1;
            }
            if (a.poule > b.poule) {
                return 1;
            }
            return 0;
        }).reduce((acc: string, val) => acc + val.poule, '');
        this.poules = pp.filter(p => p.team && p.team.poulePosition !== null);
        console.log(pp);
        console.log(this.poules);
        return this.knockoutService.getOriginalSpeelschema()
      }))
      .subscribe(speelschema => {
        console.log(speelschema);
        const thirdplaces = this.poulePredictionService.getPositionForThirdPlacedTeams(this.nummerDrieIdentifier);

        this.knockout = speelschema.map(match => {
            switch (match.awayId) {
                case 'WB':
                    match.awayId = thirdplaces.WB;
                    break;
                case 'WC':
                    match.awayId = thirdplaces.WC;
                    break;
                case 'WE':
                    match.awayId = thirdplaces.WE;
                    break;
                case 'WF':
                    match.awayId = thirdplaces.WF;
                    break;
                default:
                // code block
            }
            return {
            ...match,
            homeTeam: this.knockoutHelper.setTeam(speelschema, match.homeId, match.round, this.poules, null), 
            awayTeam: this.knockoutHelper.setTeam(speelschema, match.awayId, match.round, this.poules, null)
          };
        });
      });
  }


  ngOnInit() {
  }

}
