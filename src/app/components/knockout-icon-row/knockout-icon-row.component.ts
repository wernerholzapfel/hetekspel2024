import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
    selector: 'app-knockout-icon-row',
    templateUrl: './knockout-icon-row.component.html',
    styleUrls: ['./knockout-icon-row.component.scss'],
    standalone: false
})
export class KnockoutIconRowComponent implements OnChanges {

  @Input() eliminationState: string = '';

  public icon: string = 'help-outline';
  public iconColor: string = 'medium';

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['eliminationState']) {
      if (this.eliminationState === 'qualified') {
        this.icon = 'checkmark-outline';
        this.iconColor = 'success';
      } else if (this.eliminationState === 'eliminated') {
        this.icon = 'close-outline';
        this.iconColor = 'danger';
      } else {
        this.icon = 'help-outline';
        this.iconColor = 'medium';
      }
    }
  }

}
