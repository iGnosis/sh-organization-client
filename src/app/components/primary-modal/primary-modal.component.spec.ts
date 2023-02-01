import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryModalComponent } from './primary-modal.component';

describe('PrimaryModalComponent', () => {
  let component: PrimaryModalComponent;
  let fixture: ComponentFixture<PrimaryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
