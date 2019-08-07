import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import * as selectors from "state-management/selectors";

@Component({
  selector: "app-app-layout",
  templateUrl: "./app-layout.component.html",
  styleUrls: ["./app-layout.component.scss"]
})
export class AppLayoutComponent implements OnInit {
  darkTheme$;

  constructor(private store: Store<any>) {
    this.darkTheme$ = this.store.pipe(select(selectors.users.getTheme));
  }

  ngOnInit() {}
}
