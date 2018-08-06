
# Configuration of Catamel for Specific Organisations

This repository requires both [configuration](https://gitlab.psi.ch/MELANIE/catamel-psiconfig) files and [secrets](https://gitlab.psi.ch/MELANIE/catamel-psisecrets) to run. These should be specific to your organisation and all generic code for `catamel` is stored in this repo.

This guide will explain how to integrate the 3 repositories and configure a running instance.

## Config

The config repo contains all configuration code and should contain both a `client` and a `server` folder.

### Client

Collects PSI specific client side code which uses the loopback backend API.

The folder ADSync contains the code which synchronizes the user and group information into the respective collections inside the loopback backend

The folder archive contains code to communicate with the archive system

The folder beamlines contains the ingest scripts for the respective beamlines or instruments

The folder proposals contains the code to digest the proposal data from the DUO application

### Server

The server contains specific deployment code for kubernetes or a similar tool that your organisation may use.

## Secrets

The secrets repo contains information only to be used by the server side of catamel.

### Server

Certificates, secrets and passwords used by default accounts, as well as connection files for databases used.

## Using these repos

The trivial option is to simply clone:

`git clone <url-to-config>; git clone <url-to-secrets>; git clone <url-to-catamel>`

all 3 repos into the same directory. From there, you can run:

`cp -r config/ catamel/; cp -r secrets/catamel`

Using symbolic linking will not work as there are relative paths used in some of the config files.

### Advanced

TODO : git hook and similar scripting options



