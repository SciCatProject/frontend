import { Component, OnDestroy, OnInit, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { fetchJobAction } from "state-management/actions/jobs.actions";
import { Store } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";
import { selectCurrentJob } from "state-management/selectors/jobs.selectors";
import { Observable, Subscription } from "rxjs";
import { OutputJobV3Dto } from "@scicatproject/scicat-sdk-ts-angular";
import { Message, MessageType } from "state-management/models";
import { showMessageAction } from "state-management/actions/user.actions";

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
    @Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute,
    private store: Store,
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.store.dispatch(fetchJobAction({ jobId: params.id }));
    });
    this.job$.subscribe((job) => {
      this.hasJobResultObject =
        Object.keys(job.jobResultObject || {}).length > 0;
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  onCopy(pid: string) {
    const selectionBox = this.document.createElement("textarea");
    selectionBox.style.position = "fixed";
    selectionBox.style.left = "0";
    selectionBox.style.top = "0";
    selectionBox.style.opacity = "0";
    selectionBox.value = pid;
    this.document.body.appendChild(selectionBox);
    selectionBox.focus();
    selectionBox.select();
    this.document.execCommand("copy");
    this.document.body.removeChild(selectionBox);

    const message = new Message(
      "Job ID has been copied to your clipboard",
      MessageType.Success,
      2000,
    );
    this.store.dispatch(showMessageAction({ message }));
  }
}
