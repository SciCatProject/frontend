# Deployment of Catanie and Catamel

The details in this section can apply to both Catamel and Catanie.

Inside each repository, there are folders that contain either:

1. Runnable deployment scripts
2. Snippets with code to get you started on deployment.

## What?

When we say deployment, we mean deploying an application or service from your local machine to a development or production environment.

For the Data Catalogue project, the deployment pipeline requires the following:

1. An application or service \(Catanie or Catamel\)
2. A `dockerfile`
3. A docker registry
4. A `yaml` file for deploying the docker file to Kubernetes \(from the registry\)  OR a Helm chart
5. Connection to your kubernetes server, through `kubectl`

## Current Status

Currently, there is no CI setup for any of the repos in the `DaCat` project.

## How?

First, you must ensure that all environment variables have been configured. Typically, this involves `DACATHOME` and `KUBECONFIG`. Ensure you can proxy to the Kubernetes dashboard through `kubectl proxy`.

If there is a deploy script, just run it. Otherwise, use the notes in the `deployment-snippets` file to build the docker image, push it to the registry and then deploy to all Kubernetes environments.

Open the dashboard and make sure that your app is showing in `Deployments` with a tick. If not, scroll down to `Pods` and you will see your app with some issues, click on the button next to the overflow menu and view the logs.
