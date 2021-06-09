peline {
  agent any
  
   stages {
    // Kubenetes上にコンテナを起動してテスト実行
    stage('Test') {
      // 起動するコンテナのテンプレートを設定
      agent {
        kubernetes {
          containerTemplate {
            name 'node'
            image 'node:10.15'
            ttyEnabled true
          command 'cat'
          }
        }
      }
      steps {
        container('node') {
          checkout scm
          sh 'npm install'
          sh 'npm test'
          junit 'test-results.xml'
        }
      }
    }
    // Docke Buildして、Docker HubへPush
    stage('Docker Build') {
        agent {label 'master'}
            steps {
                checkout scm
                //sh 'docker build -t rnonaka/hello-express .'
                //sh 'docker push rnonaka/hello-express'
                sleep 5
                echo 'dummy step'
            }
    }
    // manifest fileを使って使ってアプリをKubenetesへデプロイ
    stage('Deploy') {
        agent {label 'master'}
        steps{
            echo 'test'
        	sh '/usr/local/bin/kubectl delete deploy sample-deployment || true'
        	sh '/usr/local/bin/kubectl delete service hello-express || true'
        	sh '/usr/local/bin/kubectl apply -f ./kubernetes/deployment.yaml'
        	sh '/usr/local/bin/kubectl apply -f ./kubernetes/sample-service.yaml'
        	sh '/usr/local/bin/kubectl get service hello-express'
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
