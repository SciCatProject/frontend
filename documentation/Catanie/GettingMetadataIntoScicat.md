
# Getting Metadata Into SciCat.


## Automatic Ingestion

An automatic login and ingestion of random data can be seen in scicat-develop


https://github.com/SciCatProject/scicat-develop/blob/master/create-data/index.js



## Manual ingestion

1.
Login to catamel

 curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{"username":"ingestor", \ 
 "password":"<your_password>"}' 'http://localhost:3000/api/v3/Users/login'

2. 
Create a json file in the correct format.

```
{
            "principalInvestigator": "Test User",
            "endTime": "2018-06-06T15:26:02.680Z",
            "owner": "Test User",
            "ownerEmail": "test.user@test.se",
            "orcidOfOwner": "0000-0000-0000-0000",
            "contactEmail": "test.user@esss.se",
            "sourceFolder": "/users/detector/experiments/sonde/IFE_june_2018/data/S1",
            "size": 872025994,
            "packedSize": 872025994,
            "creationTime": "2018-06-06T15:26:02.680Z",
            "type": "raw",
            "datasetName": "Sample Data from SoNDe 1",
            "validationStatus": "valid",
            "keywords": [
                "valid"
            ],
            "description": "https://github.com/ess-dmsc/ess_file_formats/wiki/SONDE",
            "creationLocation": "SoNDe",
            "license": "ESS",
            "version": "version",
            "isPublished": true,
            "ownerGroup": "ess",
            "accessGroups": [
                "brightness",
                "ess"
            ],
            "scientificMetadata": {
                "elog_id": "242",
                "Optical coupling": "Dryfit"
            },
            "proposalId": "LM28IF",
            "sampleId": "SAMPLE001"
        },
```

3. 
Upload to catamel:



```
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ \ 
   "pid": "string", \ 
   "owner": "string", \ 
   "ownerEmail": "string", \ 
   "orcidOfOwner": "string", \ 
   "contactEmail": "string", \ 
   "sourceFolder": "string", \ 
   "size": 0, \ 
   "packedSize": 0, \ 
   "creationTime": "2018-12-10T15:38:43.042Z", \ 
   "type": "string", \ 
   "validationStatus": "string", \ 
   "keywords": [ \ 
     "string" \ 
   ], \ 
   "description": "string", \ 
   "classification": "string", \ 
   "license": "string", \ 
   "version": "string", \ 
   "doi": "string", \ 
   "isPublished": true, \ 
   "ownerGroup": "string", \ 
   "accessGroups": [ \ 
     "string" \ 
   ], \ 
   "createdBy": "string", \ 
   "updatedBy": "string", \ 
   "createdAt": "2018-12-10T15:38:43.042Z", \ 
   "updatedAt": "2018-12-10T15:38:43.042Z" \ 
 }' 'http://localhost:3000/api/v3/Datasets?access_token=TTQFlqAWWWnMHHxZdPbYP2LZhaLgUrb8DoQcmNeIpDgku0ScNH0oRCOq8JODcF70'
```
Here, the access token  must be replaced by the one provided after logging in as above.


## Loopback explorer ingestion

Using the loopback interface, data can be added to through the explorer interface
