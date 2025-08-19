import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { FullTextSearchBarComponent } from "./full-text-search-bar.component";
import { StoreModule } from "@ngrx/store";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { By } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

describe("FullTextSearchBarComponent", () => {
  let component: FullTextSearchBarComponent;
  let fixture: ComponentFixture<FullTextSearchBarComponent>;
  let store: MockStore;

  const initialState = { datasets: { searchTerms: [] } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FullTextSearchBarComponent],
      imports: [
        StoreModule.forRoot({}),
        CommonModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        MatButtonModule,
      ],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullTextSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize searchTerm with prefilledValue on ngOnInit", () => {
    component.prefilledValue = "initial value";
    component.ngOnInit();
    expect(component.searchTerm).toBe("initial value");
  });

  it("should emit textChange event when onSearchTermChange is called", fakeAsync(() => {
    const term = "test term";
    spyOn(component.textChange, "emit");
    component.ngOnInit();
    component.onSearchTermChange(term);
    tick(200);
    expect(component.textChange.emit).toHaveBeenCalledWith(term);
  }));

  it("should emit searchAction event when onSearch is called", fakeAsync(() => {
    spyOn(component.searchAction, "emit");
    component.ngOnInit();
    component.onSearch();
    tick(250);
    expect(component.searchAction.emit).toHaveBeenCalled();
  }));

  it("should clear searchTerm and emit events when onClear is called", fakeAsync(() => {
    spyOn(component.textChange, "emit");
    spyOn(component.searchAction, "emit");
    component.searchTerm = "some value";
    component.ngOnInit();
    component.onClear();
    tick(450);
    expect(component.searchTerm).toBe("");
    expect(component.textChange.emit).toHaveBeenCalledWith(undefined);
    expect(component.searchAction.emit).toHaveBeenCalled();
  }));

  it("should update searchTerm when input value changes", () => {
    const inputElement = fixture.debugElement.query(By.css("input"));
    inputElement.nativeElement.value = "new search term";
    inputElement.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(component.searchTerm).toBe("new search term");
  });

  it("should use the provided placeholder text", () => {
    const placeholderText = "Custom Placeholder";
    component.placeholder = placeholderText;
    fixture.detectChanges();
    const inputElement = fixture.debugElement.query(By.css("input"));
    expect(inputElement.nativeElement.getAttribute("placeholder")).toBe(
      placeholderText,
    );
  });
});
