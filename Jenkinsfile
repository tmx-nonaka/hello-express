pipeline {
  // KubenetesのPodをビルドエージェントとして指定
  // プロビジョニングするPodはyamlで定義
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
    // nodeのコンテナ内でテスト実行
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
    // ホストマシン上でDocke Buildして、Docker HubへPush
    stage('Docker Build') {
        agent {label 'host'}
        steps {
            checkout scm
            bat 'docker build -t rnonaka/hello-express .'
            bat 'docker push rnonaka/hello-express'
        }
    }
    // アプリをKubernetes上にデプロイ
    // 手抜きでyamlは書いてない
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
  // ビルド結果をSlackへ通知
  post {
  	success {
  		slackSend color: 'good', message: "Job ${env.JOB_NAME}:#${env.BUILD_NUMBER} is Succecful. (<${env.BUILD_URL}|Open>)"
  	}
  	unstable {
  		slackSend color: 'warning', message: "Job ${env.JOB_NAME}:#${env.BUILD_NUMBER} is Unstable. (<${env.BUILD_URL}|Open>)"
  	}
  	failure {
  		slackSend color: 'danger', message: "Job ${env.JOB_NAME}:#${env.BUILD_NUMBER} is Failure. (<${env.BUILD_URL}|Open>)"
  	}
  }
}
