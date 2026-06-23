import { Injectable, NgZone } from "@angular/core";
import { Store } from "@ngrx/store";
import { fetchScicatTokenAction } from "state-management/actions/user.actions";
import { selectUserSettingsPageViewModel } from "state-management/selectors/user.selectors";
import {
  distinctUntilChanged,
  map,
  startWith,
  Subject,
  Subscription,
  switchMap,
  timer,
} from "rxjs";

@Injectable({ providedIn: "root" })
export class EventsService {
  private eventSource: EventSource | null = null;
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

  connect() {
    if (this.connectionSub) return;

    this.store.dispatch(fetchScicatTokenAction());

    this.connectionSub = this.store
      .select(selectUserSettingsPageViewModel)
      .pipe(
        map((vm) => vm?.scicatToken),
        distinctUntilChanged(),
      )
      .subscribe((token) => {
        if (token) {
          this.openConnection(token);
        } else {
          this.closeConnection();
        }
      });
  }

  private openConnection(token: string) {
    this.closeConnection();

    this.eventSource = new EventSource(`/api/v3/events/stream?token=${token}`);
    this.eventSource.onmessage = (event) => {
      this.ngZone.run(() => this.messageSubject.next(JSON.parse(event.data)));
    };
    this.eventSource.onerror = () => this.closeConnection();
  }

  private closeConnection() {
    this.eventSource?.close();
    this.eventSource = null;
  }

  disconnect() {
    this.closeConnection();
    this.connectionSub?.unsubscribe();
    this.connectionSub = null;
  }
}
