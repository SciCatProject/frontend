| Option        | Type      | Required | Description                                            |
| ------------- | --------- | -------- | ------------------------------------------------------ |
| id            | string    | Yes      | Unique identifier for action                           |
| order         | number    | Yes      | UI display order                                       |
| label         | string    | Yes      | Button label text                                      |
| description   | string    | No       | Tooltip/extra info                                     |
| type          | string    | Yes      | "form", "link", "json-download", or "xhr"              |
| method        | string    | No       | HTTP method for requests                               |
| url           | string    | Yes      | Target URL (templated)                                 |
| target        | string    | No       | Browser tab/window target                              |
| icon          | string    | No       | Display icon (path to image asset)                     |
| mat_icon      | string    | No       | Material icon name                                     |
| files         | string    | No       | "all" or "selected" (file context)                     |
| enabled       | string    | No       | Expression for enabling action                         |
| disabled      | string    | No       | Expression for disabling action                        |
| hidden        | string    | No       | Expression for hiding action                           |
| authorization | string[]  | No       | Expressions for user/group authorization               |
| variables     | object    | No       | Variable definitions and selectors                     |
| inputs        | object    | No       | Form input mappings (for `"form"` type)                |
| headers       | object    | No       | HTTP headers (for `"xhr"`, `"json-download"`)          |
| payload       | string    | No       | Request body (`"xhr"`/`"json-download"` only)          |
| filename      | string    | No       | Download filename (`"json-download"` only)             |