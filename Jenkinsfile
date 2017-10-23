
node {
       stage('Checkout'){

          checkout scm
       }


       stage('Build Docker'){

            sh 'docker build -f Dockerfile.test . -t catanie_test'
       }

}
