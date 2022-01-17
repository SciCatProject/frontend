import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import {
  selectIsLoggedIn,
  selectTheme,
} from "state-management/selectors/user.selectors";
import { Observable } from "rxjs";

@Component({
  selector: "app-app-layout",
  templateUrl: "./app-layout.component.html",
  styleUrls: ["./app-layout.component.scss"],
})
export class AppLayoutComponent implements OnInit {
  darkTheme$: Observable<any> = new Observable<any>();

  loggedIn$ = this.store.select(selectIsLoggedIn);

  constructor(private store: Store) {}

  ngOnInit() {
    this.darkTheme$ = this.store.select(selectTheme);
  }
}
