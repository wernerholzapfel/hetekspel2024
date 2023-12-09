import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UiService} from '../../services/ui.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-menu-toolbar',
    templateUrl: './menu-toolbar.component.html',
    styleUrls: ['./menu-toolbar.component.scss'],
})
export class MenuToolbarComponent implements OnInit {

    @Input() rightCornerIcon: string;
    @Input() iconColor = '';
    @Output() emitIconClick = new EventEmitter<any>();

    constructor(public uiService: UiService, private router: Router) {
    }

    ngOnInit() {
    }

    openHome() {
        this.router.navigate([`home`], {replaceUrl: false});
    }

    iconClick(event$) {
        this.emitIconClick.emit(event$);
    }
}
