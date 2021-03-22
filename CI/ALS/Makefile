
TAG    			:= $$(git describe --tags)
REGISTRY		:= registry.nersc.gov
PROJECT 		:= als
REGISTRY_NAME	:= ${REGISTRY}/${PROJECT}/${IMG}

NAME_CATANIE  	:= catanie
IMG_CATANIE  		:= ${NAME_CATANIE}:${TAG}
REGISTRY_CATANIE	:= ${REGISTRY}/${PROJECT}/${NAME_CATANIE}:${TAG}



.PHONY: build

hello:
	@echo "Hello" ${REGISTRY}

build_catanie:
	@echo "tagging to: " ${IMG_CATANIE}    ${REGISTRY_CATANIE}
	@docker build -t ${IMG_CATANIE} -f CI/ALS/Dockerfile .
	@echo "tagging to: " ${IMG_CATANIE}    ${REGISTRY_CATANIE}
	@docker tag ${IMG_CATANIE} ${REGISTRY_CATANIE}
 
push_catanie:
	@echo "Pushing " ${REGISTRY_CATANIE}
	@docker push ${REGISTRY_CATANIE}


login:
	@docker log -u ${DOCKER_USER} -p ${DOCKER_PASS}