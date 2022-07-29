import { TestBed } from '@angular/core/testing';

import { CalendarStudentResolver } from './calendar-student.resolver';

describe('CalendarStudentResolver', () => {
  let resolver: CalendarStudentResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CalendarStudentResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
