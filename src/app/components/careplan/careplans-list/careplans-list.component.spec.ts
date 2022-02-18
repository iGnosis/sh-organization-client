import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareplansListComponent } from './careplans-list.component';

describe('CareplansListComponent', () => {
  let component: CareplansListComponent;
  let fixture: ComponentFixture<CareplansListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareplansListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareplansListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
