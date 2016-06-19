//All variables are declared here.

//The components of the game
var paddleL;
var paddleR;
var ball;

//The score components
var scoreL = 0;
var scoreR = 0;
var scoreLup = document.getElementById("scoresL");
var scoreRup = document.getElementById("scoresR");

//variables to add sound to the game
var paddleHit = new playSound("paddle_hit.mp3");
var paddleOut = new playSound("paddle_out.mp3");

//Variables for start and pause
var started = false;
var paused =false;

//Starts the game
function startGame(){
	//Create and set the canvas
	Anigame.start();
	paddleL = new component(7,80,"white",40,210,"rect");
	paddleR = new component(7,80,"white",1253,210,"rect");
	ball = new component(30,30,"white",635,235,"rect");
	
	reload = new component(350,175,"reload.png",475,162.5,"image");
	
	ball.speedX = Math.random()*2+0.5;
	ball.speedY = -1*Math.random()*2-0.5;
}

//The canvas object.
var Anigame = {
	canvas: document.createElement("canvas"),
	start: function(){
		this.canvas.width = 1300;
		this.canvas.height = 500;
		this.context = this.canvas.getContext('2d');
		document.body.appendChild(this.canvas);
		
		//FPS is now 166.
		this.interval = setInterval(updateArena,6);

		//Add eventlisteners for keydown, and touchstart
		window.addEventListener('keydown',function(e){
			Anigame.key = e.keyCode;
			if(!started){
				if(Anigame.key == 32) started = true;
			}
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
		reload.update();
		this.canvas.onclick = function(){
			location.reload();
		}
		this.interval = setInterval(reloadGame,10);
	}
}

//Create the components of the game
function component(width,height,color,x,y,type){
	this.type = type;
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	
	if(type == "image"){
		this.imag = new Image();
		this.imag.src = color;
		this.vir = 0;
	}
	
	//Update the components
	this.update = function(){
		ctx = Anigame.context;
		if(type == "image" || type == "background"){
			ctx.drawImage(this.imag,this.x,this.y,this.width,this.height);
		}
		else{
			ctx.fillStyle = color;
			ctx.fillRect(this.x,this.y,this.width,this.height);
		}
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
	if(!paused && started){
		var x,y;
		
		//Check for crashes
		if(ball.crashWith(paddleL)){
			if(ball.speedX>0) ball.speedX+=0.1;
			else ball.speedX-=0.1;
			if(ball.speedY>0) ball.speedY+=0.1;
			else ball.speedY-=0.1;
			ball.speedX = -1*ball.speedX;
			ball.x = paddleL.x+paddleL.width+5;
			scoreL++;
			paddleHit.play();
		}
		if(ball.crashWith(paddleR)){
			if(ball.speedX>0) ball.speedX+=0.1;
			else ball.speedX-=0.1;
			if(ball.speedY>0) ball.speedY+=0.1;
			else ball.speedY-=0.1;
			ball.speedX = -1*ball.speedX;
			scoreR++;
			ball.x = ball.x - 5;
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
			alert('Player 2 has won');
		}
		if(ball.x+ball.width>=Anigame.canvas.width){
			paddleOut.play();
			Anigame.stop();
			alert('Player 1 has won');
		}
		Anigame.clear();
		Anigame.context.fillStyle = "black";
		Anigame.context.fillRect(0,0,1300,600);
		//If the key pressed is 'w' make paddleL go up
		if(Anigame.key && Anigame.key === 87){
			if(paddleL.y>0){
				paddleL.y-=2.5;
			}
		}
		
		//If the key pressed is 's' make paddleL go down
		else if(Anigame.key && Anigame.key === 83){
			if(paddleL.y + paddleL.height < Anigame.canvas.height){
				paddleL.y+=2.5;
			}
		}
		
		//If the key pressed is 'UP', make paddleR go up
		else if(Anigame.key && Anigame.key === 38){
			if(paddleR.y>0){
				paddleR.y-=2.5;
			}
		}
		
		//If the key pressed is 'DOWN', make paddleR go down
		else if(Anigame.key && Anigame.key === 40){
			if(paddleR.y + paddleR.height < Anigame.canvas.height){
				paddleR.y+=2.5;
			}
		}
		
		//Update each obstacle
		paddleL.update();
		paddleR.update();
		ball.newPos();
		ball.update();
		//Update the score
		scoreLup.innerHTML = "Player 1: "+scoreL;
		scoreRup.innerHTML = "Player 2: "+scoreR;
	}
	
	//Pause game
	if(Anigame.key && Anigame.key == 80 && started){
		
		//If paused, resume the game
		if(paused){
			paused = false;
			Anigame.key = false;
		}
		
		//If running, pause the game
		else{
			paused = true;
			Anigame.key = false;
		}
	}
	
	//If game hasn't started, wait for it to start because of pressing SPACEBAR
	if(!started){
		Anigame.clear();
		Anigame.context.fillStyle = "black";
		Anigame.context.fillRect(0,0,1300,600);
		paddleL.update();
		paddleR.update();
		ball.update();
	}
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

//function to reload
function reloadGame(){
	reload.update();
	clearInterval(Anigame.interval);
}