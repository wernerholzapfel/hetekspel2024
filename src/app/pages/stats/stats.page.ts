import {Component, OnDestroy, OnInit} from '@angular/core';
import {UiService} from '../../services/ui.service';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.page.html',
    styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit, OnDestroy {

    unsubscribe = new Subject<void>();

    constructor(private uiService: UiService,
                private route: ActivatedRoute) {
    }


    ngOnInit() {
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }
}
