import { isAllOfControl, isAnyOfControl, isOneOfControl, JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import { OneOfRenderer } from 'ingestor/ingestor-metadata-editor/customRenderer/one-of-renderer';
import { AllOfRenderer } from 'ingestor/ingestor-metadata-editor/customRenderer/all-of-renderer';
import { AnyOfRenderer } from 'ingestor/ingestor-metadata-editor/customRenderer/any-of-renderer';
import { isRangeControl, RankedTester, rankWith } from '@jsonforms/core';

export const customRenderers: JsonFormsRendererRegistryEntry[] = [
  {
    tester: rankWith(4, isOneOfControl),
    renderer: OneOfRenderer
  },
  {
    tester: rankWith(4, isAllOfControl),
    renderer: AllOfRenderer
  },
  {
    tester: rankWith(4, isAnyOfControl),
    renderer: AnyOfRenderer
  }
];