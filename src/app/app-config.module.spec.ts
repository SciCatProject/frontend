import {
  TestBed,
} from "@angular/core/testing";
import {APP_DI_CONFIG, AppConfigModule, OAuth2Endpoint } from "app-config.module";
import { environment } from "../environments/environment";


// see https://testing-angular.com/testing-modules/
describe("AppConfigModule", () =>{

  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [AppConfigModule],
    });
  });
  
  it("initializes", () => {
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


  describe("APP_DI_CONFIG", () =>{
    
    it("initialized", () => {
      expect(APP_DI_CONFIG.loginFormEnabled).toBeTruthy();
      expect(APP_DI_CONFIG.oAuth2Endpoints.length).toEqual(0);
    });
  });
});

