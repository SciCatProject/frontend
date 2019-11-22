# Catanie SciCat Client



<img src="https://github.com/SciCatProject/catanie/blob/develop/src/assets/images/esslogo.png" alt="sci-cat-logo" width="100">



[![Build Status](https://travis-ci.org/SciCatProject/catanie.svg?branch=develop)](https://travis-ci.org/SciCatProject/catanie)
[![DeepScan grade](https://deepscan.io/api/projects/887/branches/19862/badge/grade.svg)](https://deepscan.io/dashboard#view=project&pid=887&bid=19862) [![DOI](https://zenodo.org/badge/106383330.svg)](https://zenodo.org/badge/latestdoi/106383330) [![Greenkeeper badge](https://badges.greenkeeper.io/SciCatProject/catanie.svg)](https://greenkeeper.io/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Coverage Status](https://coveralls.io/repos/github/SciCatProject/catanie/badge.svg?branch=develop)](https://coveralls.io/github/SciCatProject/catanie?branch=develop)

## Summary

SciCat is a data catalogue web application to provide a searchable interface for datasets, publish DOIs, 
as well as the option to carry out actions (i.e. archiving and publishing) and acts as a place to reference datasets used in publications.
See documentation at [scicatproject](https://scicatproject.github.io/)

# Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
Angular v8 or higher
npm version 6 or higher
node version 10 or higher
```

### Installing

Use git to clone the repository
```
git clone https://github.com/SciCatProject/catanie
cd catanie
```
First install the required modules
```
npm install
```
Then build with the Angular CLI
```
npx ng build
```

You can deploy a test server with the following command:

```
npx ng serve 
```


## Running the unit tests

To run the unit tests, type:
```
npm test
```


### End to end tests

To run the end to end tests, type:

```
npm run e2e
```



## Deployment

Deploy with Docker

## Built With

* [NPM](http://npmjs.com) - node package manager
* [Node](https://nodejs.org/) - node javascript runtime
* [Angular](https://angular.io) - Web framework

## Contributing

Please read [CONTRIBUTING.md](https://github.com/SciCatProject/catanie/blob/develop/documentation/Catanie/Contributing.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/SciCatProject/catanie/tags). 



## License

This project is licensed under the GPL License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

Scicat is developed at PSI, ESS and MAXIV with in-kind funding from ESS and from the European Union Framework Programme for Research and Innovation Horizon 2020, under grant agreement 676548, “BrightnESS”.

