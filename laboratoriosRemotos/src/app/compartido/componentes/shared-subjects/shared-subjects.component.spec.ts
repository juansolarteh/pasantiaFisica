import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSubjectsComponent } from './shared-subjects.component';

describe('SharedSubjectsComponent', () => {
  let component: SharedSubjectsComponent;
  let fixture: ComponentFixture<SharedSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedSubjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
