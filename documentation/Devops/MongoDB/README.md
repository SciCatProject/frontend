
# Indexing MongoDB

In order to use the search field in SciCat, you must create a text index for the Dataset collection.
This must be done after the dacat database has been created in MongoDB by catamel.
Log into mongodb at the console, e.g. run 


1. If not using Kubernetes
```
mongo dacat
```

or, if using Kubernetes

```
kubectl exec -it <mongo container> mongo dacat
```
and enter

```javascript
db.Dataset.createIndex( { "$**": "text" } )
```

Note: If the index is not created as above, catanie e2e test fails.
