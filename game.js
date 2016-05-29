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
var entitiesLayer;

	//.add("music.mp3")
//load stuff 
PIXI.loader
	.add('map', "assets/worldmap.json")
	.add("assets/tileset.png")
	.add("assets/player.png")
	.load(ready);
	
function ready() {
	var tu = new TileUtilities(PIXI);
	world = tu.makeTiledWorld("map", "assets/tileset.png");
	
	player = new PIXI.Sprite(PIXI.Texture.fromImage("assets/player.png"));
	
	//music = PIXI.audioManager.getAudio("music.mp3");
	//music.loop = true;
	//music.volume = 0.6;
	
	stage.addChild(menuContainer);
	currScene = new playGame();
	animate();
}


var left = 0;
var right = 1;
var up = 2;
var down = 3;
var stop = 4;
var tilex;
var tiley;

//play game
var playGame = function() {
	this.direction = stop;
	this.moving = false;
	this.hasloltres = false;
	this.hasship = false;
	this.hassidekick = false;
	
	stage.addChild(world);
	
	tilex = 52;
	tiley = 24;
	
	playerObject = world.getObject("person");
	
	player.x = playerObject.x;
	player.y = playerObject.y;
	player.anchor.x = 0.0;
	player.anchor.y = 1.25;
	
	entitiesLayer = world.getObject("Entities");
	entitiesLayer.addChild(player);
	
	stage.x = -player.x*scale + renderer.width/2 - player.width/2*scale;
	stage.y = -player.y*scale + renderer.height/2 + player.height/2*scale;
	
}

playGame.prototype.move = function() {
	if (currScene.direction == stop) {
		currScene.moving = false;
		return;
	}
	
	currScene.moving = true;
	
	if (currScene.direction == up) {
		if (tiley == 3) {
			currScene.moving = false;
			return;
		} else {
			tiley--;
			createjs.Tween.get(player).to({y: player.y - 32}, 250).call(currScene.move);
		}
		
	}
	
	if (currScene.direction == down) {
		if (tiley == 66) {
			currScene.moving = false;
			return;
		} else {
			tiley++;
			createjs.Tween.get(player).to({y: player.y + 32}, 250).call(currScene.move);
		}
	}
	
	if (currScene.direction == left) {
		if (tilex == 3) {
			currScene.moving = false;
			return;
		} else {
			tilex--;
			createjs.Tween.get(player).to({x: player.x - 32}, 250).call(currScene.move);
		}
	}
	if (currScene.direction == right) {
		if (tilex == 66) {
			currScene.moving = false;
			return;
		} else {
			createjs.Tween.get(player).to({x: player.x + 32}, 250).call(currScene.move);
			tilex++;
		}
	}
}

playGame.prototype.updateCamera = function() {
	stage.x = -player.x*scale + renderer.width/2 - player.width/2*scale;
	stage.y = -player.y*scale + renderer.height/2 + player.height/2*scale;
}

function keydownEventHandler(e) {
	e.preventDefault();
	if (currScene.moving) {
		return;
	}
	
	currScene.direction = stop;
	
	if (e.keyCode == 65) { //move left
		currScene.direction = left;
	} else if (e.keyCode == 68) { //move right
		currScene.direction = right;
	} else if (e.keyCode == 87) { //move up
		currScene.direction = up;
	} else if (e.keyCode == 83) { //move down
		currScene.direction = down;
	}
	currScene.move();
}

//set direction to false when key is up
function keyupEventHandler(e) {
	currScene.direction = stop;
}



function animate() {
	requestAnimationFrame(animate);
	
	currScene.updateCamera();
	
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