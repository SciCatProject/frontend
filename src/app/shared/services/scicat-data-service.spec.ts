import { TestBed } from '@angular/core/testing';

import { ScicatDataService } from './scicat-data-service';

describe('ScicatDataServiceService', () => {
  let service: ScicatDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScicatDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
