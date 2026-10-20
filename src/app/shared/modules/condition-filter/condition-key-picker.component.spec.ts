import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Observable, Subject, of } from "rxjs";
import { MetadataKey } from "state-management/models";
import { ConditionFilterModule } from "./condition-filter.module";
import { ConditionKeyPickerComponent } from "./condition-key-picker.component";
import { KEY_PAGE_SIZE } from "./condition-filter.keys";

describe("ConditionKeyPickerComponent", () => {
  let component: ConditionKeyPickerComponent;
  let fixture: ComponentFixture<ConditionKeyPickerComponent>;
  let source: jasmine.Spy<
    (term: string, skip: number, limit: number) => Observable<MetadataKey[]>
  >;
  let changed: jasmine.Spy;

  const page = (from: number, count = KEY_PAGE_SIZE): MetadataKey[] =>
    Array.from({ length: count }, (_, index) => ({
      key: `key${from + index}`,
    }));

  const keysOf = () => component.options().map(({ key }) => key);

  beforeEach(() => {
    source = jasmine
      .createSpy("source")
      .and.callFake((_term: string, skip: number) => of(page(skip)));
    changed = jasmine.createSpy("keyChange");

    TestBed.configureTestingModule({
      imports: [ConditionFilterModule, NoopAnimationsModule],
    });

    fixture = TestBed.createComponent(ConditionKeyPickerComponent);
    component = fixture.componentInstance;
    component.source = source;
    component.keyChange.subscribe(changed);
    fixture.detectChanges();
  });

  it("should load the first page of keys when the list opens", fakeAsync(() => {
    component.onOpened();
    tick();

    expect(source).toHaveBeenCalledOnceWith("", 0, KEY_PAGE_SIZE);
    expect(component.options().length).toBe(KEY_PAGE_SIZE);
    expect(component.hasMore()).toBeTrue();
  }));

  it("should not load the keys again when the list opens a second time", fakeAsync(() => {
    component.onOpened();
    component.onOpened();
    tick();

    expect(source).toHaveBeenCalledTimes(1);
  }));

  it("should add the next page when asked to load more", fakeAsync(() => {
    component.onOpened();
    tick();

    component.loadMore();

    expect(source).toHaveBeenCalledWith("", KEY_PAGE_SIZE, KEY_PAGE_SIZE);
    expect(keysOf().length).toBe(KEY_PAGE_SIZE * 2);
    expect(new Set(keysOf()).size).toBe(KEY_PAGE_SIZE * 2);
  }));

  it("should only offer to load more while there are more keys", fakeAsync(() => {
    const loadMoreRow = () =>
      document.querySelector("[data-cy=condition-key-load-more]");
    component.onOpened();
    tick();
    fixture.detectChanges();
    expect(component.hasMore()).toBeTrue();

    source.and.callFake((_term, skip) => of(page(skip, 3)));
    component.loadMore();
    fixture.detectChanges();

    expect(component.hasMore()).toBeFalse();
    expect(loadMoreRow()).toBeNull();
  }));

  it("should not load more when the last page was not full", fakeAsync(() => {
    source.and.callFake((_term, skip) => of(page(skip, 3)));
    component.onOpened();
    tick();

    component.loadMore();

    expect(source).toHaveBeenCalledTimes(1);
  }));

  it("should not ask for another page while one is loading", fakeAsync(() => {
    const pending = new Subject<MetadataKey[]>();
    source.and.returnValue(pending);
    component.onOpened();
    tick();

    expect(component.loading()).toBeTrue();
    component.loadMore();
    expect(source).toHaveBeenCalledTimes(1);

    pending.next(page(0));
    expect(component.loading()).toBeFalse();
  }));

  it("should search once typing stops and tell what was typed", fakeAsync(() => {
    component.onInput("te");
    component.onInput("temp");
    expect(changed.calls.allArgs()).toEqual([["te"], ["temp"]]);
    expect(source).not.toHaveBeenCalled();

    tick(250);

    expect(source).toHaveBeenCalledOnceWith("temp", 0, KEY_PAGE_SIZE);
    flush();
  }));

  it("should list all keys again when the list opens after a search", fakeAsync(() => {
    component.onInput("temp");
    tick(250);
    component.onOpened();
    tick();

    expect(source.calls.allArgs().map(([term]) => term)).toEqual(["temp", ""]);
  }));

  it("should replace the keys by the result of a search", fakeAsync(() => {
    component.onOpened();
    tick();
    source.and.returnValue(of([{ key: "temperature" }]));

    component.onInput("temp");
    tick(250);

    expect(keysOf()).toEqual(["temperature"]);
  }));

  it("should list no keys when loading them fails", fakeAsync(() => {
    source.and.returnValue(
      new Observable<MetadataKey[]>((subscriber) =>
        subscriber.error(new Error("failed")),
      ),
    );
    component.onOpened();
    tick();

    expect(component.options()).toEqual([]);
    expect(component.loading()).toBeFalse();
  }));

  it("should tell which key was selected", () => {
    component.onSelected("pressure");

    expect(changed).toHaveBeenCalledOnceWith("pressure");
  });
});
