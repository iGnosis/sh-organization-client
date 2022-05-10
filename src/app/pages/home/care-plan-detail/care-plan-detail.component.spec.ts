import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarePlanDetailComponent } from './care-plan-detail.component';

describe('CarePlanComponent', () => {
  let component: CarePlanDetailComponent;
  let fixture: ComponentFixture<CarePlanDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarePlanDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarePlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
