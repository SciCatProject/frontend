
TAG    			:= $$(git describe --tags)
REGISTRY		:= registry.nersc.gov
PROJECT 		:= als
REGISTRY_NAME	:= ${REGISTRY}/${PROJECT}/${IMG}

NAME_CATANIE  	:= catanie
IMG_CATANIE  		:= ${NAME_CATANIE}:${TAG}
REGISTRY_CATANIE	:= ${REGISTRY}/${PROJECT}/${NAME_CATANIE}:${TAG}



# run from catani root dir (../.. from here), run
#		make -C CI/ALS <taarget>

.PHONY: build_catanie_dev build_catanie_prod push_catanie_prod


build_catanie_dev:
	@echo "tagging to: " ${IMG_CATANIE}    ${REGISTRY_CATANIE}
	@docker build -t ${IMG_CATANIE} -f Dockerfile.dev ../../
	@echo "tagging to: " ${IMG_CATANIE}    ${REGISTRY_CATANIE}
	@docker tag ${IMG_CATANIE} ${REGISTRY_CATANIE}



build_catanie_staging:
	@echo "tagging to: " ${IMG_CATANIE}-staging    ${REGISTRY_CATANIE}-staging
	@docker build -t ${IMG_CATANIE}-staging -f Dockerfile.staging ../../
	@echo "tagging to: " ${IMG_CATANIE}-staging    ${REGISTRY_CATANIE}-staging
	@docker tag ${IMG_CATANIE}-staging ${REGISTRY_CATANIE}-staging

push_catanie_staging:
	@echo "Pushing " ${REGISTRY_CATANIE}-staging
	@docker push ${REGISTRY_CATANIE}-staging



build_catanie_prod:
	@echo "tagging to: " ${IMG_CATANIE}-prod    ${REGISTRY_CATANIE}-prod
	@docker build -t ${IMG_CATANIE} -f Dockerfile.prod ../../
	@echo "tagging to: " ${IMG_CATANIE}-prod    ${REGISTRY_CATANIE}-prod
	@docker tag ${IMG_CATANIE}-prod ${REGISTRY_CATANIE}-prod

	
push_catanie_prod:
	@echo "Pushing " ${REGISTRY_CATANIE}-prod
	@docker push ${REGISTRY_CATANIE}-prod

