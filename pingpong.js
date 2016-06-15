//All variables are declared here.

//The components of the game
var paddleL;
var paddleR;
var ball;

//The threshold for jumping


//Array of obstacles


//Randomize position of the obstacles


//The moving background


//The score components
var scoreL = 0;
var scoreR = 0;
var scoreLup = document.getElementById("scoresL");
var scoreRup = document.getElementById("scoresR");

//Accelerate as score progresses


//variables to add sound to the game
var paddleHit = new playSound("paddle_hit.mp3");
var paddleOut = new playSound("paddle_out.mp3");

//Sprites


//Variables for start and pause

//Picture sources

//Function to obtain the highscore from sessionStorage

//Starts the game
function startGame(){
	//Create and set the canvas
	Anigame.start();
	paddleL = new component(7,80,"white",40,210,"rect");
	paddleR = new component(7,80,"white",1253,210,"rect");
	ball = new component(30,30,"white",635,235,"rect");
	ball.speedX = Math.random()*2;
	ball.speedY = -1*Math.random()*2;
}

//The canvas object.
var Anigame = {
	canvas: document.createElement("canvas"),
	start: function(){
		this.canvas.width = 1300;
		this.canvas.height = 500;
		this.context = this.canvas.getContext('2d');
		document.body.appendChild(this.canvas);
		
		//FPS is now 125.
		this.interval = setInterval(updateArena,8);

		//Add eventlisteners for keydown, and touchstart
		window.addEventListener('keydown',function(e){
			Anigame.key = e.keyCode;
		})
		window.addEventListener('keyup',function(e){
			Anigame.key = false;
		})
		
	},
	//Clear the canvas
	clear: function(){
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	},
	
	//Stop the game
	stop: function(){
		clearInterval(this.interval);
	}
}

//Create the components of the game
function component(width,height,color,x,y,type){
	this.type = type;
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	
	//Update the components
	this.update = function(){
		ctx = Anigame.context;
		ctx.fillStyle = color;
		ctx.fillRect(this.x,this.y,this.width,this.height);
	}
	
	//Move to a new position
	this.newPos = function(){
		this.x+=this.speedX;
		this.y+=this.speedY;
	}
	
	//Check for crashes with obstacles
	this.crashWith = function(paddle) {
		var ballLeft = this.x;
        var ballRight = this.x + (this.width);
        var balltop = this.y;
        var ballbottom = this.y + (this.height);
        var paddlel = paddle.x;
        var paddler = paddle.x + (paddle.width);
        var paddlet = paddle.y;
        var paddleb = paddle.y + (paddle.height);
        var crash = true;
        if ((ballbottom < paddlet) ||
               (balltop > paddleb) ||
               (ballRight < paddlel) ||
               (ballLeft > paddler)) {
           crash = false;
        }
        return crash;
    }
	
	//Changes the image source. Useful for animation
	this.changeSrc = function(srcIt){
		if(this.type === "image"){
			this.imag.src = srcIt;
		}
	}
}



//Update the game area. Basically called every 8 milliseconds
function updateArena(){
	
	//If the game is not paused and has started

		var x,y;
		
		//Check for crashes
		if(ball.crashWith(paddleL)){
			ball.speedX = -1*ball.speedX;
			ball.x = paddleL.x+paddleL.width+2;
			scoreL++;
			paddleHit.play();
		}
		if(ball.crashWith(paddleR)){
			ball.speedX = -1*ball.speedX;
			scoreR++;
			ball.x = paddleR.x - 2;
			paddleHit.play();
		}
		if(ball.y <= 0){
			//alert('The speedY was '+ball.speedY);
			ball.speedY = -1*ball.speedY;
			//alert('The speedY is '+ball.speedY);
		}
		if(ball.y+ball.height>=Anigame.canvas.height){
			ball.speedY = -1*ball.speedY;
		}
		if(ball.x<=0){
			paddleOut.play();
			Anigame.stop();
		}
		if(ball.x+ball.width>=Anigame.canvas.width){
			paddleOut.play();
			Anigame.stop();
		}
		Anigame.clear();
		Anigame.context.fillStyle = "black";
		Anigame.context.fillRect(0,0,1300,600);
		//Insert the obstacles at random intervals
		//Accelerate once the score reaches a threshold.
		//If the key pressed is 'w'
		if(Anigame.key && Anigame.key === 87){
			if(paddleL.y>0){
				paddleL.y--;
			}
		}
		
		else if(Anigame.key && Anigame.key === 83){
			if(paddleL.y + paddleL.height < Anigame.canvas.height){
				paddleL.y++;
			}
		}
		else if(Anigame.key && Anigame.key === 38){
			if(paddleR.y>0){
				paddleR.y--;
			}
		}
		else if(Anigame.key && Anigame.key === 40){
			if(paddleR.y + paddleR.height < Anigame.canvas.height){
				paddleR.y++;
			}
		}
		//If not reached top, go up

		//Stay at the top 
	
		
		//Come down again to same position

		
		//Update the positions of the background

		//Sprite coding

	
		//Update each obstacle
		paddleL.update();
		paddleR.update();
		ball.newPos();
		ball.update();
		//Update the score
		scoreLup.innerHTML = "Player 1: "+scoreL;
		scoreRup.innerHTML = "Player 2: "+scoreR;
		
	//Pause game
	
	//If game hasn't started, wait for it to start because of pressing SPACEBAR
}

//Function to add sound
function playSound(src){
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload","auto");
	this.sound.setAttribute("controls","none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function(){
		this.sound.play();
	}
}