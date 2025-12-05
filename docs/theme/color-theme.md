---
title: Theme System Overview & New Variables
audience: Technical
created_by: Junjie Quan
created_on: 2025/12/05
---

# Theme System Overview

The SciCat front-end uses a **CSS variable–based theming system**.  
All configurable visual properties—colors, and component-specific styles—are exposed as `--theme-*` variables.  

This allows deployments to adjust appearance without touching source code.
The application reads these variables directly in SCSS using standard var() usage:

```scss
color: var(--theme-header-1-default);
border: var(--theme-table-border);
box-shadow: var(--theme-table-shadow);
```

# Variable Details

`--theme-primary-default`

`--theme-primary-default-contrast`

… Above variables control general old theme colors (modify as needed)



# Newly Added Variables

### Date: 2025-12-05

```scss
--theme-side-panel-border
--theme-side-panel-shadow
--theme-table-border
--theme-table-shadow
```
⚠️ _NOTE: The 4 variables are currently implemented only on the Datasets and Proposals pages._

`--theme-side-panel-border`:
Controls the border around the collapsible side panel.
- Default: none
- Component-level fallback:
  -  1px solid rgba(153, 213, 233, 0.7) (provided through var(--theme-table-border, fallback) in SCSS)
- Set to none to remove the border completely.

`--theme-side-panel-shadow`:
Controls the shadow applied to the side panel.
- Default: Material-like elevation shadow
  - 0px 2px 1px -1px rgba(0, 0, 0, 0.20), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)`
- Set to none to disable shadows.

`--theme-table-border`:
Controls the border around the table container.
- Default: none
- Component-level fallback:
  -  1px solid rgba(153, 213, 233, 0.7) (provided through var(--theme-table-border, fallback) in SCSS)
- Set to none to remove the border completely.

`--theme-table-shadow`:
Controls the shadow applied to the table container.
- Default: Material-like elevation shadow
  - 0px 2px 1px -1px rgba(0, 0, 0, 0.20), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)`
- Set to none to disable shadows.
