pipeline {
  agent {
    kubernetes {
      label 'mypod'
      defaultContainer 'jnlp'
      yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    some-label: some-label-value
spec:
  containers:
  - name: node
    image: node:10.15
    command:
    - cat
    tty: true
"""
    }
  }
  stages {
    stage('Test') {
      steps {
        container('node') {
          checkout scm
          sh 'npm install'
          sh 'npm test'
          junit 'test-results.xml'
          stash includes: 'Dockerfile,src/**.*,package.json', name: 'node-app'
        }
      }
    }
    stage('Docker Build') {
        agent {label 'host'}
        steps {
            unstash 'node-app'
            bat 'docker build -t rnonaka/hello-express .'
            bat 'docker push rnonaka/hello-express'
        }
    }
    stage('Deploy') {
        agent {label 'host'}
        steps{
        	bat 'kubectl delete deploy/hello-express || true'
        	bat 'kubectl delete service/hello-express || true'
        	bat 'kubectl run hello-express --image=rnonaka/hello-express:latest --port=3000'
        	bat 'kubectl expose deployment/hello-express --type="NodePort" --port 3000'
        	bat 'kubectl get service/hello-express'
        }
    }
  }
}
