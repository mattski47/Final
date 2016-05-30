var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(448, 448);
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
var scale = 2;
stage.scale.x = scale;
stage.scale.y = scale;

var gameContainer = new PIXI.Container();
var menuContainer = new PIXI.Container();
var endContainer = new PIXI.Container();
var instructionsContainer = new PIXI.Container();
var onGame = false;
var style = {fill: "white"};
var style2 = {font: '16px Arial', fill: "black", wordWrap: true, wordWrapWidth: 190};
var creditsDisplay = new PIXI.Text("By: Matthew Siewierski", style);
var instructionsDisplay = new PIXI.Text("How to Play:\n\nUse 'wasd' to move around and find various items around the map. Once you think you have them all, go back to the house to return to the main menu.", style2);

var playButton;
var instructionsButton;
var returnHome;
var background;
var title;

var music;
var currScene;
var player;
var world;
var person;
var playerObject;

var playerContainer = new PIXI.Container();
var playerTextures;
var walkingClips;

	//.add("music.mp3")
//load stuff 
PIXI.loader
	.add('map', "assets/worldmap.json")
	.add("assets/tileset.png")
	.add("assets/playermovement.json")
	.load(ready);
	
function ready() {
	var tu = new TileUtilities(PIXI);
	world = tu.makeTiledWorld("map", "assets/tileset.png");
	
	playerTextures = [PIXI.Texture.fromFrame("walkingup1.png"), PIXI.Texture.fromFrame("walkingright1.png"), PIXI.Texture.fromFrame("walkingdown1.png"), PIXI.Texture.fromFrame("walkingleft1.png")];
	
	walkingClips = [new PIXI.extras.MovieClip.fromFrames(["walkingup1.png", "walkingup2.png", "walkingup3.png", "walkingup4.png"]), new PIXI.extras.MovieClip.fromFrames(["walkingright1.png", "walkingright2.png", "walkingright3.png", "walkingright4.png"]), new PIXI.extras.MovieClip.fromFrames(["walkingdown1.png", "walkingdown2.png", "walkingdown3.png", "walkingdown4.png"]), new PIXI.extras.MovieClip.fromFrames(["walkingleft1.png", "walkingleft2.png", "walkingleft3.png", "walkingleft4.png"])];
	
	//music = PIXI.audioManager.getAudio("music.mp3");
	//music.loop = true;
	//music.volume = 0.6;
	
	stage.addChild(gameContainer);
	currScene = new playGame();
	animate();
}

var up = 0;
var right = 1;
var down = 2;
var left = 3;

var tilex;
var tiley;

var dirHistory = [];

//play game
var playGame = function() {
	this.moving = false;
	
	gameContainer.addChild(world);
	playerObject = world.getObject("person");
	
	
	playerContainer.width = 32;
	playerContainer.height = 32;
	playerContainer.x = playerObject.x;
	playerContainer.y = playerObject.y;
	gameContainer.addChild(playerContainer);
	
	tilex = 52;
	tiley = 25;
	
	player = new PIXI.Sprite(playerTextures[down]);
	player.anchor.x = 0;
	player.anchor.y = 0.25;
	playerContainer.addChild(player);
	
	for (var i=0; i<4; i++) {
		walkingClips[i].anchor.x = 0;
		walkingClips[i].anchor.y = 0.25;
		walkingClips[i].visible = false;
		walkingClips[i].animationSpeed = 0.1;
		playerContainer.addChild(walkingClips[i]);
	}
	
	stage.x = -playerContainer.x*scale + renderer.width/2 - playerContainer.width/2*scale;
	stage.y = -playerContainer.y*scale + renderer.height/2 + playerContainer.height/2*scale;
}

playGame.prototype.move = function() {
	if (!currScene.moving) {
		for (var i=0; i<4; i++) {
			walkingClips[i].visible = false;
			walkingClips[i].stop();
			player.visible = true;
		}
	} else {
		return;
	}
	
	if (dirHistory[dirHistory.length-1] == up) {
		currScene.moving = true;
		player.visible = false;
		walkingClips[up].visible = true;
		walkingClips[up].play();
		player.texture = playerTextures[up];
		
		if (tiley == 3) {
			currScene.moving = false;
			return;
		} else {
			tiley--;
			createjs.Tween.get(playerContainer).to({y: playerContainer.y - 32}, 250).call(function() {
				currScene.moving = false;
			});
		}
	} else if (dirHistory[dirHistory.length-1] == right) {
		currScene.moving = true;
		player.visible = false;
		walkingClips[right].visible = true;
		walkingClips[right].play();
		player.texture = playerTextures[right];
		
		if (tilex == 66) {
			currScene.moving = false;
			return;
		} else {
			tilex++;
			createjs.Tween.get(playerContainer).to({x: playerContainer.x + 32}, 250).call(function() {
				currScene.moving = false;
			});
		}
	} else if (dirHistory[dirHistory.length-1] == down) {
		currScene.moving = true;
		player.visible = false;
		walkingClips[down].visible = true;
		walkingClips[down].play();
		player.texture = playerTextures[down];
		
		if (tiley == 66) {
			currScene.moving = false;
			return;
		} else {
			tiley++;
			createjs.Tween.get(playerContainer).to({y: playerContainer.y + 32}, 250).call(function() {
				currScene.moving = false;
			});
		}
	} else if (dirHistory[dirHistory.length-1] == left) {
		currScene.moving = true;
		player.visible = false;
		walkingClips[left].visible = true;
		walkingClips[left].play();
		player.texture = playerTextures[left];
		
		if (tilex == 3) {
			currScene.moving = false;
			return;
		} else {
			tilex--;
			createjs.Tween.get(playerContainer).to({x: playerContainer.x - 32}, 250).call(function() {
				currScene.moving = false;
			});
		}
	}
}

playGame.prototype.updateCamera = function() {
	stage.x = -playerContainer.x*scale + renderer.width/2 - 16*scale;
	stage.y = -playerContainer.y*scale + renderer.height/2 - 16*scale;
}

function keydownEventHandler(e) {
	e.preventDefault();
	if (e.repeat) {
		return;
	}
	
	if (e.keyCode == 87 && dirHistory.indexOf(up) == -1) { //move up
		dirHistory.push(up);
	}else if (e.keyCode == 68 && dirHistory.indexOf(right) == -1) { //move right
		dirHistory.push(right);
	} else if (e.keyCode == 83 && dirHistory.indexOf(down) == -1) { //move down
		dirHistory.push(down);
	} else if (e.keyCode == 65 && dirHistory.indexOf(left) == -1) { //move left
		dirHistory.push(left);
	}
}

function keyupEventHandler(e) {
	if (e.keyCode == 87) { //move up
		dirHistory.splice(dirHistory.indexOf(up), 1);
	} else if (e.keyCode == 68) { //move right
		dirHistory.splice(dirHistory.indexOf(right), 1);
	} else if (e.keyCode == 83) { //move down
		dirHistory.splice(dirHistory.indexOf(down), 1);
	} else if (e.keyCode == 65) { //move left
		dirHistory.splice(dirHistory.indexOf(left), 1);
	}
}

function animate() {
	requestAnimationFrame(animate);
	
	currScene.updateCamera();
	currScene.move();
	
	renderer.render(stage);
}


document.addEventListener('keydown', keydownEventHandler);
document.addEventListener('keyup', keyupEventHandler);


/*
//main menu
var mainMenu = function () {
	music.play();
	
	onGame = false;
	
	
	title.anchor.x = 0.5;
	title.anchor.y = 0.5;
	title.position.x = renderer.width/2;
	title.position.y = 130;
	
	//place play button
	playButton.anchor.x = 0.5;
	playButton.anchor.y = 0.5;
	playButton.position.x = renderer.width/2;
	playButton.position.y = renderer.height/2+75;
	
	instructionsButton.anchor.x = 0.5;
	instructionsButton.anchor.y = 0.5;
	instructionsButton.position.x = renderer.width/2;
	instructionsButton.position.y = renderer.height/2+150;
	
	menuContainer.addChild(background);
	menuContainer.addChild(title);
	menuContainer.addChild(playButton);
	menuContainer.addChild(instructionsButton);
	
	playButton.interactive = true;
	instructionsButton.interactive = true;
	
	
	playButton.mousedown = function(mouseData) {
		menuContainer.removeChildren();
		stage.removeChild(menuContainer);
		stage.addChild(gameContainer);
		currScene = new playGame();
	}
	
	instructionsButton.mousedown = function(mousedata) {
		menuContainer.removeChildren();
		stage.removeChild(menuContainer);
		stage.addChild(instructionsContainer);
		currScene = new instructionsPage();
	}
}
*/