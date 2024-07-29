---
title: Datafiles Action Configuration
created_by: Max Novelli
created_on: 2024/07/29
---
# Datafiles Action Configuration

This page describes how to configure the datafiles actions.  
They are action available to users when vieweing the list of files associated to a dataset which can be viewed under the the Datafiles tab of the dataset details page.  
This actions are shown as button between the page header and the table listing the files.  

There are two properties in the frontend configuration structure that control the datafiles actions: 
- __datafilesActionsEnabled__  
  _Type: boolean_  
  This property enables the action sfeature on the datafiles page.  
- __datafilesActions__  
  _Type: array of ActionConfig_  
  This property contains an array of action definition. Each element defines an individual action that is rendered as button. Each button can have a label or an icon or both.
- __maxDirectDownloadSize__  
  _Type: numeric_   
  This property specify the maximum that total size of the files included in any datafiles action can reach. The quantity is expressed in bytes
  
  
The type _ActionConfig_ define how the button triggring the action is rendered and what the action does.  
The structure of _ActionConfig_ is the following:
- __id__  
  _Type: string_  
  This is a unique id for this action. It does not have any effect on the rendering nor the action. It is included for traceability, management and debugging purposes.  
- __order__  
  _Type: number_  
  This property indicates the order in which this action will be rendered in comparison to the others.  
- __label__  
  _Type: string_  
  This property provides the label rendered in the button. If a label is not needed, leave it empty.  
- __files__  
  _Type: string_
  This property indicates which files should be submitted with the requested action.  
  Currently on the following two values are accepted:  
  - _all_: all the files will be submitted with the action
  - _selected_: only the selected files will be submitted with the action  
- __mat_icon__  
  _Type: string_  
  _Optional_  
  If specified, this is the name of the mat icon that shouls be rendered in the button.  
  If it is not present, no mat icon is shown in the button.
  This icon takes precedence over the property _icon_ explained next.  
- __icon__
  _Type: string_  
  _Optional_  
  If specified, this is the relative path to the icon file to be shown in the related button. It is shown only if property _mat_icon_ is not defined.
  If not present, no icon is shown.  
- __url__   
  _Type: string_  
  This specify the URL where the POST submission should be send.  
- __target__  
  _Type: string_
  Select what is the behaviour when the action is triggered, as if it should reload th epage, open a different tab or browser window.  
  For more information, pleae refer to the official HTML form documentation available at this URL: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#target  
- __method__  
  _Type: string_  
  _Optional_  
  _Default: POST_  
  Underlying form submission method.  
  It is strongly suggested to leaving undefined and use the default which is POST.
  If the action uses a different one, please refer to the official HTML form documentation available at this URL https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method
- __enabled__  
  _Type: string_
  _Optional_  
  This property specify the condition when the action is enabled. It takes precedence over the following property _disabled_. It may can contains the following two keywords alone or combined in a logical expression.  
  - #SizeLimit: true if the total size of the files that will be used in the action is less or equal to  the size specified in the configuration property _maxDirectDownloadSize_
  - #Selected: true if any file has been selected in the list.
- __disabled__  
  _Type: string_  
  _Optional_  
  This property specify when the action is disabled. It is used only if the property _enabled_ is not define. Please check property _enabled_ for the possible values.
- __authorization__  
  _Type: string[]_  
  _Optional_
  __IMPORTANT__: This value is for future use and not yet implemented.
  The intented use is to be able to enable/disable the button based on the groups the user belongs to.

### Behavior
When the action is triggered by a click on the rendered button, a call of the defined tpye, aka POST or GET, is submitted to the URL provided together with the appropriate list of files.  
The action acts like a form submission with all the following arguments:
- target: as defined in the action
- method: as defined in the action or POST if not
- action: set as th eurl provided in the action
and inputs: 
- auth_token: user current token id
- jwt: a jwt token defined for the user
- dataset: dataset pid of the dataset shown
- directory: dataset source folder
- files[]: array of the selected files if action property _files_ is set to _selected_, or all files if action property _files_ is set to _all_


### Examples
This example define the following 4 type of actions:  
1. Download All files  
   It renders a button with the download icon and label _Download All_. When clicked, the action will send a POST request to the url https://download.scicat.org with the list of all files associated with the dataset. It is enabled only when the total size is lower than the max size defined in configuration.
2. Download Selected Files   
   It renders a button with the download icon and label _Download Selected_. When clicked, the action will send a POST request to the url https://download.scicat.org with the list of the dataset's files selected by the user. It is enabled only when the total size is lower than the max size defined in configuration and at least one file is selected.
3. Create and download a notebook which load the dataset metadata and download locally all the files  
   It renders a button with the Jupyter icon and label _Notebook All_. When clicked, the action will send a POST request to the url https://notebook.scicat.org with the list of all the files associated with the dataset. It is always enabled.
4. Create and download a notebook which load the dataset metadata and download locally only the selected files.  
   It renders a button with the Jupyter icon and label _Notebook Selected_. When clicked, the action will send a POST request to the url https://notebook.scicat.org with the list of the dataset's files selected by the user. It is enabled only when at least one file is selected.

Configuration properties are set to the following values:  
```
datafilesActionsEnabled = true

datafilesActions = [
    {
      id: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      order: 4,
      label: "Download All",
      files: "all",
      mat_icon: "download",
      url: "https://download.scicat.org",
      target: "_blank",
      enabled: "#SizeLimit",
    },
    {
      id: "3072fafc-4363-11ef-b9f9-ebf568222d26",
      order: 3,
      label: "Download Selected",
      files: "selected",
      mat_icon: "download",
      url: "https://download.scicat.org",
      target: "_blank",
      enabled: "#Selected && #SizeLimit",
    },
    {
      id: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      order: 2,
      label: "Notebook All",
      files: "all",
      icon: "/assets/icons/jupyter_logo.png",
      url: "https://notebook.scicat.org",
      target: "_blank",
    },
    {
      id: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      order: 1,
      label: "Notebook Selected",
      files: "selected",
      icon: "/assets/icons/jupyter_logo.png",
      url: "https://notebook.scicat.org",
      target: "_blank",
      enabled: "#Selected",
    },
  ]

```

This configuration renders to the following buttons if no files are selected:  
![Datafiles actions when no files are selected](./datafiles_actions_no_file_selected.png "Datafiles actions with no selected files")  

or in this other one when at least one file is selected:  
![Datafiles actions when at least one files are selected](./datafiles_actions_file_selected.png "Datafiles actions with selected files")





