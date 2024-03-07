import { Component, ChangeDetectorRef, AfterViewChecked } from "@angular/core";
import { Store } from "@ngrx/store";
import {
  selectCurrentDataset,
  selectCurrentDatasetWithOnlyScientificMetadataKey,
} from "state-management/selectors/datasets.selectors";
import { AppConfigService } from "app-config.service";

@Component({
  selector: "jsonScientificMetadata",
  templateUrl: "./jsonScientificMetadata.component.html",
  styleUrls: ["./jsonScientificMetadata.component.scss"],
})
export class JsonScientificMetadataComponent implements AfterViewChecked {
  dataset$ = this.store.select(selectCurrentDataset);
  datasetWithout$ = this.store.select(
    selectCurrentDatasetWithOnlyScientificMetadataKey,
  );

  editingAllowed = true;
  show = false;
  appConfig = this.appConfigService.getConfig();

  constructor(
    public appConfigService: AppConfigService,
    private store: Store,
    private cdRef: ChangeDetectorRef,
  ) {
    console.log({ dataset: this.dataset$ });
    console.log({ datasetWithout: this.datasetWithout$ });
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
}
