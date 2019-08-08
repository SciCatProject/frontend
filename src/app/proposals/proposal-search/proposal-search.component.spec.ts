import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProposalSearchComponent } from "./proposal-search.component";
import { Store } from "@ngrx/store";
import { MockStore } from "shared/MockStubs";
import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule, MatInputModule, MatCardModule } from "@angular/material";

describe("ProposalSearchComponent", () => {
  let component: ProposalSearchComponent;
  let fixture: ComponentFixture<ProposalSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProposalSearchComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        ReactiveFormsModule
      ]
    });
    TestBed.overrideComponent(ProposalSearchComponent,  {
      set: {
        providers: [{ provide: Store, useClass: MockStore }]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
