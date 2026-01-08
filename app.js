const amqp = require('amqplib');
const express = require('express');
const cors = require('cors');
const app = express();
const router = express.Router();

const path = __dirname + '/';
//const port = 3000;

// Get Environment Variables
const nodeName = process.env.NODE_NAME;
const podName = process.env.POD_NAME;
const rabbitmq = process.env.RABBITMQ;
const javaAPI = process.env.JAVA_API;

//console.log(podName);

// Function for RabbitMQ to send message to queue
async function sendToRabbitMQ(queueName, message) {
  let connection;
  try {
      connection = await amqp.connect('amqp://' + rabbitmq +'') // Replace with your RabbitMQ connection string
      const channel = await connection.createChannel();

      await channel.assertQueue(queueName, {
          durable: false // Set to true if you want messages to persist across RabbitMQ restarts
      });

      channel.sendToQueue(queueName, Buffer.from(message));

      await channel.close();
  } catch (error) {
      console.error('Error sending message to RabbitMQ:', error);
  } finally {
      if (connection) {
          await connection.close();
      }
  }
}

// Function to fetch the event data from the Java API
async function fetchUsersFromJavaAPI(eventID) {
  try {
    const response = await fetch('http://' + javaAPI + ':8080/api/' + eventID);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const stock = await response.json();
    return stock;
  } catch (error) {
    return "error";
  }
}


// Function to create Event ID
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function dataQualityCheck(data) {
  var tickers = ["MSFT", "AAPL", "GOOG", "AMZN", "NVDA", "TSLA", "META"];
  dataIsGood = false;
  
  tickers.forEach(ticker => {
    if(ticker === data)
      dataIsGood = true;
  });

  return dataIsGood;
}

function dataIntegrityCheck(data) {
  if(data.length < 1)
          return "none!";

  re = /^[a-zA-Z0-9]*$/;
  if(!re.test(data))
          return "wrong!";

  return true;
}

router.use(function (req,res,next) {
  console.log('/' + req.method);
  next();
});

// API route for the index
router.get('/', function(req,res){
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');

  const data = {
    podName: podName,
    nodeName: nodeName
  };

  res.render(path + 'assets/views/index', data);
 
});

// API route to fetch the event data from the Java API
router.get('/api/:eventID', function(req,res){
  try {
    const eventID = req.params.eventID;

    if(typeof dataIntegrityCheck(eventID) != "boolean" || eventID.length != 20) {
      throw {eventID: null, message: "Event ID is not valid"};
    }

    res.statusCode = 200;
    fetchUsersFromJavaAPI(eventID).then(stock =>res.json(stock));
  }
  catch(error) {
    res.status(201).json({eventID: null, message: "Event ID is not valid"});
  }
});

// API route to begin the event
router.post('/api/start', function(req,res){
  try {
    const data = req.body;

    var event = data.event;

    if(event === "start") {
      var ticker = data.ticker;

      if(!dataQualityCheck(ticker))
        throw {eventID: null, ticker: ticker};

      const timestamp = new Date();

      const eventId = makeid(20);
      var message = {
        eventID: eventId,
        ticker: ticker,
        timestamp: timestamp
      };

      const jsonString = JSON.stringify(message);    
      sendToRabbitMQ('my_queue', jsonString);

      res.status(201).json(message);
    }

    else {
      res.status(201).json({event: event, message: "Could not process the event"});
    }
  }
  catch(error) {
     res.status(201).json(error);
  }

});

// API route to render the chart
router.get('/cschart/:eventID', function(req,res){
  const eventID = req.params.eventID;
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  const data = {
    eventId: eventID
  };

  res.render(path + 'assets/views/csChart', data);
});

// Middleware to parse JSON and URL-encoded data in the request body
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.static(path));
app.use(cors({
  origin: 'http://localhost',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/', router);

// Set EJS as the view engine
app.set('view engine', 'ejs');

//app.listen(port, function () {
//  console.log('Example app listening on port 3000!')
//})

module.exports = app;