## Building and Editing Locally

`npm i -g gitbook-cli`

`gitbook install`

`gitbook build . docs/`  
The command above could be useful to put into a git hook to ensure that a build is made on each push.

## Summaries

The TOC for a Gitbook is read from the `SUMMARY.md`, this can be handled by the python script: `summary_generator.py`

## Pre Commit Hook

```
#!/bin/sh

cd $DACATHOME/docs
python summary_generator.py
gitbook build . docs/
git add .
```



