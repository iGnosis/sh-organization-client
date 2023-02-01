import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAccessComponent } from './users-access.component';

describe('UsersAccessComponent', () => {
  let component: UsersAccessComponent;
  let fixture: ComponentFixture<UsersAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
