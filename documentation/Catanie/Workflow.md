
 
1. One or a group of user(s) is created (as part of /Users), and given access to the web frontend. Database user creation/registration is not possible yet using Catanie. Users are linked to catamel through AD/LDAP
2. Their proposal is uploaded as part of /Proposals by proposalIngestor
3. Their samples are uploaded as part of /Samples 
4. Their proposal is assigned an instrument (no /Instrument table yet, no interface available yet...)
5. Their proposal is assigned one or multiple measurementPeriods (start - end timeslot, no interface available for this yet, but fields available in /Proposals/{id}/measurementPeriods ). The creation of a schedule will be handled in the user office, not scicat.
6. a measurement is done, a /RawDataset entry is created 
7. The measurement creates a number of files, the metadata for  which (e.g. size, location on disk) are stored via the /RawDataset/{id}/origdatablocks interface
8. A data correction routine produces a corrected dataset from RawDataset, this is stored as a new /DerivedDataset is created, and links to datasetId are added
9. A (series of) automated analysis is done (no Table)
10. Manual analyses are done, analysed data is uploaded via DerivedDataset
11. The relevant DerivedDatasets and/or RawDatasets are grouped and published by the user generating a DOI via the PublishedData model
12. A report is written, citing the dataset DOI.

