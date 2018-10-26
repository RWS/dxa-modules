// Dynamic Documentation GUI build pipeline
// Allocation of node for execution of build steps
pipeline {

    agent {
        label 'dxadocker'
    }

    stages {
        stage('Building DD GUI') {
            steps {
                dir("gui") {
                    powershell 'mvn clean install'
                }
            }
        }
        stage('Building DD GUI Boilerplate') {
            steps {
                dir("boilerplate") {
                    powershell 'mvn clean package'
                }
            }
        }
    }

    post {
        always {
            dir("gui") {
                archiveArtifacts artifacts: 'target/gui/**', fingerprint: true
                archiveArtifacts artifacts: 'target/boilerplate/target/*.zip', fingerprint: true
            }
        }
    }
}

