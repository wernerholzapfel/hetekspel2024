import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonContent } from '@ionic/angular';
import { combineLatest } from 'rxjs';
import { IKnockout } from 'src/app/models/knockout.model';
import { IMatch, } from 'src/app/models/poule.model';
import { KnockoutService } from 'src/app/services/knockout.service';
import { MatchService } from 'src/app/services/match.service';

@Component({
    selector: 'app-speelschema',
    templateUrl: './speelschema.page.html',
    styleUrls: ['./speelschema.page.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpeelschemaPage implements OnInit {

  @ViewChild(IonContent) content!: IonContent;

  constructor(
    private matchService: MatchService,
    private knockoutService: KnockoutService,
    private actionSheetCtrl: ActionSheetController,
    private cdRef: ChangeDetectorRef
  ) { }

  matches: IMatch[] = [];
  public knockout: IKnockout[] = [];
  sortedMatches: IMatch[] = [];
  selectedSegment: 'matches' | 'knockout' = 'matches';
  sortOrder: 'datum' | 'poule' = 'datum';

  private readonly STORAGE_SEGMENT = 'speelschema_segment';
  private readonly STORAGE_SORT = 'speelschema_sort';

  onSegmentChange(event: CustomEvent) {
    this.selectedSegment = event.detail.value;
    localStorage.setItem(this.STORAGE_SEGMENT, this.selectedSegment);
    this.cdRef.markForCheck();
  }

  ionViewWillEnter() {
    const savedSegment = localStorage.getItem(this.STORAGE_SEGMENT) as 'matches' | 'knockout' | null;
    const savedSort = localStorage.getItem(this.STORAGE_SORT) as 'datum' | 'poule' | null;
    if (savedSegment) this.selectedSegment = savedSegment;
    if (savedSort) this.sortOrder = savedSort;

    combineLatest([
      this.matchService.getMatches(),
      this.knockoutService.getOriginalSpeelschema()
    ]).subscribe(([matches, speelschema]) => {
      this.matches = matches;
      this.knockout = speelschema;
      this.computeSortedMatches();
      if (!savedSegment) this.scrollToLastPlayed();
      this.cdRef.markForCheck();
    });
  }

  private computeSortedMatches(): void {
    if (this.sortOrder === 'poule') {
      this.sortedMatches = [...this.matches].sort((a, b) =>
        a.poule.localeCompare(b.poule) || a.date.localeCompare(b.date)
      );
    } else {
      this.sortedMatches = [...this.matches].sort((a, b) => a.date.localeCompare(b.date));
    }
  }

  private scrollToLastPlayed(): void {
    const firstUnplayedMatch = this.matches?.findIndex(m => m.homeScore == null);

    if (firstUnplayedMatch !== -1) {
      this.selectedSegment = 'matches';
      const index = firstUnplayedMatch > 0 ? firstUnplayedMatch - 1 : -1;
      if (index < 0) return;
      setTimeout(() => {
        const el = document.getElementById(`match-${index}`);
        if (el && this.content) {
          this.content.scrollToPoint(0, el.offsetTop, 300);
        }
      }, 100);
    } else {
      this.selectedSegment = 'knockout';
      const firstUnplayedKnockout = this.knockout?.findIndex(m => m.homeScore == null);
      const index = firstUnplayedKnockout > 0 ? firstUnplayedKnockout - 1 : this.knockout.length - 1;
      setTimeout(() => {
        const el = document.getElementById(`knockout-${index}`);
        if (el && this.content) {
          this.content.scrollToPoint(0, el.offsetTop, 300);
        }
      }, 100);
    }
  }

  async openSortSheet() {
    const sheet = await this.actionSheetCtrl.create({
      header: 'Sortering',
      buttons: [
        {
          text: 'Op datum',
          icon: this.sortOrder === 'datum' ? 'checkmark-outline' : 'calendar-outline',
          handler: () => {
            this.sortOrder = 'datum';
            localStorage.setItem(this.STORAGE_SORT, this.sortOrder);
            this.computeSortedMatches();
            this.cdRef.markForCheck();
          }
        },
        {
          text: 'Op poule',
          icon: this.sortOrder === 'poule' ? 'checkmark-outline' : 'grid-outline',
          handler: () => {
            this.sortOrder = 'poule';
            localStorage.setItem(this.STORAGE_SORT, this.sortOrder);
            this.computeSortedMatches();
            this.cdRef.markForCheck();
          }
        },
        { text: 'Annuleren', role: 'cancel' }
      ]
    });
    await sheet.present();
  }

  ngOnInit() {
  }

}
