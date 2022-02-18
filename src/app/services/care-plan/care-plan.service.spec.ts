import { TestBed } from '@angular/core/testing';

import { CarePlanService } from './care-plan.service';

describe('CarePlanService', () => {
  let service: CarePlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarePlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
