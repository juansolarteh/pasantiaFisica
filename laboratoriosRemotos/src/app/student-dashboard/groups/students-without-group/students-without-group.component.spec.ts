import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsWithoutGroupComponent } from './students-without-group.component';

describe('StudentsWithoutGroupComponent', () => {
  let component: StudentsWithoutGroupComponent;
  let fixture: ComponentFixture<StudentsWithoutGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentsWithoutGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsWithoutGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
