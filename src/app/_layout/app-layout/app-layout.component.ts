import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { getTheme } from "state-management/selectors/user.selectors";
import { Observable } from "rxjs";

@Component({
  selector: "app-app-layout",
  templateUrl: "./app-layout.component.html",
  styleUrls: ["./app-layout.component.scss"]
})
export class AppLayoutComponent implements OnInit {
  darkTheme$: Observable<any>;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.darkTheme$ = this.store.pipe(select(getTheme));
  }
}
