import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { combineLatest } from 'rxjs';
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

  @ViewChild(IonContent) content!: IonContent;

  constructor(private matchService: MatchService,
    private knockoutService: KnockoutService) { }

  matches: IMatch[] = [];
  public knockout: IKnockout[] = [];

  ionViewWillEnter() {
    combineLatest([
      this.matchService.getMatches(),
      this.knockoutService.getOriginalSpeelschema()
    ]).subscribe(([matches, speelschema]) => {
      this.matches = matches;
      this.knockout = speelschema;
      this.scrollToLastPlayedKnockout();
    });
  }

  private scrollToLastPlayedKnockout(): void {
    const firstUnplayedMatch = this.matches?.findIndex(m => m.homeScore == null);

    if (firstUnplayedMatch !== -1) {
      const index = firstUnplayedMatch > 0 ? firstUnplayedMatch - 1 : -1;
      if (index < 0) return;
      setTimeout(() => {
        const el = document.getElementById(`match-${index}`);
        if (el && this.content) {
          this.content.scrollToPoint(0, el.offsetTop, 300);
        }
      }, 100);
    } else {
      const firstUnplayedKnockout = this.knockout?.findIndex(m => m.homeScore == null);
      const index = firstUnplayedKnockout > 0 ? firstUnplayedKnockout - 1 : this.knockout.length - 1;
      setTimeout(() => {
        const el = document.getElementById(`knockout-${index}`);
        if (el && this.content) {
          this.content.scrollToPoint(0, el.offsetTop, 300);
        }
      }, 100);
    }
  }


  ngOnInit() {
  }

}
