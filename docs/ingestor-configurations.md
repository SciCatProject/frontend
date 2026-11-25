# Ingestor Configuration

## 1. Creation locations

The list of creation location shown in `ingestor/creation` page comes from the Ingestor webservice.

- **Source:** Ingestor Webservice ` GET /configurations`
- **Format:** array of strings, usually `/Site/Facility/Instrument`
  (same convention as the dataset field `creationLocation`)
- **Default / fallback:** empty list
- **To customise for your facility:** add the `creationLocations` section to the Ingestor configuration of your facility