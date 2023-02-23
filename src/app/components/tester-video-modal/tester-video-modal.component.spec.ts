import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesterVideoModalComponent } from './tester-video-modal.component';

describe('TesterVideoModalComponent', () => {
  let component: TesterVideoModalComponent;
  let fixture: ComponentFixture<TesterVideoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TesterVideoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TesterVideoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
