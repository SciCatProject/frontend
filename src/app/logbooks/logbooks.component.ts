import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { Logbook } from "shared/sdk/models";

@Component({
  selector: "app-logbooks",
  templateUrl: "./logbooks.component.html",
  styleUrls: ["./logbooks.component.scss"]
})
export class LogbooksComponent implements OnInit {
  logbook$: Observable<Logbook>;

  constructor(private route: ActivatedRoute, private store: Store<any>) {}

  ngOnInit() {}

  ngOnDestroy() {}
}
