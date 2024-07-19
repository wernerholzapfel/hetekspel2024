import { Component, Input, OnInit } from '@angular/core';
import { ITeam } from '../../models/poule.model';

@Component({
  selector: 'app-knockout-team-header',
  templateUrl: './knockout-team-header.component.html',
  styleUrls: ['./knockout-team-header.component.scss'],
})
export class KnockoutTeamHeaderComponent {

  private _team: any; //todo
  private _punten: number;
  private _round: string;
  private _count: string;


  @Input() set team(value) {
    this._team = value;
    if (value && this.round) {
      this.determineIcon()
    }
  }

  get team() {
    return this._team;
  }

  @Input() set count(value) {
    this._count = value;
  }

  get count() {
    return this._count;
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
    if (this.team.eliminationState === 'qualified') {
      this.icon = 'checkmark-outline'
      this.iconColor = 'success'
    }
    // kan niet meer voor komen in deze ronde
    // this.round.Id === 3 => 
    // eliminated || halve finalist met active round 2 en !eliminated

    // this.round.Id === 2 =>
    // eliminiated || halve finalist met active round 3 en !eliminated

    else if (this.team.eliminationState === 'eliminated') {
      this.icon = 'close-outline';
      this.iconColor = 'danger'
      this.punten = 0
    } else {
      this.icon = 'help-outline'
      this.iconColor = 'medium';
    }
  }

}
