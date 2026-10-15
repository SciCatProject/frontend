# Styled Dataset Search Box and Top Paginator Plan

## Frontend review

The provided mock shows the dataset table controls arranged horizontally:

- A full-width rounded search box above the dataset table.
- A paginator positioned alongside the search box when top pagination is enabled.
- The search box and paginator have matching visual height.
- A clear visual gap separates the two controls.
- The search box is shorter than the current implementation.
- On narrow screens, the controls should stack vertically.

The relevant implementation is in:

- `src/app/shared/modules/dynamic-material-table/table/dynamic-mat-table.component.html`
- `src/app/shared/modules/dynamic-material-table/table/dynamic-mat-table.component.scss`
- `src/app/datasets/dataset-table/dataset-table.component.html`
- `src/assets/config.json`

The existing structure already places the search field and top paginator inside `.table-header-controls`. However, the current styling limits the search box to `max-width: 33%`, applies `min-width: 500px`, and gives the field relatively large vertical padding. These rules prevent it from expanding correctly and can cause layout problems at smaller widths.

## Implementation plan

### 1. Adjust the header control layout

Update `.table-header-controls` so that:

- It remains a horizontal flex row when enough space is available.
- The search field grows to consume all remaining space.
- The paginator retains only the width it needs.
- The controls remain aligned vertically.
- The layout has a consistent gap, approximately `16px`.

The search wrapper should use:

```scss
.global-search-wrapper {
  flex: 1 1 auto;
  min-width: 0;
  max-width: none;
  width: auto;
}
```

This allows the search box to occupy the full available width when the paginator is not rendered, while still leaving room for the paginator when it is present.

### 2. Make the search and paginator equal in height

Define a shared control height, approximately `48px` or slightly below the mock's height. The current search field is too tall because of:

```scss
.mat-mdc-form-field-infix {
  padding: 12px 20px;
}
```

Reduce the vertical padding while preserving horizontal spacing:

```scss
::ng-deep .mat-mdc-form-field-infix {
  padding: 8px 20px;
  min-height: auto;
}
```

The search wrapper and paginator should both use the same height:

```scss
.global-search-wrapper,
.paginator-container {
  height: 48px;
}
```

The paginator's internal Material controls should be vertically centered within that height rather than relying on independently sized elements.

### 3. Apply one shared border treatment

The search box and paginator should use the same outer visual treatment so they read as a matched control group:

- Same border width and color.
- Same border radius.
- Same white background.
- Same overall height.
- Same focus/active border color where applicable.

Define the shared styling once and apply it to both controls, preferably through a shared class or selector for `.global-search-wrapper` and `.paginator-container`. Avoid maintaining separate, slightly different border declarations for the search field and paginator.

For example:

```scss
.global-search-wrapper,
.paginator-container {
  background-color: white;
  border: 1px solid var(--theme-hover-lighter);
  border-radius: 24px;
  box-sizing: border-box;
  height: 48px;
}
```

The search field should not render an additional competing Material outline or underline. Its internal Material wrapper should be made borderless so the shared outer border is the only visible border:

```scss
.global-search-wrapper {
  ::ng-deep .mat-mdc-text-field-wrapper {
    border: 0;
    background: transparent;
  }

  ::ng-deep .mat-mdc-form-field-underline,
  ::ng-deep .mdc-line-ripple {
    display: none;
  }
}
```

Apply the same hover/focus border color to the shared control styling. The paginator should use this shared border directly rather than defining an independent border with different margins, radius, or color.

Keep the remaining mock styling:

- Search icon aligned with the input text.
- Clear and apply actions retained when text exists.
- Adequate internal horizontal padding.

### 4. Ensure correct paginator sizing

The paginator should not stretch to fill the remaining horizontal space. Update the paginator container to use its content width:

```scss
.paginator-container {
  flex: 0 0 auto;
  width: auto;
  min-width: fit-content;
}
```

The paginator container receives the shared border treatment described above. Its internal page-size selector and navigation controls should be vertically centered without adding their own visible border or changing the outer control height.

The existing paginator rules in `dynamic-mat-table.component.scss`, particularly the `30px` page-size field overrides, should be reviewed together so that they do not create a mismatch between the paginator and search field. Remove or override the existing paginator-specific `border`, `border-radius`, `margin-bottom`, and `margin-right` declarations where they conflict with the shared treatment. Preserve only spacing needed between the two controls through the parent `gap`.

### 5. Add responsive stacking

At a breakpoint where the controls no longer fit comfortably—approximately `768px`, or based on the actual table width—stack the elements:

```scss
@media (max-width: 768px) {
  .table-header-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .global-search-wrapper,
  .paginator-container {
    width: 100%;
    max-width: none;
    min-width: 0;
  }

  .paginator-container {
    justify-content: stretch;
  }

  .paginator-container mat-paginator {
    width: 100%;
    margin-right: 0;
  }
}
```

The search box should appear first, followed by the paginator. This preserves the most important action—the dataset search—at the top of the mobile layout.

The breakpoint should be validated against the effective table-column width, not only the viewport width, because the left-side filter panel reduces the available width on desktop and tablet layouts.

### 6. Keep pagination-position behavior unchanged

Do not change the existing conditional rendering logic:

```html
*ngIf="pagination && appConfig.paginationPosition !== 'bottom'"
```

The desired behavior is:

- `paginationPosition: "top"` or `"both"`: search and paginator appear side by side when space permits.
- `paginationPosition: "bottom"`: search expands to the full available width.
- Small screens: search and paginator stack regardless of pagination position.
- Bottom paginator behavior remains unchanged.

### 7. Add or update tests

Extend `src/app/shared/modules/dynamic-material-table/table/dynamic-mat-table.paginator.spec.ts` to verify:

- The top paginator is rendered for `"top"` and `"both"`.
- The bottom paginator is rendered for `"bottom"` and `"both"`.
- The search wrapper and paginator are both inside `.table-header-controls`.
- The search wrapper is present when global search is enabled.
- The search box and paginator receive the same border width, color, radius, and height.
- Neither control introduces a conflicting nested border.
- The existing pagination-position logic remains unaffected.

Visual verification should also be performed at:

- Desktop width with top pagination.
- Desktop width without top pagination.
- Tablet width where the controls are close to fitting.
- Mobile width where controls must stack.
- Long paginator labels and different page-size options.
- Search field with and without entered text.

## Files expected to change

Primary:

- `src/app/shared/modules/dynamic-material-table/table/dynamic-mat-table.component.scss`

Potentially:

- `src/app/shared/modules/dynamic-material-table/table/dynamic-mat-table.component.html`
- `src/app/shared/modules/dynamic-material-table/table/dynamic-mat-table.paginator.spec.ts`

No changes should be required to dataset search behavior or pagination state management.
