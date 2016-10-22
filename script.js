var answer = "";
var try_count = 0;
var keys;
var counter;
var score;

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function displayMessage(text) {
  var answer_elem = document.getElementById('answer');
  answer_elem.innerText = text;
  setTimeout(function() {
    answer_elem.innerText = '';
  }, 700);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = [];
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i === 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

function shuffleArray(a) {
    var i, t, j;
    for (i = a.length - 1; i > 0; i -= 1) {
        t = a[i];
        j = Math.floor(Math.random() * (i + 1));
        a[i] = a[j];
        a[j] = t;
    }
    return a;
}

function random_question() {
  document.getElementById('country').value = '';

  if (counter < keys.length) {
    var gtld = keys[counter];
    counter++;
    answer = countries[gtld];
    document.getElementById('gtld').innerText = gtld;
    var text = "Questions left: " + counter + "/" + keys.length;
    document.getElementById('questions').innerText = text;
  } else {
    // Reset
    document.getElementById('questions').innerText = "Game ended! Score: " + score;
    document.getElementById('gtld').innerText = '';
  }
}

function enter(event) {
  event.preventDefault(); 
  if (event.keyCode != 13) {
     return;
  }

  if (counter > keys.length) {
    return;
  }

  var country_elem = document.getElementById('country');
  var country = country_elem.value;

  if (answer.match(country) !== -1 && (similarity(answer, country) * 100) >= 80) {
    score++; 
    country_elem.value = "";
    displayMessage('Correct!');
    random_question();
  } else {
    if (try_count < 2) {
      displayMessage('Try again!');
      try_count++;
    } else {
      displayMessage('Wrong it was ' + answer);
      try_count = 0;
      random_question();
    }
  }
}

function restart() {
  keys = shuffleArray(Object.keys(countries)).slice(0, 10);
  counter = 0;
  score = 0;

  random_question();
}

function setup() {
  var country = document.getElementById('country');
  country.addEventListener('keyup', enter);

  var restart_btn = document.getElementById('restart');
  restart_btn.addEventListener('click', restart);

  restart();
  //random_question();
}

document.addEventListener('DOMContentLoaded', setup);
