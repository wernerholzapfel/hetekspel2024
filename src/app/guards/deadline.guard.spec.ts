import {TestBed} from '@angular/core/testing';

import {DeadlineGuard} from './deadline.guard';

describe('DeadlineGuard', () => {
  let guard: DeadlineGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DeadlineGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
