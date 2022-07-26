import { TestBed } from '@angular/core/testing';

import { MonitorGuard } from './monitor.guard';

describe('MonitorGuard', () => {
  let guard: MonitorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MonitorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
