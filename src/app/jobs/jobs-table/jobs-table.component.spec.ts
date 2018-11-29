import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material";
import { JobsTableComponent } from "./jobs-table.component";
import { Store, StoreModule } from "@ngrx/store";
import { ConfigService } from "shared/services/config.service";
import {
  MockConfigService,
  MockHttp,
  MockJobApi,
  MockRouter,
  MockStore,
  MockUserApi,
  MockLoginService
} from "shared/MockStubs";
import { JobApi, UserApi } from "shared/sdk/services";
import { LoginService } from "users/login.service";


describe("JobsTableComponent", () => {
  let component: JobsTableComponent;
  let fixture: ComponentFixture<JobsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatTableModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot({})
      ],
      declarations: [JobsTableComponent]
    });
    TestBed.overrideComponent(JobsTableComponent, {
      set: {
        providers: [
          { provide: LoginService, useClass: MockLoginService },
          { provide: JobApi, useClass: MockJobApi },
          { provide: UserApi, useClass: MockUserApi },
          { provide: HttpClient, useClass: MockHttp },
          { provide: Router, useClass: MockRouter },
          { provide: ConfigService, useClass: MockConfigService },
          { provide: Store, useClass: MockStore }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
