import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCareplanComponent } from './create-careplan.component';

describe('CreateCareplanComponent', () => {
  let component: CreateCareplanComponent;
  let fixture: ComponentFixture<CreateCareplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCareplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCareplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
