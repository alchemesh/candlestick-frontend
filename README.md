# Candlestick Pattern - NodeJS Frontend

The NodeJS frontend for the Candlestick Pattern application.

The NodeJS frontend is used for GUI interface for the user. The application is displayed and the event is triggered when the user submits their choice. This event is pushed to a queue (RabbitMQ) for processing by the other microservices from the stack. After the event has been completed, a chart is graphed using ChartJS, displaying the stock the user chose and the daily movement in candlesticks for the duration given. The application, then determines if a candlestick pattern is found within the duration period. If found, a description of that pattern is displayed, as well as the potential/expected short to mid term price movement. 

NodeJS Endpoints

* /
    - Get the root index
    - Provides the GUI for the users choice
* /api/start
    - Get the root index
    - Provides the GUI for the users choice
* /api/:eventID}
    - Get endpoint for the event data
    - Retrieves event data from the MYSQL database
* /cschart/:eventID}
    - Get endpoint for the event data
    - Retrieves event data from the MYSQL database

## How to use ##

Deploy the image using Docker, Kubernetes, or any other container orchestration service using the docker io image: sabatiel180/candlestick-frontend-app

### Environment variables ###

The docker image needs 2 environment variables to function which are used to connect to RabbitMQ and the Java API
- RABBITMQ
- JAVA_API

***Note: This application is a producer, and therefore will not perform any function without the queue. The Java API is just as equally important, for the data can not be retieved without it.***

### Docker ###

#### Docker Build ####
The manual approach can be used by downloading the repository your local machine. Navigate to the folder and run:

docker build -t [your_image_name] .

#### Docker Run ####
Run the image using the environment variables for the RabbitMQ and Java API images.

docker run -itd --env=RABBITMQ=[your_rabbitmq_image_name] --env=JAVA_API=[your_java_api_name] -p 3000:3000 --name [your_container_name] [your_image_name]

Where:
* your_rabbitmq_image_name = (The docker image name for your RabbitMQ instance)
* your_java_api_name = (The docker image name for the Java API instance)
* -p 3000 = (Port the application listens on)
* your_container_name = (The name you want to issue to the running container)
* your_image_name = (The name you used if you built the image manually. Use sabatiel180/candlestick-frontend-app for easier deployment)

Information about deployment for the Java API can be found at [Java API] (https://github.com/alchemesh/candlestick-java-api). RabbitMQ is the queue service used for the application and has its own official image from Docker. No additional configuration is needed for RabbitMQ and can be deployed with the following command:

* docker run -itd --name [your_container_name] rabbitmq:3-management


### Kubernetes ###
The Kubernetes files in this repo can be used as a template for deployment.

#### Deployment ####
The deployment.yaml file will deploy the python backend as a replica set with a name and app labels as candlestick-frontend-app-deploy and candlestick-frontend-app respectfully. ***Note: The RABBITMQ and JAVA_API environment variables are set to the Kubernetes RABBITMQ and Java API deployment service names which should be deployed as well***

#### Service ####
The NodeJS frontend replicaset is deployed as a NodePort service, but the ingress will provide Loadbalancing for the frontend application. The service name, candlestick-frontend-service, is not used by any other application on the stack for communication.