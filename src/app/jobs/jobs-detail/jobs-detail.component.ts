import { Component, OnDestroy, OnInit } from "@angular/core";
import { fetchJobAction } from "state-management/actions/jobs.actions";
import { Store } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";
import { selectCurrentJob } from "state-management/selectors/jobs.selectors";
import { Observable, Subscription } from "rxjs";
import { OutputJobV3Dto } from "@scicatproject/scicat-sdk-ts-angular";
import { ClipboardService } from "shared/services/clipboard.service";

@Component({
  selector: "app-jobs-detail",
  templateUrl: "./jobs-detail.component.html",
  styleUrls: ["./jobs-detail.component.scss"],
  standalone: false,
})
export class JobsDetailComponent implements OnInit, OnDestroy {
  job$ = this.store.select(selectCurrentJob) as Observable<OutputJobV3Dto>;
  routeSubscription: Subscription = new Subscription();

  showJobParams = false;
  showJobResultObject = false;
  hasJobResultObject = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private clipboardService: ClipboardService,
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.store.dispatch(fetchJobAction({ jobId: params.id }));
    });
    this.job$.subscribe((job) => {
      this.hasJobResultObject =
        Object.keys(job?.jobResultObject || {}).length > 0;
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  onCopy(pid: string) {
    this.clipboardService.copyToClipboard(
      pid,
      "Job ID has been copied to your clipboard",
      2000,
    );
  }
}
