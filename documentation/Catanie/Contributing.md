# Contributing

There are 3 core ways to get involved with the Data Catalogue project:

1. Documentation - Fixing errors, covering weaker areas, adding examples
2. Gitlab Issues - This should be the first area to focus on for those that want to amend the code. To see how the project is developed, see the [Git Workflow page.](/./Devops/General/Development_Methodology/git_workflow.md)
3. Testing

For information about the development method we follow, please check [Development Methodology.](/./Devops/General/Development_Methodology/git_workflow.md)

## Issues

Issues are handled within the Gitlab Issue tracker and should follow the template:

```markdown
## Issue Name

### Summary

### Steps to Reproduce

### Current Behaviour

### Expected Behaviour

### Extra Details

Here you should include details about the system (if it is unique) and possible information about a fix (feel free to link to code where relevant). Screenshots/GIFs are also fine here.

```



## Merge Requests

There should be **no** pushing directly to the `master` or `develop` branches. To implement a fix, one should open a branch with the naming: `hotfix/ISSUE-NAME` from the `develop` branch and complete all work there. When it is complete, a Merge Request should be opened that follows this template:

```markdown
## Description

## Motivation 

Link to any open issues here

## Fixes:

* 
*  

## Changes:

* 
* 

## Tests included/Docs Updated?

- [ ] Included for each change/fix?
- [ ] Passing? (Merge will not be approved unless this is checked)
- [ ] Docs updated?

## Extra Information/Screenshots
```

When the request is created, it should be assigned to any other appropriate team member with `develop` as the target branch. Tests **must** be written for all features/changes made and any major changes should be updated in the `docs` repo.





