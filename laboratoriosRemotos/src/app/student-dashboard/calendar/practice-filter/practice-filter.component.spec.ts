import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeFilterComponent } from './practice-filter.component';

describe('PracticeFilterComponent', () => {
  let component: PracticeFilterComponent;
  let fixture: ComponentFixture<PracticeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PracticeFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
