var myGamePiece = new Array();
var happySrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'%3E%3Ccircle cx='25' cy='25' r='20' fill='%23FFD700'/%3E%3Ccircle cx='18' cy='20' r='2' fill='%23000'/%3E%3Ccircle cx='32' cy='20' r='2' fill='%23000'/%3E%3Cpath d='M 15 30 Q 25 35 35 30' stroke='%23000' stroke-width='2' fill='none'/%3E%3C/svg%3E";
var sadSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'%3E%3Ccircle cx='25' cy='25' r='20' fill='%23FF6347'/%3E%3Ccircle cx='18' cy='20' r='2' fill='%23000'/%3E%3Ccircle cx='32' cy='20' r='2' fill='%23000'/%3E%3Cpath d='M 15 35 Q 25 30 35 35' stroke='%23000' stroke-width='2' fill='none'/%3E%3C/svg%3E";
var maxDist = 50;
var myGameArea = {
  timer: 0,
  running: true,
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.context = this.canvas.getContext("2d");
    this.context.font = "12px serif";
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    setInterval(updateGameArea, 20);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

function flatlander(width, height, x, y, isHappy) {
  this.image = new Image();
  this.isHappy = isHappy;
  if (isHappy) {
    this.happyPoints = 1;
    this.image.src = happySrc;
  } else {
    this.happyPoints = -1;
    this.image.src = sadSrc;
  }
  this.width = width;
  this.height = height;
  this.speedX = (Math.random() * 100) % 6;
  this.speedY = (Math.random() * 100) % 6;
  this.x = x;
  this.y = y;
  
  this.update = function () {
    ctx = myGameArea.context;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.fillText(this.happyPoints.toFixed(1), this.x, this.y + 5);
  };
  
  this.newPos = function (canvasWidth, canvasHeight) {
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.x <= 0 || this.x + this.width >= canvasWidth) {
      this.speedX = -this.speedX;
    }
    if (this.y <= 0 || this.y + this.height >= canvasHeight) {
      this.speedY = -this.speedY;
    }
  };
  
  this.moreHappy = function () {
    this.happyPoints += 0.1;
    if (this.happyPoints >= 1 && !this.isHappy) {
      this.isHappy = true;
      this.image.src = happySrc;
    }
  };
  
  this.lessHappy = function () {
    this.happyPoints -= 0.1;
    if (this.happyPoints < 0 && this.isHappy) {
      this.isHappy = false;
      this.image.src = sadSrc;
    }
  };
  
  this.checkSurroundings = function (other) {
    var x = Math.pow(this.x - other.x, 2);
    var y = Math.pow(this.y - other.y, 2);
    return Math.sqrt(x + y);
  };
}

function startGame() {
  myGamePiece = [];
  myGameArea.timer = 0;
  myGameArea.running = true;
  
  var n = parseInt(document.getElementById("num").value);
  var m = parseInt(document.getElementById("sad").value);
  
  if (isNaN(n) || isNaN(m) || n <= 0 || m < 0) {
    window.alert("Please enter valid numbers.");
    return;
  }
  
  if (m > n) {
    window.alert("Can not have more sad than individuals.");
    return;
  }
  
  var sad = 0;
  for (i = 0; i < n; i++) {
    var nX = (Math.random() * 10000) % (myGameArea.canvas.width - 30);
    var nY = (Math.random() * 10000) % (myGameArea.canvas.height - 30);
    var gamePiece = new flatlander(30, 30, nX, nY, ++sad > m);
    myGamePiece.push(gamePiece);
  }
  
  if (myGamePiece.length === n && myGameArea.canvas.parentNode === null) {
    myGameArea.start();
  }
}

function updateGameArea() {
  if (myGameArea.running) {
    myGameArea.clear();
    for (i = 0; i < myGamePiece.length; i++) {
      myGamePiece[i].newPos(myGameArea.canvas.width, myGameArea.canvas.height);
      myGamePiece[i].update();
    }
    
    var tmpFocus, d;
    var happy = 0;
    var sad = 0;
    
    for (i = 0; i < myGamePiece.length; i++) {
      tmpFocus = myGamePiece[i];
      for (j = i + 1; j < myGamePiece.length; j++) {
        d = tmpFocus.checkSurroundings(myGamePiece[j]);
        if (d < maxDist) {
          if (myGamePiece[j].isHappy) {
            tmpFocus.moreHappy();
          } else {
            tmpFocus.lessHappy();
          }
        }
      }
      if (tmpFocus.isHappy) {
        happy++;
      } else {
        sad++;
      }
    }
    
    myGameArea.timer++;
    document.getElementById("happyIndividuals").textContent = "Happy: " + happy;
    document.getElementById("sadIndividuals").textContent = "Sad: " + sad;
    
    if (happy === 0 || sad === 0) {
      var msg;
      myGameArea.running = false;
      if (happy == 0) msg = "Absolute sadness.... SAD!";
      else msg = "Absolute happiness reached.... Hurray!!";
      document.getElementById("timer").textContent =
        "Time: " + myGameArea.timer + "       " + msg;
    } else {
      document.getElementById("timer").textContent = "Time: " + myGameArea.timer;
    }
  } else return;
}
