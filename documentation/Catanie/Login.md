# Login


Two login routes are provided - for functional accounts and for AD/LDAP logins.

Loopback provides a UserIdentity for third party logins, (e.g. AD/LDAP, google, Twitter etc) 
A document is created in the db.UserIdentity collection.

The UserIdentity is fetched from MongoDB and stored in the ngrx store, (```store.user.userIdentity```) where 
it is used to access e.g. email for job initiators.

For non-third party logins, no UserIdentity is created. In this case, an ngrx userIdentity is 
created in the store, with relevant information copied from ```store.user```
