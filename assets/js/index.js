
const submit = document.getElementById('selection-submit'); //Submit button
var intervalId; //Interval for msg change function

// Function to change the msg in the loader
function changeMes() {
    const text = document.querySelector('.text-wrapper');
    const textChildren = text.querySelectorAll('p');
    
    textChildren.forEach(msg => {
        var dataArrival = msg.dataset.arrival;
        if(dataArrival == 0) {
            msg.dataset.arrival = 2;
        }
        else
            msg.dataset.arrival = msg.dataset.arrival - 1;
    });
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

// Event Listener for the submit button. Kick off for the event. 
submit.addEventListener("click", function() {
    const selected = document.getElementById("ticker-selector").value;

    if(typeof dataIntegrityCheck(selected) != "boolean")
        return;
       
    if(!dataQualityCheck(selected)) 
        return;
    

    // Event starts here
    fetch('/api/start', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json' // Or 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
            event: "start",
            ticker: selected
        })
    })
    .then(response => response.json()).then(data => {
            var eventID = data.eventID

            if(!eventID)
                return;

            const coverPage = document.getElementById('cover-page');
            const transitionPage = document.getElementById('transition-page');
            coverPage.classList.remove('is-active');
            transitionPage.classList.add('is-active');

            
            
            intervalId = setInterval(changeMes, 4000);

            setTimeout(() => {
                clearInterval(intervalId);
                window.location.replace("/cschart/" + eventID);
            }, 11800);       
        })
    .catch(error => console.log('Error')
    );

});
