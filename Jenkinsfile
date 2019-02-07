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
    stage('test') {
      steps {
        container('node') {
          checkout scm
          sh 'npm install'
          sh 'npm test'
          junit 'test-results.xml'
        }
      }
    }
    stage('build') {
        agent {label 'host'}
        steps {
            checkout scm
            bat 'docker build -t rnonaka/hello-express .'
        }
    }
  }
}