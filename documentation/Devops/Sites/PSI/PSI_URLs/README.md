# PSI URLs

These are the urls in use at PSI for all of the services. Currently \(8th March 2018\), the Node-RED deployments cannot be accessed using their URLs and a workaround for accessing them can be seen in the Node-RED section.

## Environments:

* development
* qa
* staging
* production

## Services

* discovery.psi.ch - Web Frontend
* dacat.psi.ch - API Server
* aries.psi.ch - Node-RED ingestor \(note that the ending slash is needed for correct loading\)
  * /jobs/ -  Jobs ingestor
  * /&lt;BEAMLINE&gt;/ - beamline name
* hal.psi.ch - RabbitMQ

### Node-RED

Nginx is unable to locate the Node-RED instances currently, so the `aries.psi.ch` is not working. You will need `kubectl` installed in your system \(and available in your path\).

1. `kubectl get pods -n <NAMESPACE>`
2. `kubectl port-forward <PODNAME> 8001:1880`
3. `Navigate to localhost:8001`
4. Login with admin credentials \(can be found in the `secrets` section of the Kubernetes Web dashboard.



