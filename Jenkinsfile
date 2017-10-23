
node {
       stage('Checkout'){

          checkout scm
       }


       stage('Build Docker'){

            sh 'docker build -f Dockerfile.test . -t catanie_test'
       }
       stage('Unit Test Catanie '){
            sh 'docker run  -t catanie_test npm run -- ng test --watch false --single-run true'
       }
       stage('e2e Test Catanie '){
            sh 'docker run  -t catanie_test ./node_modules/\@angular/cli/bin/ng e2e'
       }

}
