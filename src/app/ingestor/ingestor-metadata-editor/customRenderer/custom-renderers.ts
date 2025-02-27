import {
  isAnyOfControl,
  isObjectArrayWithNesting,
  JsonFormsRendererRegistryEntry,
} from "@jsonforms/core";
import { AnyOfRendererComponent } from "ingestor/ingestor-metadata-editor/customRenderer/any-of-renderer";
import { rankWith } from "@jsonforms/core";
import {
  ObjectControlRendererTester,
  TableRendererTester,
} from "@jsonforms/angular-material";
import { ArrayLayoutRendererCustom } from "./array-renderer";
import { CustomObjectControlRendererComponent } from "./object-group-renderer";

export const customRenderers: JsonFormsRendererRegistryEntry[] = [
  /*{
    tester: rankWith(4, isOneOfControl),
    renderer: OneOfRendererComponent,
  },
  {
    tester: rankWith(4, isAllOfControl),
    renderer: AllOfRendererComponent,
  },*/
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
  {
    tester: ObjectControlRendererTester,
    renderer: CustomObjectControlRendererComponent,
  },
];
