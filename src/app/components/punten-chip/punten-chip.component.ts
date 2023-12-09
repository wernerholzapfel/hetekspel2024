import {Component, Input, OnInit} from '@angular/core';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-punten-chip',
  templateUrl: './punten-chip.component.html',
  styleUrls: ['./punten-chip.component.scss'],
})
export class PuntenChipComponent implements OnInit {

  @Input() points: number;
  @Input() deltaPoints: number;
  @Input() iconName: string;
  @Input() color = 'light';

  constructor() {
  }

  ngOnInit() {
  }

}
