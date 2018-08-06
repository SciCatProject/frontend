# SciCat Data Catalogue Developer Guide


Users require a metadata management interface to find and query the metadata from scientific experiments.
They can query information from a proposal and submit an archiving job.

In SciCat separate responsibilities are split into separate groups of angular components

### Datasets

Users can see the dataset table on their front page dashboard.
* dataset details
* dataset attachment 
* dataset table
* datafiles - 
* datablocks - abstraction of physical layout of data over storage media (disk, tapes etc)
* dashboard - users first view on login

### User

* login
* details
* settings

### Proposals

Users can be part of many proposals and have access to datasets from many proposals
Principal Investigator users can also add users to proposals and give access to data

* proposal detail
* proposal list

### Jobs

Users can see the state of data retrieval and data suubmission to archive backup system
* job details 
* job tables



Unit tests are explained in this page
[Testing](Testing)

Ngrx is the Angular implementation of Redux state management
[Ngrx](Ngrx)

Users can archive data  using the Archive interface1
[Archiving](Archiving)
