import { TestBed, inject } from '@angular/core/testing';

import { ConfigService } from './config.service';
import { Http, HttpModule } from '@angular/http';

describe('ConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigService, { provide: Http, useClass: HttpModule }]
    });
  });

  it('should ...', inject([ConfigService], (service: ConfigService) => {
    expect(service).toBeTruthy();
  }));
});
