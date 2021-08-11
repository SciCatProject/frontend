import {
  TestBed,
} from "@angular/core/testing";
import {AppConfigModule, OAuth2Endpoint } from "app-config.module";
import { environment } from "../environments/environment";

describe("app config", () =>{


 
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
  
  describe("oauth endpoint", () => {

    const endpoint: OAuth2Endpoint = {
      displayText: "test",
      authURL: "foo/bar"
    };

    it("is valid", () => {
      expect(endpoint.displayText).toEqual("test");
      expect(endpoint.authURL).toEqual("foo/bar");
    });

  });

});

