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