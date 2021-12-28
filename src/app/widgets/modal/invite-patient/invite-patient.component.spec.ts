import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitePatientComponent } from './invite-patient.component';

describe('InvitePatientComponent', () => {
  let component: InvitePatientComponent;
  let fixture: ComponentFixture<InvitePatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitePatientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
