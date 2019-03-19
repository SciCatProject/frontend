import { TestBed } from '@angular/core/testing';

import { LogbookService } from './logbook.service';

describe('LogbookService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogbookService = TestBed.get(LogbookService);
    expect(service).toBeTruthy();
  });
});
