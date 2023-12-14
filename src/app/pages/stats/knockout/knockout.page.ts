import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';

@Component({
    selector: 'app-poule',
    templateUrl: './knockout.page.html',
    styleUrls: ['./knockout.page.scss'],
})
export class KnockoutPage {
    knockoutStats: any[];
    unsubscribe: Subject<void>


    constructor(private db: AngularFireDatabase,
        private router: Router) {
    }

    ionViewWillEnter() {
        this.unsubscribe = new Subject<void>();
        this.db.list<any>(`ek2024/stats/knockout`)
            .valueChanges()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(knockoutStats => {
                this.knockoutStats = knockoutStats;
            });
    }

    openKoTeam(team, round) {
        this.router.navigate([`stats/knockout/round/${round}/team/${team}`], { replaceUrl: false });
    }

    ionViewDidLeave(): void {
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }

}
