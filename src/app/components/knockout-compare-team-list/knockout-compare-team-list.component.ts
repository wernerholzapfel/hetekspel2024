import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-knockout-compare-team-list',
    templateUrl: './knockout-compare-team-list.component.html',
    styleUrls: ['./knockout-compare-team-list.component.scss'],
    standalone: false
})
export class KnockoutCompareTeamListComponent {
    @Input() teams: any[] = [];
    @Output() teamClick = new EventEmitter<string>();
}
