// set canvas;
$("canvas").attr("width", "100px");
$("canvas").attr("height", "100px");
var gameStart, AI, icon;
gameStart = false;
var $gameMenu = $("#newGame");
var $playerSelection = $("#playerSelection");
var $iconSelection = $("#XO");
var $restart = $("#restart");
newGame();
function newGame() {
  $gameMenu.show();
  $playerSelection.hide();
  $iconSelection.hide();
  $restart.hide();
  AI = false;
}
$gameMenu.on("click", function() {
  $gameMenu.hide();
  // $playerSelection.show();// 2 player
  AI = true;
  $iconSelection.show();
});
// to add two player
/*$('#onePlayer').on('click', function(){
  AI=true;
  alert('1 player selected');
  $playerSelection.hide();
  $iconSelection.show();
  
});
$('#twoPlayer').on('click',function(){
  AI=false;
  alert('2 player selected'+ AI);
  $playerSelection.hide();
  $iconSelection.show();
});
*/

$("#X").on("click", function() {
  icon = "X";
  $iconSelection.hide();
  gameStart = true;
});

$("#O").on("click", function() {
  icon = "O";
  $iconSelection.hide();
  gameStart = true;
});

// player setup ---------------
var player = [[], []];
var winList = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7]
];
var tempPos;
var position;
var turn = 0;
var enemyTurn = false;
var evaluation = false;
var round;
// game logic --------------------
$(".pos").on("click", function() {
  if (gameStart === true) {
    //alert('id'+ this.id);
    var positionTaken = false;
    position = this.id;
    for (i = 0; i < player[1].length; i++) {
      if (player[1][i] == position || player[0][i] == position) {
       //alert("positionTaken");
        positionTaken = true;
      }
    }
    if (positionTaken === false) {
      tempPos = this;
      score();
     // evaluation=true;
     // AITurn();
      enemyTurn = true;
      evaluation = false;
      AITurn(this);
    }
  }
});

function score() {
  if (turn === 0) {
    player[0].push(position.toString());
  //  alert("player 1 score" + player[0]);
    turn = 1;
  } else {
    player[1].push(position.toString());
   // alert("player 2 score" + player[1]);
    turn = 0;
  }
  var ctx = tempPos.getContext("2d");
  ctx.beginPath();
  ctx.font = "100px lucida console";
  ctx.fillText(icon, 20, 80);
  iconSwitch();
}
function iconSwitch() {
  if (icon == "X") {
    icon = "O";
  } else if (icon === "O") {
    icon = "X";
  }
}
// Set up temporary variables to compare against the win condition. If the AI can win then win, else block. If neither run function for best next move.
// If the AI scores then rerun but with evaluation set to true so that AI can check the win condition again without trying to score.
function AITurn(event) {
  var tempPlayer = [];
  var tempAI = [];
  var empty = [];
  for (i = 0;i < 8;i++)//8
       {
    if (enemyTurn === true || evaluation === true) {
      tempPlayer.length = 0;
      tempAI.length = 0;
      empty.length = 0;

      for (j = 0;j < 3;j++ ) 
      {
        var copy = winList.slice();
        var tempItem = copy[i][j].toString();

        if (player[0].indexOf(copy[i][j].toString()) !== -1) {
          tempPlayer.push(tempItem);
          //alert("tempPlayer="+ tempPlayer);
        } else if (player[1].indexOf(copy[i][j].toString()) !== -1) {
          // alert("round= "+i+" iteration= "+j+" AI== "+tempAI);
          tempAI.push(tempItem);
          //alert("tempAI="+ tempAI);
        } else {
          empty.push(tempItem);
          //alert('i made it empty='+empty );
        }

        copy.length = 0;
      }

     if (evaluation === false) {
        if (tempPlayer.length === 3) {
          Reset("Player Wins!");
          return;
       }
        if (tempAI.length === 2 && tempPlayer.length === 0) {
          position = empty.toString();
          tempPos = document.getElementById(position);
          score();
         // alert("im winninng now in if-statement");
          evaluation = true;
          enemyTurn = false;
          AITurn();
          return;
        } else if (tempPlayer.length == 2 && tempAI.length === 0) {
        

          position = empty.toString();
          tempPos = document.getElementById(position);
          score();

          evaluation = true;
          enemyTurn = false;
          AITurn();
          return;
        }
      } else if (enemyTurn === false && evaluation === true) {
        if (tempAI.length === 3) {
          evaluation = false;
          Reset("Computer Wins");
          return;
        } 
  
        else if (i === 7 && tempAI.length !== 3) {
          //alert("tempAIlength=="+tempAI.length+"empty.length=="+empty.length+" and im in evaluation true "+ i);
          evaluation = false;
        }
      }
    }
  }
// pick random corner if available else pick a side lane, else all blocks are taken.
  AIPick();
}

function Reset(Winner) {
 
  turn=0;
  enemyTurn=false;
  gameStart=false;
  $restart.prepend("<h1 id='winner'>" + Winner + "</h1>");
  $restart.show();
  $restart.on("click", function() {
    $restart.hide();
    $("#winner").remove();
    for (i = 1; i <= 9; i++) 
    {
      tempPos = document.getElementById(i.toString());
      var ctx = tempPos.getContext("2d");
      ctx.beginPath();
      ctx.font = "100px lucida console";
      ctx.clearRect(0, 0, 100, 100);
    }

    player[0].length = 0;
    player[1].length = 0;

    $iconSelection.show();
  });
}
function RandomStart() {}//optional rand btwn 0-1 AITurn();+ turn==1 so score  for enemy;
function AIPick() {
  if (enemyTurn === true && evaluation === false) {
    // alert("im inside AIPick");
    if (player[0].indexOf("5") == -1 && player[1].indexOf("5") == -1) {
      //alert('im taken ouch!!');
      position = "5";
      tempPos = document.getElementById(position);
      score();
      evaluation = true;
      enemyTurn = false;
      AITurn();
      return;
    } else {
      var corners = ["1", "3", "7", "9"];
      var cornersCopy = corners.slice();
      for (i = 0; i < corners.length; i++) 
      {
        //alert(player[0].indexOf(corners[i]));
        if (
          player[0].indexOf(corners[i]) !== -1 ||
          player[1].indexOf(corners[i]) !== -1
        ) {
          
          cornersCopy.splice(cornersCopy.indexOf(corners[i]), 1);
        }
        //alert("im beforeCorners.length>0 if "+ corners.length);
      }

      if (cornersCopy.length > 0) {
        //alert("ive made it to corners has a length>0");

        position =
          cornersCopy[
            Math.floor(Math.random() * Math.floor(cornersCopy.length))
          ];
        //alert("im inside Corners here's my problem"+ position);
        tempPos = document.getElementById(position);
        score();
        evaluation = true;
        enemyTurn = false;
        AITurn();
        return;
      } else {
        var leftovers = ["2", "4", "6", "8"];
        var leftoversCopy = leftovers.slice();
        for (j = 0; j < leftovers.length; j++) {
          if (
            player[0].indexOf(leftovers[j]) !== -1 ||
            player[1].indexOf(leftovers[j]) !== -1
          ) {
            leftoversCopy.splice(leftoversCopy.indexOf(leftovers[j]), 1);
          }
        }
        if (leftoversCopy.length > 0) {
          position =
            leftoversCopy[
              Math.floor(Math.random() * Math.floor(leftoversCopy.length))
            ];
          tempPos = document.getElementById(position);
          score();
          evaluation = true;
          enemyTurn = false;
          AITurn();
          return;
        } else {
          Reset("Draw!");
         // alert("no more spaces");
        }
      }
    }
  }
}