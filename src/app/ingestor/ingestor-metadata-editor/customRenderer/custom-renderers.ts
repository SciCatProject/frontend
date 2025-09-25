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
import {
  OwnerGroupFieldComponent,
  ownerGroupFieldTester,
} from "./owner-group-field-renderer";
import {
  QuantityValueLayoutRendererComponent,
  quantityValueLayoutTester,
} from "./quantity-value-layout-renderer";
import { SIFieldHiderRenderer, isSIFieldTester } from "./quantity-field-renderer";

export const customRenderers: JsonFormsRendererRegistryEntry[] = [
  {
    tester: ownerGroupFieldTester,
    renderer: OwnerGroupFieldComponent,
  },
  {
    tester: quantityValueLayoutTester,
    renderer: QuantityValueLayoutRendererComponent,
  },
  {
    tester: rankWith(4, isAnyOfControl),
    renderer: AnyOfRendererComponent,
  },
  {
    tester: rankWith(4, isObjectArrayWithNesting),
    renderer: ArrayLayoutRendererCustom,
  },
  { tester: TableRendererTester, renderer: ArrayLayoutRendererCustom },
  {
    tester: ObjectControlRendererTester,
    renderer: CustomObjectControlRendererComponent,
  },
  {
    tester: isSIFieldTester, 
    renderer: SIFieldHiderRenderer,
  },
];
