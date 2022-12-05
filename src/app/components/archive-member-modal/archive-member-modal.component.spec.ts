import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveMemberModalComponent } from './archive-member-modal.component';

describe('ArchiveMemberModalComponent', () => {
  let component: ArchiveMemberModalComponent;
  let fixture: ComponentFixture<ArchiveMemberModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveMemberModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveMemberModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
