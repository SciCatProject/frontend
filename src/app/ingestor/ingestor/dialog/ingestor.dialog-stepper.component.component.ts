import { Component, Input } from "@angular/core";

@Component({
  selector: "ingestor-dialog-stepper",
  templateUrl: "./ingestor.dialog-stepper.component.html",
  styleUrls: ["./ingestor.dialog-stepper.component.css"],
})
export class IngestorDialogStepperComponent {
  @Input() activeStep = 0;
}
