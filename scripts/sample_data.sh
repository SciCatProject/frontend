#!/bin/sh
# UPDATE ACCESS TOKEN 
http POST http://localhost:3000/api/v3/RawDatasets?access_token=wDBhvBhKAc0OL8Hrc0WP3CcuIFSUVjEFyxF38sNHTUgHZaunDlxqxBeDOSVVJaJx < raw_dataset.json

http POST http://localhost:3000/api/v3/Datablocks?access_token=S5GtalRhAs1jT0PJovPmv8A3QbLwoHeUoRgh3VKiqFcchULvO3zU4VYjSko589fN < datablock_two.json

# curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d raw_dataset.json 'http://localhost:3000/api/v3/RawDatasets?access_token=QNV0Su9omZy9R6I38H7iv0aMbbWW0j7LsGvve2YoWJvif4MwyLGSSkdZ8RWsIDVq'

# curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d datablock.json 'http://localhost:3000/api/v3/Datablocks?access_token=QNV0Su9omZy9R6I38H7iv0aMbbWW0j7LsGvve2YoWJvif4MwyLGSSkdZ8RWsIDVq'


