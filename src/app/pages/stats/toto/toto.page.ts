import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {Router} from '@angular/router';

@Component({
    selector: 'app-knockout',
    templateUrl: './toto.page.html',
    styleUrls: ['./toto.page.scss'],
})
export class TotoPage {

    totoStats: any[];
    unsubscribe: Subject<void>

    constructor(private db: AngularFireDatabase,
                private router: Router) {
    }

    ionViewWillEnter() {
        this.unsubscribe = new Subject<void>();
        this.db.list<any>(`stats/toto`)
            .valueChanges()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(totoStats => {
                this.totoStats = totoStats;
            });
    }

    openMatch(matchId: string) {
        this.router.navigate([`match/${matchId}`], {replaceUrl: false});
    }

    openMatchWithTotoFilter(matchId: string, totoId) {
        this.router.navigate([`match/${matchId}/toto/${totoId}`], {replaceUrl: false});
    }

    ionViewDidLeave(): void {
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }
}
