import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportFabComponent } from './support-fab.component';

describe('SupportFabComponent', () => {
  let component: SupportFabComponent;
  let fixture: ComponentFixture<SupportFabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportFabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportFabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
