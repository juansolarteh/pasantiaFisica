import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeSubjectCardComponent } from './code-subject-card.component';

describe('CodeSubjectCardComponent', () => {
  let component: CodeSubjectCardComponent;
  let fixture: ComponentFixture<CodeSubjectCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeSubjectCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeSubjectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
