import { Component, Input, OnInit } from '@angular/core';
import { ITeam } from '../../models/poule.model';

@Component({
  selector: 'app-knockout-team-header',
  templateUrl: './knockout-team-header.component.html',
  styleUrls: ['./knockout-team-header.component.scss'],
  standalone: false
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
    if (value != null) {
      this._punten = value;
      this.determineIcon();
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
    console.log(this.team)
    if (this.team.eliminationState === 'qualified') {
      this.icon = 'checkmark-outline'
      this.iconColor = 'success'
    }
    else if (this.team.eliminationState === 'eliminated' || this.team.isEliminated) {
      this.icon = 'close-outline';
      this.iconColor = 'danger'
      this._punten = 0
    }
    else if (!this.team.isEliminated && this.team.eliminationRound === 1) {
      this.icon = 'close-outline';
      this.icon = 'checkmark-outline'
      this.iconColor = 'success'
    } 
      else if (!this.team.isEliminated && this.team.eliminationRound === 1.5) {
      this.icon = 'close-outline';
      this.icon = 'checkmark-outline'
      this.iconColor = 'success'
    } else {
      this.icon = 'help-outline'
      this.iconColor = 'medium';
    }
  }

}
