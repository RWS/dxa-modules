pipeline {
    agent {
        node { label 'linux&&docker' }
    }

    stages {

        stage('Create the docker builder image(s)') {
            steps {
                script {
                    jdk8BuilderImage = docker.image("maven:3.6-jdk-8-alpine")
                    jdk11BuilderImage = docker.image("maven:3.6-jdk-11-slim")
                }
            }
        }

        stage ('Build with JDK11') {
            steps {
                withCredentials([file(credentialsId: 'dxa-maven-settings', variable: 'MAVEN_SETTINGS_PATH')]) {
                    script {
                        //DXA has to be able to be built on JDK11:
                        jdk11BuilderImage.inside {
                            //DXA has to be able to be build without SDL proprietary dependencies:
                            //sh "cd webapp-java && mvn -B dependency:purge-local-repository -DreResolve=false"
    
                            sh "cd webapp-java && mvn -s $MAVEN_SETTINGS_PATH -B -U clean verify"
                        }
                    }
                }
            }
        }

        stage('Build a branch') {
            when { not { branch 'develop' } }
            // Not on the develop branch, so build it, but do not install it.
            steps {
                withCredentials([file(credentialsId: 'dxa-maven-settings', variable: 'MAVEN_SETTINGS_PATH')]) {
                    script {
                        //Build on JDK8
                        jdk8BuilderImage.inside {
                            sh "cd webapp-java && mvn -s $MAVEN_SETTINGS_PATH -B -U clean verify"
                        }
                    }
                }
            }
        }


        stage('Java build and deploy from develop') {
            when { branch 'develop' }
            steps {
                withCredentials([file(credentialsId: 'dxa-maven-settings', variable: 'MAVEN_SETTINGS_PATH')]) {
                    script {
                        //Build on JDK8 and deploy it to local repository:
                        jdk8BuilderImage.inside {
                            //Main build:
                            sh "cd webapp-java && mvn -s $MAVEN_SETTINGS_PATH -B -U -Dmaven.repo.local=local-project-repo clean source:jar deploy"
                        }
                    }
                }
            }
            post {
                always {
                    junit 'webapp-java/**/target/surefire-reports/*.xml'
                }
            }
        }
    }
}
