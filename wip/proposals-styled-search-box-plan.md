# Proposals List Styled Search Box Plan

## Goal

Apply the same search-box and paginator improvements used by the dataset list to the proposals list:

- Search box expands into all available space when no top paginator is rendered.
- Search box leaves room for the top paginator when pagination is present.
- Search box and paginator use the same border, radius, background, and height.
- Search field is shorter than the original mock/current styling.
- A consistent gap separates the search box and paginator.
- Controls stack vertically when the available screen/table width becomes too small.

## Current implementation

The proposals list is composed of:

- `src/app/proposals/proposal-dashboard/proposal-dashboard.component.html`
- `src/app/proposals/proposal-dashboard/proposal-dashboard.component.scss`
- `src/app/proposals/proposal-table/proposal-table.component.html`
- `src/app/proposals/proposal-table/proposal-table.component.scss`
- Shared table implementation:
  - `src/app/shared/modules/dynamic-material-table/table/dynamic-mat-table.component.html`
  - `src/app/shared/modules/dynamic-material-table/table/dynamic-mat-table.component.scss`

`proposal-table.component.html` already uses `dynamic-mat-table` with:

```html
[showGlobalTextSearch]="true"
[globalTextSearch]="globalTextSearch"
[pagination]="pagination"
[sideFilterCollapsed]="sideFilterCollapsed"
```

The shared dynamic table renders the search field and top paginator inside `.table-header-controls`. The proposal-specific SCSS file is currently empty, so the implementation should primarily reuse the shared control styling rather than duplicate it in the proposal feature.

## Implementation steps

### 1. Confirm shared styling applies to proposals

Verify that the dataset-list changes in:

`src/app/shared/modules/dynamic-material-table/table/dynamic-mat-table.component.scss`

apply correctly to `proposal-table` through the shared component. Confirm that the proposal list receives:

- Full-width flexible search behavior.
- The content-sized top paginator.
- Matching 48px control height.
- Shared border and 24px radius.
- Reduced search input vertical padding.
- Responsive stacking at the shared breakpoint.

Do not duplicate the shared rules in `proposal-table.component.scss` unless proposal-specific markup requires an override.

### 2. Validate the proposal table container width

Review the interaction between the shared header controls and proposal layout:

- `.table-column` has `min-width: 0`, which should allow the search field to shrink correctly.
- The proposal side filter can change the effective width through `sideFilterCollapsed`.
- `.table-header-controls.with-side-filter` adds a left margin, so verify that this margin does not cause horizontal overflow when the side filter is expanded or at tablet widths.

If required, add only a proposal-scoped override in `proposal-dashboard.component.scss` or `proposal-table.component.scss` to preserve `min-width: 0` and prevent overflow. Avoid changing the shared behavior unless the issue affects other table consumers.

### 3. Preserve proposal search and pagination behavior

Do not change proposal data behavior or event handling:

- Keep `globalTextSearchChange` and `globalTextSearchApply` bindings unchanged.
- Keep the existing `paginationChange` binding unchanged.
- Keep `paginationMode = "server-side"` unchanged.
- Respect the configured `appConfig.paginationPosition` values of `top`, `bottom`, and `both`.

Expected results:

- `paginationPosition: "bottom"`: search occupies the complete header width.
- `paginationPosition: "top"` or `"both"`: search and paginator share the row when space allows.
- Narrow layout: search appears above the paginator.

### 4. Ensure identical border treatment

If a proposal-specific override is necessary, it must use the same shared values as the dataset list:

- `height: 48px`
- `border: 1px solid var(--theme-hover-lighter)`
- `border-radius: 24px`
- `background-color: white`
- Theme primary border color on hover/focus

The proposal implementation must not add a second border to the Material form-field or paginator. The outer `.global-search-wrapper` and `.paginator-container` should remain the only visible bordered surfaces.

### 5. Responsive verification

Test the proposals list at widths that account for the side filter:

- Desktop with side filter expanded.
- Desktop with side filter collapsed.
- Tablet width where the search and paginator are close to exceeding the available width.
- Mobile width where controls must stack.

When stacked:

- Search box should be first.
- Paginator should be second.
- Both controls should use the available width.
- The vertical gap should clearly separate them.
- No horizontal scrollbar should appear.

### 6. Tests

Review and extend:

`src/app/proposals/proposal-table/proposal-table.component.spec.ts`

Test that:

- The proposal table enables global search.
- The proposal table supplies its pagination configuration.
- The proposal table continues to emit/search through its existing handlers.
- The side-filter-collapsed input is passed to the dynamic table.

Review the shared paginator-position tests in:

`src/app/shared/modules/dynamic-material-table/table/dynamic-mat-table.paginator.spec.ts`

If shared style behavior is covered through component tests, add assertions for:

- Search and paginator being rendered within `.table-header-controls`.
- Matching control classes/structure.
- No duplicate nested border styling in the rendered structure where practical.

CSS visual checks should be performed manually or through the existing browser test setup because exact computed dimensions and responsive flex behavior are difficult to validate fully with Angular unit tests.

## Expected files

Likely no new proposal-specific styling is needed because proposals already consume the shared dynamic table. The implementation should first validate the existing shared changes.

Potential files if an override is required:

- `src/app/proposals/proposal-table/proposal-table.component.scss`
- `src/app/proposals/proposal-dashboard/proposal-dashboard.component.scss`

Potential test updates:

- `src/app/proposals/proposal-table/proposal-table.component.spec.ts`
- `src/app/shared/modules/dynamic-material-table/table/dynamic-mat-table.paginator.spec.ts`

## Acceptance criteria

- Proposal search box uses the same styling as the dataset search box.
- Search box uses all available width when no top paginator is present.
- Search box and paginator share the available row when top pagination is present.
- Both controls have equal height and the same visible border treatment.
- Search field is not unnecessarily tall.
- Controls have a visible separating gap.
- Controls stack cleanly on narrow screens.
- Side-filter expanded/collapsed states do not create overflow.
- Existing proposal search, pagination, and server-side data behavior remain unchanged.
