## CI

The primary repositories for the SciCat code is hosted at `gitlab.psi.ch`. However, these repositories are also mirrored to [https://github.com/scicatproject. ](https://github.com/scicatproject)

NOTE: \*NEVER\* push to the Github repos, your remote should \*always\* be the Gitlab repository.

## Travis \(Github\)

Travis CI is a build system available to Github repositories and provides email feedback \(among other options\). It has been enabled for Catanie and the details of the build can be seen in `.travis-ci.yml` in the root of the repository.

## Jenkins

Jenkins is running inside the Kubernetes cluster and uses dynamic pod provisioning for builds; this means that there are no Jenkins slaves constantly available.

There are currently 2 main build jobs:

1. Catanie-GL
2. Catamel-GL

Each of these jobs is triggered every evening at 8pm and can also be triggered by a webhook.

#### Git hooks

Inside the `client` and `server` folder of the `catamel-psiconfig` repo, is a file \(`post-push`\) that can be copied into the `.git/hooks` folder for Catanie and Catamel. Inside this file is a curl command that triggers the job to build after every push \(using the webhook\).

#### Jenkinsfile

It is common practice to place build and config files in the root of a repository \(this is typically where a system will look for it\). However, because of the sites developing with SciCat, our build systems all differ slightly. For this reason, the Jenkinsfile is place in `CI/PSI/Jenkinsfile`, this also contains other files necessary for the builds to succeed.

#### Builds

Jenkinsfile follow the Groovy syntax \(similar to Java\) and the [documentation ](https://jenkins.io/doc/book/pipeline/jenkinsfile/)is more than adequate.

