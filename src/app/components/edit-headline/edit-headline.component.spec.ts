import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditHeadlineComponent} from './edit-headline.component';

describe('EditHeadlineComponent', () => {
  let component: EditHeadlineComponent;
  let fixture: ComponentFixture<EditHeadlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditHeadlineComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHeadlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
