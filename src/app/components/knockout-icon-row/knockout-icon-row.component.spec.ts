import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {KnockoutIconRowComponent} from './knockout-icon-row.component';

describe('KnockoutIconRowComponent', () => {
  let component: KnockoutIconRowComponent;
  let fixture: ComponentFixture<KnockoutIconRowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [KnockoutIconRowComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KnockoutIconRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
