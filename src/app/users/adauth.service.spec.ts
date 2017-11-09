import { TestBed, inject } from '@angular/core/testing';
import { Http } from '@angular/http';
import { ADAuthService } from './adauth.service';


import {MockHttp} from '../shared/MockStubs';

describe('ADAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ADAuthService,
        {provide: Http, useClass: MockHttp}
      ]
    });
  });


// TODO update to call login method and test resuling URL
  it('authURL should be equal to that set in the service', inject([ADAuthService], (service: ADAuthService) => {
  }));
});
