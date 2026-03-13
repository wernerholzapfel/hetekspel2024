import { Component, OnInit } from '@angular/core';
import { IKnockout } from 'src/app/models/knockout.model';
import { IMatch, } from 'src/app/models/poule.model';
import { KnockoutService } from 'src/app/services/knockout.service';
import { MatchService } from 'src/app/services/match.service';

@Component({
    selector: 'app-speelschema',
    templateUrl: './speelschema.page.html',
    styleUrls: ['./speelschema.page.scss'],
    standalone: false
})
export class SpeelschemaPage implements OnInit {

  constructor(private matchService: MatchService,
    private knockoutService: KnockoutService) { }

  matches: IMatch[];
  public knockout: IKnockout[];

  ionViewWillEnter() {
    this.matchService.getMatches().subscribe(matches => {
      this.matches = matches
    })

    this.knockoutService.getOriginalSpeelschema()
      .subscribe(speelschema => {
        this.knockout = speelschema

      })
  }


  ngOnInit() {
  }

}
