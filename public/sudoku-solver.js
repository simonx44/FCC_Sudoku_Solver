const textArea = document.getElementById("text-input");
// import { puzzlesAndSolutions } from './puzzle-strings.js';

var hashMap = {};

const fillFieldsAndUpdate = (textArea, hashMap) => {
  const chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  var current = 0;
  var number = 1;

  for (var i = 1; i <= 81; i++) {
    var id = chars[current] + number;
    var elementId = "#" + id;
    hashMap[id] = textArea[i - 1];

    if (textArea[i - 1] != ".") $(elementId).val(textArea[i - 1]);
    else {
      $(elementId).val("");
    }

    if (i % 9 === 0) {
      current++;
      number = 1;
      continue;
    }
    number++;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Load a simple puzzle into the text area
  textArea.value =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  fillFieldsAndUpdate(textArea.value,hashMap);

  const cells = $(".grid td input");
  cells.on("change", function (event) {
    console.log(event.target.value);

    enterNumberIntoGrid(event.target.value, event.target.id,hashMap);
  });

  $("#text-input").change(function (event) {
    var validText = checkSudokuText(event.target.value);
;
    if (!validText) {
      fillFieldsAndUpdate(event.target.value,hashMap);
    }
  });

  $("#solve-button").on("click", function (event) {
    console.log("Try Solve");

    solve();
  });

  $("#clear-button").on("click", function (event) {
    var text = "";
    for (let a = 0; a < 81; a++) {
      text += ".";
    }
    console.log(text);
    $("#text-input").val(text);
    fillFieldsAndUpdate(text,hashMap);
  });
});

var checkSudokuText = (text) => {
  if (text.length != 81) {
    $("#error-msg").append("Error: Expected puzzle to be 81 characters long");
    // $("#error-msg").css("color: red")
    return "Error: Expected puzzle to be 81 characters long";
  }
  for (var a = 0; a < 81; a++) {
    var currentLetter = text[a];
    if (!/([1-9])/.test(currentLetter) && currentLetter !== ".") {
      $("#error-msg").append("Error: wrong Character");
      return "Error: wrong Character";
    }
  }
};

var enterNumberIntoGrid = (value, htmlId,hashMap) => {
  const input = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var calc;
  switch (htmlId[0]) {
    case "A":
      calc = 0;
      break;
    case "B":
      calc = 1;
      break;
    case "C":
      calc = 2;
      break;
    case "D":
      calc = 3;
      break;
    case "E":
      calc = 4;
      break;
    case "F":
      calc = 5;
      break;
    case "G":
      calc = 6;
      break;
    case "H":
      calc = 7;
      break;
    case "I":
      calc = 8;
      break;
    default:
      break;
  }
  if (!input.includes(value)) {
    $("#" + htmlId).val("");
    return false;
  }

  hashMap[htmlId] = value;
  var getSpot = calc * 9 + parseInt(htmlId[1]);

  var textContent = $("#text-input").val();

  textContent =
    textContent.substring(0, getSpot - 1) +
    value +
    textContent.substring(getSpot);
console.log(hashMap)
  $("#text-input").val(textContent);
};
var solve = () => {
  console.log("Funktion gestartet");
  var unsolvedPositions = [];
  for (var key in hashMap) {
    if (hashMap[key] === ".") {
      unsolvedPositions.push(key);
    }
  }
  console.log(hashMap);
  while (unsolvedPositions.length > 0) {
    var tryKey = unsolvedPositions.shift();

    if (tryKey) {
      console.log("Suche für Feld: " + tryKey);
      var missingValues = [];
      var row = getWholeRow(tryKey, hashMap);
      var column = getWholeColumn(tryKey, hashMap);
      var square = getWholeSquare(tryKey, hashMap); 
console.log(typeof row[2])
   
      if (row && column && square) {
        for (let a = 1; a <= 9; a++) {
          var entry = a.toString();
          if (row.includes(entry) || column.includes(entry) || square.includes(entry)) {
            continue;
          } else {
            missingValues.push(entry);
          }
        }
      }
      console.log("missing:")
      console.log(missingValues)
      if (missingValues.length == 1) {
        console.log(missingValues[0])
        hashMap[tryKey] = missingValues[0];
        console.log(tryKey + " / "+missingValues[0])
      } else if (missingValues.length > 1) {
        unsolvedPositions.push(tryKey);
      }
    } //unsolvedPositions = []
  }
for(var key in hashMap){

  enterNumberIntoGrid(hashMap[key],key,hashMap);

}
var sudokuText = $("#text-input").val();
fillFieldsAndUpdate(sudokuText,hashMap);
};

var getWholeRow = (key, hashMap) => {
  const chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  var arr = [];
  if (chars.includes(key[0])) {
    console.log("Row for: " + key);
    for (var a = 1; a <= 9; a++) {
      arr.push(hashMap[key[0] + a]);
    }
  }
  return arr;
};

var getWholeColumn = (key, hashMap) => {
  const chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  var arr = [];
  var number = key[1];

  if (number) {
    for (var a = 1; a <= 9; a++) {
      arr.push(hashMap[chars[a - 1] + number]);
    }
  }
  return arr;
};

var getWholeSquare = (key, hashMap) => {
  const chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  //console.log(key);
  var map = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    H: 8,
    I: 9,
  };

  var arr = [];
  var number = parseInt(key[1]);

  var checkPosition = key[1] % 3;
  var indexX = 0;
  if (checkPosition == 0) {
    indexX = number - 2;
  } else if (checkPosition == 2) {
    indexX = number - 1;
  } else if (checkPosition == 1) {
    indexX = number;
  }

  var columnPos = map[key[0]];
  var checkPosition2 = columnPos % 3;

  var indexY = 0;

  if (checkPosition2 == 0) {
    indexY = columnPos - 2;
  } else if (checkPosition2 == 2) {
    indexY = columnPos - 1;
  } else if (checkPosition2 == 1) {
    indexY = columnPos;
  }
  for (var x = indexX; x < indexX + 3; x++) {
    for (var y = indexY; y < indexY + 3; y++) {
      var char = Object.keys(map).find((key) => map[key] === y);
      // console.log(char)
      var value = hashMap[char + x];
      arr.push(value);
    }
  }

  return arr;
};
/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/

try {
  module.exports = {
    fillFields,
    checkSudokuText,
  };
} catch (e) {}
