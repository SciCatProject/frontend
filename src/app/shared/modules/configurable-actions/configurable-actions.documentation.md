# Datafiles Actions documentation

Datafiles actions are configurable actions specific to all or selected datafiles. They are shown as button in the "Datafiles" tab under the individual dataset page.
The button can be configured with text or icon or both.
At the moment there are only two kind of actions: form and json-download.

## Configuration
The configuration of the datafiles actions is done by adding an array of action objects under the __datafilesActions__ key of the SciCat frontend configuration file.
Each object in the array configure one action.

## Individual action configuration
The action configuration is a json object wiuth the following keys:
- __id__: unique id of the action.  
  Used for management and tracking purposes.  
  - _Type_: string  
  - _Required_: true  
  - _Example_: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
- __description__: description of the action.  
  Not shown in the FE, used only for management purposes.
  - _Type_: string   
  - _Optional_: true 
- __order__: order in which the related button is rendered in the tab.  
  The action are ordered from left to right in ascending order.  
  - _Type_: integer  
  - _Optional_: true
  - _Example_: 5
- __label__: String shown in related button.  
  If no label is provided, an icon should be defined and the button will use only the icom.  
  - _Type_: string
  - _Optional_: true
  - _Example_: Download All  
  - _Notes_: at least on of the following properties should be present: `label` or `icon` or `mat_icon` 
- __files__: which files should be provided when the action is triggered.  
  - _Type_: string
  - _Allowed values_: `selected` , `all`
- __mat_icon__: material icon to be shown on the left of the associated button.  
  If not provided, the actions should contain at least _label_ or _icon_.  
  - _Type_: string
  - _Example_: "download",
  - _Notes_: at least on of the following properties should be present: `label` or `icon` or `mat_icon` 
- __icon__: icon to be shown on the left of the associated button.  
  If not provided, the actions should contain at least _label_ or _mat_icon_.  
  All browser supported formats are accepted. The path must be a valid one.  
  - _Type_: string
  - _Example_: "/assets/icons/jupyter_logo.png",
  - _Notes_: at least on of the following properties should be present: `label` or `icon` or `mat_icon` 
- __type__: type of action 
  - _Type_: string
  - _Allowed values_: 
    - `form`
    The action will be triggered as a form submission
    - `json_download`
    The action will be triggered with a json payload and it expects to save the results as a file
- __url__: this is the url to be used when triggering the request.  
  - _Type_: string 
  - _Example_: "https://zip.scicatproject.org/download/all",
- __target__ : if type is set to `form`, it specified if the form should be submitted in the current browser windows/tab or in an another.  
Please review the offical documentation for this attribute https://www.w3schools.com/TAgs/att_form_target.asp
  - _Type_: string  
  - _Example_: ": "_blank",
- __enabled__: condition when the action can be triggered and the related button should be active.  
  The string may contains the keywords listed below and any logical expression of them.  
  - _Type_: string
  - _Examples_: "#SizeLimit"  or  "#Selected && #SizeLimit",
  - _Keywords_: The string can contain any of the following keywords in a logical expression.   
    The expression will be calculated everytime one of the keywords changes value.
    - #SizeLimit :   
      True if the total size of the files is below the limit indicated in configuration under the key `maxDirectDownloadSize`.
    - #Selected :
      True if one or more files are selected in the list.  
- __authorization__: indicate which user has access to the action and can see the related button.  
  - _Type_: string[]
  - _Examples_: ["#datasetAccess", "#datasetPublic"]
  - _Allowed values_: 
    - "#datasetAccess": users that have access to the dataset
    - "#datasetPublic": if the dataset is public
- __payload__: json string to be send in the request body when the action is triggered. 
  Make sure that the string is properly escaped
  - _Type_: string
  - _Example_:  
    Raw (as it should be in the action configuration )
    ```
    "{\"template_id\":\"c975455e-ede3-11ef-94fb-138c9cd51fc0\",\"parameters\":{\"dataset\":\"{{ datasetPid }}\",\"directory\":\"{{ sourceFolder }}\",\"files\": {{ filesPath }},\"jwt\":\"{{ jwt }}\",\"scicat_url\":\"https://my.scicat.instance\",\"file_server_url\":\"sftserver2.esss.dk\",\"file_server_port\":\"22\"}}",
    ```
    Formatted (for human consumption)
    ```
    {
      "template_id": "c975455e-ede3-11ef-94fb-138c9cd51fc0",
      "parameters": {
        "dataset": "{{ datasetPid }}",
        "directory": "{{ sourceFolder }}",
        "files": {{ filesPath }},
        "jwt": "{{ jwt }}",
        "scicat_url": "https://my.scicat.instance",
        "file_server_url": "my.sft.server",
        "file_server_port": "22"
      }
    }
    ```
  - _Keywords_: The string can contain the following keywords. They will be substituted with the value indicated:
    - {{ datasetPid }}: pid of the current dataset 
    - {{ sourceFolder }}: source folder of the current dataset
    - {{ jwt }}: curren tJWT token of the user logged in
    - {{ filesPath }}: array containing the list of the the file paths associated with the current dataset. The list might contain all the files or only the selected ones, depending on the value of the field _files_.
- __filename__: name of the file that should be saved by the browser if the action type is set to _json_download_.
  - _Type_: string 
  - _Example_: "{{ uuid }}.ipynb"
  - _Keywords_: The string can contain any of the following keywords. They are substituted with the value indicated.
    - {{ uuid }}: random uuid v4 generated for each request.


## Example
The following is the configuration example provided together with the code.
The configuration below will create the following 5 buttons under the "Datafiles" tab of the dataset in the order provided:
1. Notebook Selected  
   Create a jupyter notebook properly populated in order to download the selected files and use the dataset metadata in the python environment.
   The jupyter notebook is created by a different services that needs to be correctly configured and it is assumed that expects in input data coming from a submission form.
2. Notebook All (Form)  
   Create a jupyter notebook properly populated in order to download all the files and use the dataset metadata in the python environment.
   The jupyter notebook is created by a different services that needs to be correctly configured and it is assumed that expects in input data coming from a submission form.
3. Notebook All (Download JSON)  
   Create a jupyter notebook properly populated in order to download all the files and use the dataset metadata in the python environment.
   The jupyter notebook is created by a different services that needs to be correctly configured. We assume that the service expects input data in a specific json format specified under payload.
4. Download Selected  
   Triggers the download of a zip file containing only the selected files.
   The zip file is created by an external service, which needs to be properly configured.
5. Donwload ASll  
   Triggers the download of a zip file containing all the dataset files
   The zip file is created by an external service, which needs to be properly configured.

Configuration
```
{
  "datafilesActions" : [
    {
      "id": "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      "order": 5,
      "label": "Download All",
      "files": "all",
      "mat_icon": "download",
      "type": "form",
      "url": "https://zip.scicatproject.org/download/all",
      "target": "_blank",
      "enabled": "#SizeLimit",
      "authorization": ["#datasetAccess", "#datasetPublic"]
    },
    {
      "id": "3072fafc-4363-11ef-b9f9-ebf568222d26",
      "order": 4,
      "label": "Download Selected",
      "files": "selected",
      "mat_icon": "download",
      "type": "form",
      "url": "https://zip.scicatproject.org/download/selected",
      "target": "_blank",
      "enabled": "#Selected && #SizeLimit",
      "authorization": ["#datasetAccess", "#datasetPublic"]
    },
    {
      "id": "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      "order": 2,
      "label": "Notebook All (Form)",
      "files": "all",
      "icon": "/assets/icons/jupyter_logo.png",
      "type": "form",
      "url": "https://www.scicat.info/notebook/all",
      "target": "_blank",
      "authorization": ["#datasetAccess", "#datasetPublic"]
    },
    {
      "id": "0cd5b592-0b1a-11f0-a42c-23e177127ee7",
      "order": 3,
      "label": "Notebook All (Download JSON)",
      "files": "all",
      "type": "json-download",
      "icon": "/assets/icons/jupyter_logo.png",
      "url": "https://www.sciwyrm.info/notebook",
      "target": "_blank",
      "authorization": ["#datasetAccess", "#datasetPublic"],
      "payload": "{\"template_id\":\"c975455e-ede3-11ef-94fb-138c9cd51fc0\",\"parameters\":{\"dataset\":\"{{ datasetPid }}\",\"directory\":\"{{ sourceFolder }}\",\"files\": {{ filesPath }},\"jwt\":\"{{ jwt }}\",\"scicat_url\":\"https://my.scicat.instance\",\"file_server_url\":\"my.sft.server\",\"file_server_port\":\"22\"}}",
      "filename": "{{ uuid }}.ipynb"
    },
    {
      "id": "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      "order": 1,
      "label": "Notebook Selected",
      "files": "selected",
      "icon": "/assets/icons/jupyter_logo.png",
      "type": "form",
      "url": "https://www.scicat.info/notebook/selected",
      "target": "_blank",
      "enabled": "#Selected",
      "authorization": ["#datasetAccess", "#datasetPublic"]
    }
  ]
}
```