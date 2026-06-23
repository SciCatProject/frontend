import { Injectable, NgZone } from "@angular/core";
import { Store } from "@ngrx/store";
import { fetchScicatTokenAction } from "state-management/actions/user.actions";
import { selectScicatToken } from "state-management/selectors/user.selectors";
import {
  distinctUntilChanged,
  EMPTY,
  map,
  Observable,
  Subject,
  Subscription,
  switchMap,
} from "rxjs";

@Injectable({ providedIn: "root" })
export class EventsService {
  private connectionSub: Subscription | null = null;
  private messageSubject = new Subject<Record<string, unknown>>();

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
    return new Observable<Record<string, unknown>>((observer) => {
      const es = new EventSource(`/api/v3/events/stream?token=${token}`);

      es.onmessage = (event) => {
        this.ngZone.run(() => observer.next(JSON.parse(event.data)));
      };

      es.onerror = () => {
        es.close();
        observer.complete();
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
      )
      .subscribe((msg) => this.messageSubject.next(msg));
  }

  disconnect() {
    this.connectionSub?.unsubscribe();
    this.connectionSub = null;
  }
}
