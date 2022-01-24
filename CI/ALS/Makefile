
TAG    			:= $$(git describe --tags)
REGISTRY		:= registry.nersc.gov
PROJECT 		:= als
REGISTRY_NAME	:= ${REGISTRY}/${PROJECT}/${IMG}

NAME_SCICAT_FRONTEND  		:= scicat-frontend
IMG_SCICAT_FRONTEND  		:= ${NAME_SCICAT_FRONTEND}:${TAG}
REGISTRY_SCICAT_FRONTEND	:= ${REGISTRY}/${PROJECT}/${NAME_SCICAT_FRONTEND}:${TAG}



# run from scicat frontend root dir (../.. from here), run
#		make -C CI/ALS <target>

.PHONY: build_scicat_frontend_dev build_scicat_frontend_prod push_scicat_frontend_prod


build_scicat_frontend_dev:
	@echo "tagging to: " ${IMG_SCICAT_FRONTEND}    ${REGISTRY_SCICAT_FRONTEND}
	@docker build -t ${IMG_SCICAT_FRONTEND} -f Dockerfile.dev ../../
	@echo "tagging to: " ${IMG_SCICAT_FRONTEND}    ${REGISTRY_SCICAT_FRONTEND}
	@docker tag ${IMG_SCICAT_FRONTEND} ${REGISTRY_SCICAT_FRONTEND}



build_scicat_frontend_staging:
	@echo "tagging to: " ${IMG_SCICAT_FRONTEND}-staging    ${REGISTRY_SCICAT_FRONTEND}-staging
	@docker build -t ${IMG_SCICAT_FRONTEND}-staging -f Dockerfile.staging ../../
	@echo "tagging to: " ${IMG_SCICAT_FRONTEND}-staging    ${REGISTRY_SCICAT_FRONTEND}-staging
	@docker tag ${IMG_SCICAT_FRONTEND}-staging ${REGISTRY_SCICAT_FRONTEND}-staging

push_scicat_frontend_staging:
	@echo "Pushing " ${REGISTRY_SCICAT_FRONTEND}-staging
	@docker push ${REGISTRY_SCICAT_FRONTEND}-staging



build_scicat_frontend_prod:
	@echo "tagging to: " ${IMG_SCICAT_FRONTEND}-prod    ${REGISTRY_SCICAT_FRONTEND}-prod
	@docker build -t ${IMG_SCICAT_FRONTEND} -f Dockerfile.prod ../../
	@echo "tagging to: " ${IMG_SCICAT_FRONTEND}-prod    ${REGISTRY_SCICAT_FRONTEND}-prod
	@docker tag ${IMG_SCICAT_FRONTEND}-prod ${REGISTRY_SCICAT_FRONTEND}-prod

	
push_scicat_frontend_prod:
	@echo "Pushing " ${REGISTRY_SCICAT_FRONTEND}-prod
	@docker push ${REGISTRY_SCICAT_FRONTEND}-prod

