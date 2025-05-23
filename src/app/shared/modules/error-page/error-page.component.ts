import { Location } from "@angular/common";
import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "error-page",
  templateUrl: "./error-page.component.html",
  styleUrls: ["./error-page.component.scss"],
  standalone: false,
})
export class ErrorPageComponent implements OnInit {
  @Input() errorTitle = "";
  @Input() message = "";

  constructor(
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit() {
    // Keep the requested url unchanged
    const replaceUrl = this.route.snapshot.queryParams["url"];
    if (replaceUrl) {
      this.location.replaceState(replaceUrl);
    }
    // get errorTitle and message from redirection
    if (!this.errorTitle && !this.message) {
      this.route.data.subscribe((data) => {
        this.errorTitle = data.errorTitle;
        this.message = data.message;
      });
    }
  }
}
