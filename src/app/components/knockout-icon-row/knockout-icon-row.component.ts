import {Component, Input, OnInit} from '@angular/core';
import {ITeam} from '../../models/poule.model';

@Component({
  selector: 'app-knockout-icon-row',
  templateUrl: './knockout-icon-row.component.html',
  styleUrls: ['./knockout-icon-row.component.scss'],
})
export class KnockoutIconRowComponent implements OnInit {

  // @Input() punten: number;
  // @Input() round: string;
  // @Input() isEliminated: boolean;
  // @Input() eliminationRound: string;
  @Input() eliminationState: string;
  
  public icon: string;
  public iconColor: string;

  constructor() {
  }

  ngOnInit() {
    console.log(this.eliminationState)
    if (this.eliminationState === 'qualified') {
      this.icon = 'checkmark-outline'
      this.iconColor = 'success'
    } else if (this.eliminationState === 'eliminated') {
      this.icon = 'close-outline';
      this.iconColor = 'danger'
    } else {
      this.icon = 'help-outline'
      this.iconColor = 'medium';
    }
  }

}
