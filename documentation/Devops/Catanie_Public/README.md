## Catanie Public

As of right now, this is a private fork of the `Catanie` project and is focused on the following goals:

* Access to public datasets in accordance with EU policy and regulation
* Public facing endpoint
* Share as much code with `Catanie` as possible
* Remove site specific login functionality (LDAP) but maybe allow logins via OpenID etc
* Provide unique identifier for referencing in publications


## Status

Right now, it is an early work in progress and should **not** be open sourced because it stores passwords.

### master

This branch is a fork of Catanie and needs some modules removed and/or changed.

### python

If there is a preference to serve pages server side, then there is a branch to run catanie as a Tornado web server, allowing it to plug in with the file server plans in the scicat roadmap.