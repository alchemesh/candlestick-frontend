// Patterns to check against
const patterns = [
  {
    name: "Morning Star",
    key: ["spinning top", "invert hammer", "shaven bottom", "doji"],
    keyState: "Bullish",
    duration: 3,
    before: true,
    after: true,
    beforeDay: {"state": "Bearish", "candles": ["Big Red Candle", "Marubozu"]},
    afterDay: {"state": "Bullish", "candles": ["Big Green Candle", "Marubozu"]},
    description: "A Morning Star is a bullish candlestick pattern recognized by traders for signaling a potential trend reversal in a downtrend. Comprised of three distinct candles, it indicates the start of an upward climb."
  },
  {
    name: "Inverted Hammer",
    key: ["hammer", "invert hammer"],
    keyState: "Bullish",
    duration: 3,
    before: true,
    after: true,
    beforeDay: {"state": "Bearish", "candles": ["Big Red Candle", "Marubozu"]},
    afterDay: {"state": "Bullish", "candles": ["Big Green Candle", "Marubozu"]},
    description: "An inverted hammer is a bullish reversal candlestick pattern signaling the potential end of a downtrend, featuring a small body, a long upper shadow (at least twice the body), and little to no lower shadow, showing buyers testing resistance but sellers pulling price back near the open, indicating market exhaustion and a shift towards a potential uptrend."
  },
  {
    name: "Bullish Engulfing",
    key: ["Big Green Candle", "Marubozu"],
    keyState: "Bullish",
    duration: 2,
    before: true,
    after: false,
    beforeDay: {"state": "Bearish", "candles": ["Big Red Candle"]},
    description: "A bullish engulfing candle is a two-candle pattern in technical analysis, signaling a potential uptrend reversal from a downtrend, where a small red (bearish) candle is followed by a larger green (bullish) candle whose body completely covers, or \"engulfs,\" the previous red candle's body, showing buyers overpowering sellers."
  },
  {
    name: "Morning Star Doji",
    key: ["doji"],
    keyState: "Bullish",
    duration: 3,
    before: true,
    after: true,
    beforeDay: {"state": "Bearish", "candles": ["Big Red Candle"]},
    afterDay: {"state": "Bullish", "candles": ["Big Green Candle"]},
    description: "The Morning Star Doji is a bullish reversal pattern signaling a downtrend's potential end, featuring a long bearish candle (downtrend), a small doji (indecision/gap down), and a long bullish candle (buying takes over), indicating sellers are losing control and buyers are stepping in, suggesting a shift to an uptrend."
  },
  {
    name: "Three White Soldiers",
    key: ["Big Green Candle", "Marubozu"],
    keyState: "Bullish",
    duration: 3,
    before: true,
    after: true,
    beforeDay: {"state": "Bullish", "candles": ["Big Green Candle"]},
    afterDay: {"state": "Bullish", "candles": ["Big Green Candle"]},
    description: "The Three Green Soldiers (or White Soldiers) candlestick pattern is a strong bullish reversal signal, indicating buyers are taking control after a downtrend, suggesting a shift from selling pressure to strong buying momentum, seen as three consecutive long green candles with small upper wicks, each opening and closing progressively higher than the last."
  },
  {
    name: "Evening Star",
    key: ["spinning top", "shaven top", "doji"],
    keyState: "none",
    duration: 3,
    before: true,
    after: true,
    beforeDay: {"state": "Bullish", "candles": ["Big Green Candle"]},
    afterDay: {"state": "Bearish", "candles": ["Big Red Candle"]},
    description: "The Evening Star is a bearish, three-candlestick pattern signaling a potential reversal from an uptrend to a downtrend, appearing at price peaks; it shows strong buying (long green candle) followed by hesitation (small middle candle/star), then sellers taking control (long red candle)."
  },
  {
    name: "Bearish Engulfing",
    key: ["Big Red Candle", "Marubozu"],
    keyState: "Bearish",
    duration: 2,
    before: true,
    after: false,
    beforeDay: {"state": "Bullish", "candles": ["Big Green Candle"]},
    description: "A bearish engulfing candle is a two-candle pattern in technical analysis, signaling a potential downtrend reversal from a prior uptrend; it features a small green (bullish) candle followed by a large red (bearish) candle whose body completely covers (engulfs) the first candle's body, showing sellers have overwhelmed buyers and taken control."
  }
];

// Check for Empty Array
function isEmptyArray(arr) {
  return Array.isArray(arr) && arr.length === 0;
}

// Function for checking for Candlestick patterns
function checkForPattern(days) {
  patternFound = [];

  for(var index=0; index < days.length; index++) {
    var candlestick = days[index].candlestick;
    var candlestickState = days[index].state;
    var date = days[index].date;

    patterns.forEach(pattern => {
      var keys = pattern.key;
      var keyState = pattern.keyState;

      keys.forEach(key => {
        if (key.toLowerCase() === candlestick.toLowerCase() && candlestickState.toLowerCase() === keyState.toLowerCase()) {       
          duration = pattern.duration;
          
          if (duration > 2) {
            
            if(index > 0 && (days[index + 1] !== undefined && days[index + 1] !== null)) {                
                beforeDay = pattern.beforeDay;
                beforeDayCandles = beforeDay.candles;
                beforeDayState = beforeDay.state;
                afterDay = pattern.afterDay;
                afterDayCandles = afterDay.candles;
                afterDayState = afterDay.state;
                beforeDayFlag = false;
                afterDayFlag = false;
                
                beforeDayCandles.forEach(candle => {                    
                    var lastDayCandlestick = days[index - 1].candlestick;
                    var lastDayState = days[index - 1].state;
                    
                    if(lastDayCandlestick.toLowerCase() === candle.toLowerCase() && lastDayState.toLowerCase() === beforeDayState.toLowerCase())
                        beforeDayFlag = true;
                });

                afterDayCandles.forEach(candle => {
                    var nextDayCandlestick = days[index + 1].candlestick;
                    var nextDayState = days[index + 1].state;
                    
                    if(nextDayCandlestick.toLowerCase() === candle.toLowerCase() && nextDayState.toLowerCase() === afterDayState.toLowerCase())
                        afterDayFlag = true;
                });

                if(beforeDayFlag && afterDayFlag)
                    patternsFound.push({date: date,pattern: pattern});
                
            }
        
            
          }
          else {
            if(index > 0) {
              
              beforeDay = pattern.beforeDay;
              beforeDayCandles = beforeDay.candles;
              beforeDayState = beforeDay.state;
              beforeDayFlag = false;

              beforeDayCandles.forEach(candle => {
                  var lastDayCandlestick = days[index - 1].candlestick;
                  var lastDayState = days[index - 1].state;
                  
                  if(lastDayCandlestick.toLowerCase() === candle.toLowerCase() && lastDayState.toLowerCase() === beforeDayState.toLowerCase())
                      beforeDayFlag = true;
              });

              if(beforeDayFlag)
                  patternsFound.push({date: date,pattern: pattern});
            }
          }
        }
      });
    });
  }

  return patternFound;
}

// Function to define the candlestick for the day
function createCandlestick(day) {
  var candlestick = "none";

  if (day.pbody > .50) {
    if (day.pbody > .75) {
      if (day.pbody > .98)
        candlestick = "Marubozu";
      else {
        if (day.state == "Bearish")
          candlestick = "Big Red Candle";
        else
          candlestick = "Big Green Candle";
      }
    }
    else {
      if (day.pupperWick > .30 || day.plowerWick > .30) {
        if (day.pupperWick > .30)
          candlestick = "Shaven Bottom";
        else
          candlestick = "Shaven Top";
      }
      else
        candlestick = "Spinning Top";
    }
  }

  else {
    if (day.pbody > .30) {
      if (day.plowerWick > .5)
        candlestick = "Hanging Man";
      else {
        if (day.plowerWick > .35)
          candlestick = "Hammer";
        else
          candlestick = "Spinning Top";
      }
    }
    else {
      if (day.pbody > .20) {
        if (day.plowerWick > .3 && day.pupperWick > .3)
          candlestick = "Spinning Top";
        else {
          if (day.plowerWick > .4)
            candlestick = "Hammer";
          else
            candlestick = "Inverted Hammer";
        }
      }
      else {
        if (day.plowerWick > .4 || day.pupperWick > .4) {
          if (day.plowerWick > .4 && day.pupperWick > .4)
            candlestick = "Doji";
          else if (day.plowerWick > .4 && day.pupperWick < .4)
            candlestick = "Dragonfly Dogi";
          else
            candlestick = "Gravestone Doji";
        }
      }
    }
  }

  return candlestick;
}

// Function to create the chart for visuals
async function createCandlestickChart(data, ticker) {
    const ctx = document.getElementById('candlestickChart').getContext('2d');
    

    new Chart(ctx, {
        type: 'candlestick', // Requires a candlestick plugin for Chart.js
        data: {
            datasets: [{
                label: ticker,
                data: candlestickData.map(d => ({
                    x: new Date(d.t).getTime(), // Convert date string to timestamp
                    o: d.o,
                    h: d.h,
                    l: d.l,
                    c: d.c
                })),
                backgroundColors: {
                    up: 'rgba(75, 192, 91, 0.8)', // Green
                    down: 'rgba(255, 99, 132, 0.8)', // Red
                    unchanged: 'rgba(143, 143, 143, 1)' // Grey
                },
                backgroundColor: (context) => {
                    const { raw } = context;
                    return raw.o < raw.c ? 'rgba(75, 192, 91, 0.8)' : 'rgba(255, 99, 132, 0.8)';
                },
                borderColor: (context) => {
                    const { raw } = context;
                    return raw.o < raw.c ? 'rgba(75, 192, 91, 1)' : 'rgba(255, 99, 132, 1)';
                },
                borderWidth: 1,
                }],
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                    },
                },
                y: {
                    type: 'linear',
                    beginAtZero: false,
                },
            },
        },
    });

}


const candlestickData = []; //Array created from the event data and the defined candlestick.

const canvas = document.getElementById('candlestickChart'); //canvas for chart
var eventID = canvas.dataset.event; // Event ID for data retrieval

// Function - API call to the node backend to retreive the event data
fetch('/api/' + eventID).then(response => response.json()).then(data => {

  if(!data.eventID) {

    var ticker = data['appData'][0]['event']['ticker'];
    days = data['appData'][0]['days'];

    var patternData = [];

    days.forEach(day => {
        patternData.push({ state: day.state, candlestick: createCandlestick(day), date: day.date });
        candlestickData.push({ t: day.date, o: day.open, h: day.high, l: day.low, c: day.close })                   
    });

    patternsFound = checkForPattern(patternData);
    
    if(isEmptyArray(patternsFound)) {
        var patternText = document.querySelector(".pattern-text");
        patternText.innerHTML = "No pattern was found.";
    }

    else {
        var patternText = document.querySelector(".pattern-text");
        patternText.innerHTML = patternsFound.pattern.name + " was found on: " + patternsFound.date;
    }

    createCandlestickChart(candlestickData, ticker);
  }

}).catch(error => console.log('Error'));


/*const returnHome = document.getElementById('return-home'); //Return button

// Event Listener for the return button. Kick off for the event. 
returnHome.addEventListener("click", function() {
  window.location.replace("/");
});*/