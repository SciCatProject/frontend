import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { JsonSchema } from "@jsonforms/core";
import {
  getJsonSchemaFromDto,
  IngestionRequestInformation,
  IngestorHelper,
} from "../../../ingestor-page/helper/ingestor.component-helper";
import { convertJSONFormsErrorToString } from "ingestor/ingestor-metadata-editor/ingestor-metadata-editor-helper";
import {
  selectIngestionObject,
  selectIngestorRenderView,
  selectUpdateEditorFromThirdParty,
} from "state-management/selectors/ingestor.selector";
import * as fromActions from "state-management/actions/ingestor.actions";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { renderView } from "ingestor/ingestor-metadata-editor/ingestor-metadata-editor.component";

@Component({
  selector: "ingestor-user-metadata-dialog",
  templateUrl: "ingestor.user-metadata-dialog-page.html",
  styleUrls: ["../../../ingestor-page/ingestor.component.scss"],
  standalone: false,
})
export class IngestorUserMetadataDialogPageComponent
  implements OnInit, OnDestroy
{
  private subscriptions: Subscription[] = [];
  ingestionObject$ = this.store.select(selectIngestionObject);
  renderView$ = this.store.select(selectIngestorRenderView);
  selectUpdateEditorFromThirdParty$ = this.store.select(
    selectUpdateEditorFromThirdParty,
  );

  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  @Output() nextStep = new EventEmitter<void>();
  @Output() backStep = new EventEmitter<void>();

  metadataSchemaOrganizational: JsonSchema;
  metadataSchemaSample: JsonSchema;
  scicatHeaderSchema: JsonSchema;
  activeRenderView: renderView | null = null;
  updateEditorFromThirdParty = false;

  uiNextButtonReady = false;
  isSciCatHeaderOk = false;
  scicatHeaderErrors = "";
  isOrganizationalMetadataOk = false;
  organizationalErrors = "";
  isSampleInformationOk = false;
  sampleErrors = "";

  isCardContentVisible = {
    scicat: true,
    organizational: true,
    sample: true,
  };

  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.ingestionObject$.subscribe((ingestionObject) => {
        if (ingestionObject) {
          this.createNewTransferData = ingestionObject;

          this.metadataSchemaOrganizational =
            this.createNewTransferData.selectedResolvedDecodedSchema.properties.organizational;
          this.metadataSchemaSample =
            this.createNewTransferData.selectedResolvedDecodedSchema.properties.sample;
          this.scicatHeaderSchema = getJsonSchemaFromDto();
        }
      }),
    );

    this.subscriptions.push(
      this.renderView$.subscribe((renderView) => {
        if (renderView) {
          console.log(renderView);
          // Check if renderView changed
          if (this.activeRenderView !== renderView) {
            this.activeRenderView = renderView;
          }
        }
      }),
    );

    this.subscriptions.push(
      this.selectUpdateEditorFromThirdParty$.subscribe((updateEditor) => {
        // We need to rerender the editor if the user has changed the metadata in the third party
        // So we get a flag, if it is true we unrender the editor
        // and then we set it to false to render it again
        this.updateEditorFromThirdParty = updateEditor;
        if (updateEditor) {
          this.cdr.detectChanges(); // Force the change detection to unrender the editor
          this.store.dispatch(
            fromActions.resetIngestionObjectFromThirdPartyFlag(),
          );
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onClickBack(): void {
    this.store.dispatch(
      fromActions.updateIngestionObject({
        ingestionObject: this.createNewTransferData,
      }),
    );

    this.backStep.emit(); // Open previous dialog
  }

  onClickNext(): void {
    this.store.dispatch(
      fromActions.updateIngestionObject({
        ingestionObject: this.createNewTransferData,
      }),
    );

    this.nextStep.emit(); // Open next dialog
  }

  onDataChangeUserMetadataOrganization(event: any) {
    this.createNewTransferData.userMetaData["organizational"] = event;
  }

  onDataChangeUserMetadataSample(event: any) {
    this.createNewTransferData.userMetaData["sample"] = event;
  }

  onDataChangeUserScicatHeader(event: any) {
    this.createNewTransferData.scicatHeader = event;
  }

  onCreateNewTransferDataChange(updatedData: IngestionRequestInformation) {
    Object.assign(this.createNewTransferData, updatedData);
  }

  toggleCardContent(card: string): void {
    this.isCardContentVisible[card] = !this.isCardContentVisible[card];
  }

  scicatHeaderErrorsHandler(errors: any[]) {
    this.isSciCatHeaderOk = errors.length === 0;
    this.scicatHeaderErrors = convertJSONFormsErrorToString(errors);
    this.validateNextButton();
    this.cdr.detectChanges();
  }

  organizationalErrorsHandler(errors: any[]) {
    this.isOrganizationalMetadataOk = errors.length === 0;
    this.organizationalErrors = convertJSONFormsErrorToString(errors);
    this.validateNextButton();
    this.cdr.detectChanges();
  }

  sampleErrorsHandler(errors: any[]) {
    this.isSampleInformationOk = errors.length === 0;
    this.sampleErrors = convertJSONFormsErrorToString(errors);
    this.validateNextButton();
    this.cdr.detectChanges();
  }

  validateNextButton(): void {
    this.uiNextButtonReady = this.isSciCatHeaderOk;
  }
}
