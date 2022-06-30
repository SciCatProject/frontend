import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable()
export class LazyChildService {
  private readonly childChanges$ = new Subject<string>();

  updateChildComponentState(component: string): void {
    this.childChanges$.next(component);
  }

  childChanges(): Observable<string> {
    return this.childChanges$.asObservable();
  }
}
