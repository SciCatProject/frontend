import {
  TestBed,
} from "@angular/core/testing";
import { AppConfigModule, OAuth2Endpoint } from "app-config.module";
import { environment } from "../environments/environment";

describe("OAuth2Endpoint", () =>{


  const endpoints: OAuth2Endpoint[] = [];
  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [AppConfigModule],
    });
  });
  
  it("initialized", () => {
    const module = TestBed.inject(AppConfigModule);
    expect(module).toBeTruthy();
  });

  describe("initial environment", () =>{
    
    it("initialized", () => {
      expect(environment.loginFormEnabled).toBeTruthy();
      expect(environment.oAuth2Endpoints.length).toEqual(0);
    });
  });
  

});

