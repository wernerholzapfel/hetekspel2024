import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {KnockoutTeamHeaderComponent} from './knockout-team-header.component';

describe('KnockoutTeamHeaderComponent', () => {
  let component: KnockoutTeamHeaderComponent;
  let fixture: ComponentFixture<KnockoutTeamHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [KnockoutTeamHeaderComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KnockoutTeamHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
