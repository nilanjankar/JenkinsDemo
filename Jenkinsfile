pipeline {
    agent any

    parameters {
        choice(name: 'APP_NAME', choices: ['app1', 'app2'], description: 'Which app to build')
        choice(name: 'ENV_TARGET', choices: ['staging', 'prod'], description: 'Deploy target')
        string(name: 'IP_RANGE', defaultValue: '10.0.0.0/24', description: 'IP range (access control)')
    }

    environment {
        SONARQUBE_SERVER = 'SonarQube'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Load Config') {
            steps {
                script {
                    def configFilePath = "${params.APP_NAME}/app-config.yaml"
                    def config = readYaml file: configFilePath

                    env.SKIP_TESTS = config.skipTests.toString()
                    env.SKIP_DEPLOY = config.skipDeploy.toString()
                    env.APP_PORT = config.port.toString()
                    env.ROUTES = config.envRoutes[params.ENV_TARGET].join(', ')
                }
            }
        }

        stage('Install & Test') {
            when { expression { env.SKIP_TESTS != "true" } }
            steps {
                dir("${params.APP_NAME}") {
                    sh 'npm install'
                    sh 'npm test'
                    junit 'test-results.xml'
                }
            }
        }

        stage('SonarQube') {
            steps {
                dir("${params.APP_NAME}") {
                    withSonarQubeEnv('SonarQube') {
                        sh 'sonar-scanner'
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('IP Range Validation') {
            steps {
                script {
                    if (params.ENV_TARGET == 'prod' && params.IP_RANGE == '10.0.0.0/24') {
                        error("Prod deploy is blocked for IP range: ${params.IP_RANGE}")
                    }
                }
            }
        }

        stage('Deploy to ' + params.ENV_TARGET) {
            when { expression { env.SKIP_DEPLOY != "true" } }
            steps {
                echo "Deploying ${params.APP_NAME} to ${params.ENV_TARGET} on port ${env.APP_PORT}"
                echo "Routing to regions: ${env.ROUTES}"
                sh "echo 'Simulated deploy for ${params.APP_NAME} to ${params.ENV_TARGET}'"
            }
        }

        stage('Manual Approval for Prod') {
            when { expression { params.ENV_TARGET == 'prod' } }
            steps {
                input message: 'Approve prod deployment?', ok: 'Deploy'
            }
        }
    }

    post {
        always {
            echo "Pipeline completed for ${params.APP_NAME}"
        }
        failure {
            mail to: 'team@example.com',
                 subject: "Pipeline Failed: ${env.JOB_NAME}",
                 body: "Pipeline for ${params.APP_NAME} failed."
        }
    }
}
