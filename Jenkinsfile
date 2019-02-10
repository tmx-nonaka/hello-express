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
        }
      }
    }
    stage('Docker Build') {
        agent {label 'host'}
        steps {
            checkout scm
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
  post {
  	success {
  		slackSend color: 'good', message: 'Build is Successful'
  	}
  	unstable {
  		slackSend color: 'warning', message: 'Some tests is failure'
  	}
  	failure {
  		slackSend color: 'danger', message: 'Build is failure'
  	}
  }
}
