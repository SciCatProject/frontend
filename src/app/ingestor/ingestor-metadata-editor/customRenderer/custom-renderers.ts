import { JsonFormsRendererRegistryEntry } from "@jsonforms/core";
import { TableRendererTester } from "@jsonforms/angular-material";
import {
  AnyOfRendererComponent,
  anyOfRendererTester,
} from "./any-of-renderer";
import {
  ArrayLayoutRendererCustom,
  arrayLayoutRendererTester,
} from "./array-renderer";
import {
  CustomObjectControlRendererComponent,
  objectGroupRendererTester,
} from "./object-group-renderer";
import {
  OwnerGroupFieldComponent,
  ownerGroupFieldTester,
} from "./owner-group-field-renderer";
import {
  QuantityValueLayoutRendererComponent,
  quantityValueLayoutTester,
} from "./quantity-value-layout-renderer";
import {
  SIFieldHiderRendererComponent,
  isSIFieldTester,
} from "./quantity-field-renderer";

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
    tester: anyOfRendererTester,
    renderer: AnyOfRendererComponent,
  },
  {
    tester: arrayLayoutRendererTester,
    renderer: ArrayLayoutRendererCustom,
  },
  {
    tester: TableRendererTester,
    renderer: ArrayLayoutRendererCustom,
  },
  {
    tester: objectGroupRendererTester,
    renderer: CustomObjectControlRendererComponent,
  },
  {
    tester: isSIFieldTester,
    renderer: SIFieldHiderRendererComponent,
  },
];
