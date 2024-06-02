import { Component, Input, OnInit } from '@angular/core';
import { ITeam } from '../../models/poule.model';

@Component({
  selector: 'app-knockout-team-header',
  templateUrl: './knockout-team-header.component.html',
  styleUrls: ['./knockout-team-header.component.scss'],
})
export class KnockoutTeamHeaderComponent {

  private _team: ITeam;
  private _punten: number;
  private _round: string;


  @Input() set team(value) {
    this._team = value;
    if (value && this.round) {
      this.determineIcon()
    }
  }

  get team() {
    return this._team;
  }

  @Input() set punten(value) {
    this._punten = value
    if (value) {
      this.determineIcon()
    }
  }
  get punten() {
    return this._punten
  }

  @Input() set round(value) {
    this._round = value
    if (value && this.team) {
      this.determineIcon()
    }
  }

  get round() {
    return this._round;
  }

  public icon: string;
  public iconColor: string;

  constructor() {
  }

  determineIcon() {
    if (this.punten > 0) {
      this.icon = 'checkmark-outline'
      this.iconColor = 'success'
    }
    // kan niet meer voor komen in deze ronde
    // this.round.Id === 3 => 
    // eliminated || halve finalist met active round 2 en !eliminated

    // this.round.Id === 2 =>
    // eliminiated || halve finalist met active round 3 en !eliminated

    else if ((this.team && this.team.isEliminated && parseInt(this.team.latestActiveRound) > parseInt(this.round)) ||
      (this.round === '3' && this.team && !this.team.isEliminated && (this.team.latestActiveRound === '2' || this.team.latestActiveRound === '1')) ||
      ((this.round === '1' || this.round === '2') && this.team && !this.team.isEliminated && (this.team.latestActiveRound === '3' || this.team.latestActiveRound === '2,5'))) {
      this.icon = 'close-outline';
      this.iconColor = 'danger'
      this.punten = 0
    } else {
      this.icon = 'help-outline'
      this.iconColor = 'medium';
    }
  }

}
