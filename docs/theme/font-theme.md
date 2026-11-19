---
title: Font Theme
audience: Technical
created_by: Junjie Quan
created_on: 2026/10/29
---

# Font Theme

The font of the whole application is set by the `--theme-font-family` variable.
Like the color variables (see [color-theme.md](color-theme.md)), it can be changed per deployment without touching source code.

# Variable Details

`--theme-font-family`:
Controls the font of the whole application.
- Default: `"Titillium Web", "Helvetica Neue", Arial, sans-serif`
- Only `"Titillium Web"` ships with the frontend, other fonts are only used when they are installed on the user's computer.
- To use another font, add it to the `properties` of the theme file (`frontend.theme.json` of the backend, or `assets/theme.json`):

```json
{
  "name": "light",
  "properties": {
    "--theme-font-family": "Inter, \"Helvetica Neue\", Arial, sans-serif"
  }
}
```

# Available Options

`--theme-font-family` is the only font variable. Font size, line height, weight and letter spacing are not configurable.

The value is a regular CSS `font-family` list, the first font that is available is used:

| Font | Available to |
|---|---|
| `"Titillium Web"` | everyone, ships with the frontend in the weights 200, 300, 400, 600, 700 and 900, each also italic |
| Any other font, e.g. `Inter`, `Roboto` | only users that have it installed |
| Generic families: `sans-serif`, `serif`, `monospace`, `system-ui` | everyone, the browser picks a font of the operating system |

⚠️ _NOTE: A few places keep their own font and do not follow the variable: the column settings menu of the tables (`Roboto, "Helvetica Neue", sans-serif`), the "Redirecting" page (`Arial`) and the icons (`"Material Icons"`)._
