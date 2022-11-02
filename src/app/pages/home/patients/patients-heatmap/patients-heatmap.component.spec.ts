import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsHeatmapComponent } from './patients-heatmap.component';

describe('PatientsHeatmapComponent', () => {
  let component: PatientsHeatmapComponent;
  let fixture: ComponentFixture<PatientsHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientsHeatmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientsHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
