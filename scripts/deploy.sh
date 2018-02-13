#!/bin/bash 

export DACATHOME=~/dev/psi 
export KUBECONFIG=~/dev/psi/catamel-psisecrets/server/kubernetes/admin.conf

envarray=(development qa production)

kubectl config use-context admin@kubernetes

for ((i=0;i<${#envarray[@]};i++)); do 
   cd $DACATHOME/catanie 
   export CATANIE_IMAGE_VERSION=$(git rev-parse HEAD)
   export LOCAL_ENV="${envarray[i]}"
   read -r -p "Deploy to $LOCAL_ENV? [y/N] " response
   if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
   then
      echo "Building release"
      ./node_modules/@angular/cli/bin/ng build --environment $LOCAL_ENV -op dist/$LOCAL_ENV
      docker build --network=host -t registry.psi.ch:5000/egli/catanie:$CATANIE_IMAGE_VERSION$LOCAL_ENV --build-arg env=$LOCAL_ENV .
      docker push registry.psi.ch:5000/egli/catanie:$CATANIE_IMAGE_VERSION$LOCAL_ENV
      cd  $DACATHOME/catamel-psiconfig/server/kubernetes/helm/ 
      echo "Deploying to Kubernetes"
      helm del --purge catanie-$LOCAL_ENV
      helm install dacat-gui --name catanie-$LOCAL_ENV --namespace $LOCAL_ENV --set image.tag=$CATANIE_IMAGE_VERSION$LOCAL_ENV
   else
      continue
   fi
done
