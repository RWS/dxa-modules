// Dynamic Documentation GUI build pipeline
// Allocation of node for execution of build steps
pipeline {
    node("dxadocker") {
        dir("build\\dxa-modules\\dynamic-documentation-gui") {

            stages {
                stage("Building DD GUI") {
                    steps {
                        sh "mvn clean install"
                    }
                }
            }

                // NOTE: Publish to Nexus only from 'develop' branch
                /* stage("Publishing DD GUI to Nexus") {
                    when {
                        branch 'development'
                    }
                    steps {
                        //TODO: Implement publishing to Nexus(Ticket in Jira https://jira.sdl.com/browse/TSI-3512)
                    }
                } */
            }

            post {
                always {
                    archiveArtifacts artifacts: 'target/gui/**', fingerprint: true
                }
            }

        }
    }
}
