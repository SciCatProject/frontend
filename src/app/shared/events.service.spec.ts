import {
  TestBed,
  fakeAsync,
  tick,
  discardPeriodicTasks,
  flushMicrotasks,
} from "@angular/core/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { EventsService } from "./events.service";
import { selectScicatToken } from "state-management/selectors/user.selectors";

class MockEventSource {
  static instances: MockEventSource[] = [];
  onopen: (() => void) | null = null;
  onmessage: ((e: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  closed = false;

  constructor(public url: string) {
    MockEventSource.instances.push(this);
  }
  close() {
    this.closed = true;
  }
  static get last() {
    return this.instances[this.instances.length - 1];
  }
  static get count() {
    return this.instances.length;
  }
}

describe("EventsService: token expiry", () => {
  let service: EventsService;
  let store: MockStore;
  let fetchSpy: jasmine.Spy;

  const ticketOk = (ticket: string) =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ ticket }),
    } as Response);

  const ticketRejected = () =>
    Promise.resolve({ ok: false, status: 401 } as Response);

  /** Emits a new token from the store, without settling anything. */
  const putToken = (token: string) => {
    store.overrideSelector(selectScicatToken, token);
    store.refreshState();
  };

  /** Emits a new token and lets the ticket fetch it triggers settle. */
  const setToken = (token: string) => {
    putToken(token);
    tick();
  };

  /** Waits out the 5s retry delay and the ticket fetch that follows. */
  const waitForRetry = () => {
    tick(5000);
    flushMicrotasks();
  };

  beforeEach(() => {
    MockEventSource.instances = [];
    (window as any).EventSource = MockEventSource;
    fetchSpy = spyOn(window, "fetch");

    TestBed.configureTestingModule({
      providers: [
        EventsService,
        provideMockStore({
          selectors: [{ selector: selectScicatToken, value: null }],
        }),
      ],
    });

    service = TestBed.inject(EventsService);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => service?.disconnect());

  it("retries the ticket request when the token is rejected", fakeAsync(() => {
    fetchSpy.and.returnValue(ticketRejected());

    service.connect();
    setToken("expired");

    expect(fetchSpy.calls.count()).toBe(1);
    expect(MockEventSource.count).toBe(0);

    waitForRetry();

    expect(fetchSpy.calls.count()).toBe(2);
    discardPeriodicTasks();
  }));

  it("reports an error while the ticket keeps being rejected", fakeAsync(() => {
    fetchSpy.and.returnValue(ticketRejected());
    let inError: boolean;
    service.connectionError$.subscribe((v) => (inError = v));

    service.connect();
    setToken("expired");
    waitForRetry();

    expect(inError).toBeTrue();
    discardPeriodicTasks();
  }));

  it("recovers when a fresh token arrives", fakeAsync(() => {
    fetchSpy.and.returnValue(ticketRejected());
    let inError: boolean;
    service.connectionError$.subscribe((v) => (inError = v));

    service.connect();
    setToken("expired");
    expect(MockEventSource.count).toBe(0);

    fetchSpy.and.returnValue(ticketOk("tkt-fresh"));
    putToken("fresh");

    waitForRetry();

    expect(MockEventSource.last.url).toBe(
      "/api/v3/events/stream?ticket=tkt-fresh",
    );

    MockEventSource.last.onopen();
    expect(inError).toBeFalse();
  }));

  it("mints a new ticket after the stream drops", fakeAsync(() => {
    fetchSpy.and.returnValues(ticketOk("tkt-1"), ticketOk("tkt-2"));

    service.connect();
    setToken("good");

    const dropped = MockEventSource.last;
    expect(dropped.url).toBe("/api/v3/events/stream?ticket=tkt-1");

    dropped.onerror();
    expect(dropped.closed).toBeTrue();

    waitForRetry();

    expect(MockEventSource.count).toBe(2);
    expect(MockEventSource.last.url).toBe("/api/v3/events/stream?ticket=tkt-2");
    discardPeriodicTasks();
  }));

  it("closes the old stream when it drops", fakeAsync(() => {
    fetchSpy.and.returnValues(ticketOk("tkt-1"), ticketOk("tkt-2"));

    service.connect();
    setToken("good");

    const dropped = MockEventSource.last;
    dropped.onerror();

    expect(dropped.closed).toBeTrue();
    discardPeriodicTasks();
  }));

  it("delivers messages once connected", fakeAsync(() => {
    fetchSpy.and.returnValue(ticketOk("tkt-1"));
    const ids: string[] = [];
    service.latestUpdatedId$.subscribe((id) => ids.push(id));

    service.connect();
    setToken("good");

    MockEventSource.last.onmessage({
      data: JSON.stringify({ data: { _id: "ds-7" } }),
    });

    expect(ids).toEqual(["ds-7"]);
  }));

  it("stops reconnecting after disconnect", fakeAsync(() => {
    fetchSpy.and.returnValue(ticketOk("tkt-1"));

    service.connect();
    setToken("good");

    MockEventSource.last.onerror();
    service.disconnect();
    waitForRetry();

    expect(fetchSpy.calls.count()).toBe(1);
  }));

  it("clears the error flag on disconnect", fakeAsync(() => {
    fetchSpy.and.returnValue(ticketRejected());
    let inError: boolean;
    service.connectionError$.subscribe((v) => (inError = v));

    service.connect();
    setToken("expired");
    waitForRetry();
    expect(inError).toBeTrue();

    service.disconnect();

    expect(inError).toBeFalse();
  }));
});
