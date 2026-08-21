import { Component, OnDestroy } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export const DEELNEMER_LAST_TAB_KEY = 'deelnemer_last_tab';

@Component({
    selector: 'app-deelnemer',
    templateUrl: './deelnemer.page.html',
    styleUrls: ['./deelnemer.page.scss'],
    standalone: false
})
export class DeelnemerPage implements OnDestroy {

    toolbarAction: { icon: string; handler: () => void } | null = null;
    private unsubscribe = new Subject<void>();

    constructor(private uiService: UiService) {
        this.uiService.tabToolbarAction$
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(action => { this.toolbarAction = action; });
    }

    onTabChange(event: { tab: string }) {
        localStorage.setItem(DEELNEMER_LAST_TAB_KEY, event.tab);
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }
    
}
