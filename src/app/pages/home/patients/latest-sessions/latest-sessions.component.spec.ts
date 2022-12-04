import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestSessionsComponent } from './latest-sessions.component';

describe('LatestSessionsComponent', () => {
  let component: LatestSessionsComponent;
  let fixture: ComponentFixture<LatestSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatestSessionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
