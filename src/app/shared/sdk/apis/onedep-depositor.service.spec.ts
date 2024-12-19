import { TestBed } from '@angular/core/testing';

import { OnedepDepositorService } from './onedep-depositor.service';

describe('OnedepDepositorService', () => {
  let service: OnedepDepositorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnedepDepositorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
