import {
  isAllOfControl,
  isAnyOfControl,
  isObjectArrayWithNesting,
  isOneOfControl,
  JsonFormsRendererRegistryEntry,
} from "@jsonforms/core";
import { OneOfRendererComponent } from "ingestor/ingestor-metadata-editor/customRenderer/one-of-renderer";
import { AllOfRendererComponent } from "ingestor/ingestor-metadata-editor/customRenderer/all-of-renderer";
import { AnyOfRendererComponent } from "ingestor/ingestor-metadata-editor/customRenderer/any-of-renderer";
import { rankWith } from "@jsonforms/core";
import { TableRendererTester } from "@jsonforms/angular-material";
import { ArrayLayoutRendererCustom } from "./array-renderer";

export const customRenderers: JsonFormsRendererRegistryEntry[] = [
  {
    tester: rankWith(4, isOneOfControl),
    renderer: OneOfRendererComponent,
  },
  {
    tester: rankWith(4, isAllOfControl),
    renderer: AllOfRendererComponent,
  },
  {
    tester: rankWith(4, isAnyOfControl),
    renderer: AnyOfRendererComponent,
  },
  // other
  {
    tester: rankWith(4, isObjectArrayWithNesting),
    renderer: ArrayLayoutRendererCustom,
  },
  { tester: TableRendererTester, renderer: ArrayLayoutRendererCustom },
];
