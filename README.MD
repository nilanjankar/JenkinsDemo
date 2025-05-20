
# What it does


# Version1
# Includes



#  FIle Structure
PIPELINEDEMO/
├── Jenkinsfile                    ← ✅ Central, shared pipeline
├── docker-compose.yml
├── jenkins/
│   └── Dockerfile
├── app1/
│   ├── app/
│   │   └── index.js
│   ├── test/
│   │   └── app.test.js
│   ├── package.json
│   ├── sonar-project.properties
│   ├── utils.groovy               ← Optional shared logic
│   └── app-config.yaml            ← ✅ Per-app config file here
├── app2/
│   ├── app/
│   ├── test/
│   ├── package.json
│   ├── sonar-project.properties
│   ├── utils.groovy
│   └── app-config.yaml            ← ✅ Same idea

