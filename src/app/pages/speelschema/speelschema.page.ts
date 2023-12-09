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

  unsubscribe = new Subject<void>();
  ionViewWillEnter() {
    this.matchService.getMatches().subscribe(matches => {
      this.matches = matches
    })

    this.poulePredictionService.getPouleResults()
      .pipe(switchMap((pp) => {

        this.poules = pp.filter(p => p.team && p.team.poulePosition !== null);
        console.log(pp);
        console.log(this.poules);
        return this.knockoutService.getOriginalSpeelschema()
      }))
      .subscribe(speelschema => {
        console.log(speelschema);
        this.knockout = speelschema.reduce((speelschemaWithTeams, match) => {
          return [...speelschemaWithTeams,
          {
            ...match,
            homeTeam: this.knockoutHelper.setTeam(speelschemaWithTeams, match.homeId, match.round, this.poules, null), 
            awayTeam: this.knockoutHelper.setTeam(speelschemaWithTeams, match.awayId, match.round, this.poules, null)
          }];
        }, []);
      });
  }


  ngOnInit() {
  }

}
