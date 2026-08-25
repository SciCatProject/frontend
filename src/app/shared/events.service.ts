import { Injectable, NgZone } from "@angular/core";
import { Store } from "@ngrx/store";
import { fetchScicatTokenAction } from "state-management/actions/user.actions";
import { selectScicatToken } from "state-management/selectors/user.selectors";
import {
  BehaviorSubject,
  distinctUntilChanged,
  EMPTY,
  from,
  map,
  Observable,
  retry,
  Subject,
  Subscription,
  switchMap,
  throwError,
  timer,
} from "rxjs";

@Injectable({ providedIn: "root" })
export class EventsService {
  private static readonly MAX_RETRIES = 10;
  private connectionSub: Subscription | null = null;
  private messageSubject = new Subject<Record<string, unknown>>();
  private connectionErrorSubject = new BehaviorSubject<boolean>(false);

  connectionError$ = this.connectionErrorSubject.asObservable();

  message$ = this.messageSubject.asObservable();

  latestUpdatedId$ = this.messageSubject.pipe(
    map((m) => (m["data"] as { _id: string })._id),
  );

  constructor(
    private ngZone: NgZone,
    private store: Store,
  ) {}

  private createEventStream(
    token: string,
  ): Observable<Record<string, unknown>> {
    // The stream route no longer accepts the session token — mint a
    // short-lived ticket over the normal header-authenticated call first.
    return from(
      fetch("/api/v3/events/ticket", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => {
        if (!r.ok) throw new Error(`ticket request failed: ${r.status}`);
        return r.json() as Promise<{ ticket: string }>;
      }),
    ).pipe(switchMap(({ ticket }) => this.openStream(ticket)));
  }

  private openStream(ticket: string): Observable<Record<string, unknown>> {
    return new Observable<Record<string, unknown>>((observer) => {
      const es = new EventSource(`/api/v3/events/stream?ticket=${ticket}`);

      es.onopen = () =>
        this.ngZone.run(() => this.connectionErrorSubject.next(false));

      es.onmessage = (event) =>
        this.ngZone.run(() => observer.next(JSON.parse(event.data)));

      es.onerror = () => {
        es.close();
        this.ngZone.run(() => observer.error(new Error("event stream closed")));
      };

      return () => es.close();
    });
  }

  connect() {
    if (this.connectionSub) return;

    this.store.dispatch(fetchScicatTokenAction());

    this.connectionSub = this.store
      .select(selectScicatToken)
      .pipe(
        distinctUntilChanged(),
        switchMap((token) => (token ? this.createEventStream(token) : EMPTY)),
        retry({
          delay: (error, retryCount) => {
            this.ngZone.run(() => this.connectionErrorSubject.next(true));
            if (retryCount > EventsService.MAX_RETRIES) {
              return throwError(() => error);
            }
            return timer(5000);
          },
          resetOnSuccess: true,
        }),
      )
      .subscribe({
        next: (msg) => this.messageSubject.next(msg),
        error: () => {
          this.ngZone.run(() => this.connectionErrorSubject.next(true));
          this.connectionSub = null;
        },
      });
  }

  disconnect() {
    this.connectionSub?.unsubscribe();
    this.connectionSub = null;
    this.connectionErrorSubject.next(false);
  }
}
