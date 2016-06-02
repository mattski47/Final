var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(448, 448);
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
var scale = 2;
stage.scale.x = scale;
stage.scale.y = scale;

var gameContainer = new PIXI.Container();
var objectContainer = new PIXI.Container();
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
var edges;
var collisions = [];

var person;
var boat;
var axe;
var pick;
var shovel;
var hat;
var buildingWindow;
var rock;
var tree;
var cavegem;
var forestgem;
var islandgem;

var playerObject;
var boatObject;
var axeObject;
var pickObject;
var shovelObject;
var hatObject;
var buildingWindowObject;
var rockObject;
var treeObject;
var cavegemObject;
var forestgemObject;
var islandgemObject;

var playerContainer = new PIXI.Container();
var playerTextures;
var playerTexturesNoHat;
var playerTexturesHat;
var playerTexturesBoat;
var walkingClips;
var walkingClipsNoHat;
var walkingClipsHat;
var picking;

var boatTextures;
var tu;
	//.add("music.mp3")
//load stuff 
PIXI.loader
	.add('map', "assets/worldmap2.json")
	.add("assets/tileset2.png")
	.add("assets/stuff.json")
	.load(ready);
	
function ready() {
	tu = new TileUtilities(PIXI);
	world = tu.makeTiledWorld("map", "assets/tileset2.png");
	
	edges = world.getObject("Edges").data;
	
	for (var i=0; i<edges.length; i++) {
		if (edges[i] == 11) {
			collisions.push(i);
		}
	}
	
	playerTexturesNoHat = [PIXI.Texture.fromFrame("walkingup1.png"), PIXI.Texture.fromFrame("walkingright1.png"), PIXI.Texture.fromFrame("walkingdown1.png"), PIXI.Texture.fromFrame("walkingleft1.png")];
	playerTexturesHat = [PIXI.Texture.fromFrame("walkinguphat1.png"), PIXI.Texture.fromFrame("walkingrighthat1.png"), PIXI.Texture.fromFrame("walkingdownhat1.png"), PIXI.Texture.fromFrame("walkinglefthat1.png")];
	playerTexturesBoat = [PIXI.Texture.fromFrame("boatride4.png"), PIXI.Texture.fromFrame("boatride3.png"), PIXI.Texture.fromFrame("boatride1.png"), PIXI.Texture.fromFrame("boatride2.png")];
	
	boatTextures = [PIXI.Texture.fromFrame("boatalone4.png"), PIXI.Texture.fromFrame("boatalone3.png"), PIXI.Texture.fromFrame("boatalone1.png"), PIXI.Texture.fromFrame("boatalone2.png")];
	axe = new PIXI.Sprite(PIXI.Texture.fromFrame("axe.png"));
	pick = new PIXI.Sprite(PIXI.Texture.fromFrame("pick.png"));
	shovel = new PIXI.Sprite(PIXI.Texture.fromFrame("shovel.png"));
	hat = new PIXI.Sprite(PIXI.Texture.fromFrame("hat.png"));
	buildingWindow = new PIXI.Sprite(PIXI.Texture.fromFrame("window.png"));
	rock = new PIXI.extras.MovieClip.fromFrames(["rock1.png", "rock2.png", "rock3.png", "rock4.png", "rock5.png"]);
	//rock = new PIXI.Sprite(PIXI.Texture.fromFrame("rock1.png"));
	tree = new PIXI.Sprite(PIXI.Texture.fromFrame("treefalling1.png"));
	cavegem = new PIXI.Sprite(PIXI.Texture.fromFrame("digx1.png"));
	forestgem = new PIXI.Sprite(PIXI.Texture.fromFrame("digx1.png"));
	islandgem = new PIXI.Sprite(PIXI.Texture.fromFrame("digx1.png"));
	
	picking = new PIXI.extras.MovieClip.fromFrames(["picking1.png", "picking2.png", "picking3.png", "picking1.png", "picking2.png", "picking3.png", "picking1.png", "picking2.png", "picking3.png"]);
	walkingClipsNoHat = [new PIXI.extras.MovieClip.fromFrames(["walkingup1.png", "walkingup2.png", "walkingup3.png", "walkingup4.png"]), new PIXI.extras.MovieClip.fromFrames(["walkingright1.png", "walkingright2.png", "walkingright3.png", "walkingright4.png"]), new PIXI.extras.MovieClip.fromFrames(["walkingdown1.png", "walkingdown2.png", "walkingdown3.png", "walkingdown4.png"]), new PIXI.extras.MovieClip.fromFrames(["walkingleft1.png", "walkingleft2.png", "walkingleft3.png", "walkingleft4.png"])];
	walkingClipsHat = [new PIXI.extras.MovieClip.fromFrames(["walkinguphat1.png", "walkinguphat2.png", "walkinguphat3.png", "walkinguphat4.png"]), new PIXI.extras.MovieClip.fromFrames(["walkingrighthat1.png", "walkingrighthat2.png", "walkingrighthat3.png", "walkingrighthat4.png"]), new PIXI.extras.MovieClip.fromFrames(["walkingdownhat1.png", "walkingdownhat2.png", "walkingdownhat3.png", "walkingdownhat4.png"]), new PIXI.extras.MovieClip.fromFrames(["walkinglefthat1.png", "walkinglefthat2.png", "walkinglefthat3.png", "walkinglefthat4.png"])];
	walkingClips = walkingClipsNoHat;
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
var boatx;
var boaty;

var dirHistory = [];

//play game
var playGame = function() {
	this.follow = true;
	this.moving = false;
	this.hashat = true;
	this.hasshovel = false;
	this.hasaxe = false;
	this.haspick = false;
	this.windowbroken = false;
	this.rockbroken = false;
	this.cuttree = false;
	this.inboat = false;
	this.hascavegem = false;
	this.hasforestgem = false;
	this.hasislandgem = false;
	this.facing = down;
	
	playerTextures = playerTexturesNoHat;
	gameContainer.addChild(world);
	
	playerObject = world.getObject("person");
	
	boatObject = world.getObject("boat");
	axeObject = world.getObject("axe");
	pickObject = world.getObject("pick");
	shovelObject = world.getObject("shovel");
	hatObject = world.getObject("hat");
	windowObject = world.getObject("window");
	rockObject = world.getObject("rock");
	treeObject = world.getObject("tree");
	cavegemObject = world.getObject("cavegem");
	forestgemObject = world.getObject("forestgem");
	islandgemObject = world.getObject("islandgem");
	
	gameContainer.addChild(objectContainer);
	boat = new PIXI.Sprite(boatTextures[left]);
	boat.x = boatObject.x;
	boat.y = boatObject.y;
	boat.anchor.x = 0;
	boat.anchor.y = 1.0;
	objectContainer.addChild(boat);
	
	axe.x = axeObject.x;
	axe.y = axeObject.y;
	axe.anchor.x = 0;
	axe.anchor.y = 1.0;
	objectContainer.addChild(axe);
	
	pick.x = pickObject.x;
	pick.y = pickObject.y;
	pick.anchor.x = 0;
	pick.anchor.y = 1.0;
	objectContainer.addChild(pick);
	
	shovel.x = shovelObject.x;
	shovel.y = shovelObject.y;
	shovel.anchor.x = 0;
	shovel.anchor.y = 1.0;
	objectContainer.addChild(shovel);
	
	hat.x = hatObject.x;
	hat.y = hatObject.y;
	hat.anchor.x = 0;
	hat.anchor.y = 1.0;
	objectContainer.addChild(hat);
	
	buildingWindow.x = windowObject.x;
	buildingWindow.y = windowObject.y;
	buildingWindow.anchor.x = 0;
	buildingWindow.anchor.y = 1.0;
	objectContainer.addChild(buildingWindow);
	
	rock.x = rockObject.x;
	rock.y = rockObject.y;
	rock.anchor.x = 0;
	rock.anchor.y = 1.0;
	rock.loop = false;
	rock.animationSpeed = 0.03;
	objectContainer.addChild(rock);
	
	tree.x = treeObject.x;
	tree.y = treeObject.y;
	tree.anchor.x = 0;
	tree.anchor.y = 1.0;
	objectContainer.addChild(tree);
	
	cavegem.x = cavegemObject.x;
	cavegem.y = cavegemObject.y;
	cavegem.anchor.x = 0;
	cavegem.anchor.y = 1.0;
	objectContainer.addChild(cavegem);
	
	forestgem.x = forestgemObject.x;
	forestgem.y = forestgemObject.y;
	forestgem.anchor.x = 0;
	forestgem.anchor.y = 1.0;
	objectContainer.addChild(forestgem);
	
	islandgem.x = islandgemObject.x;
	islandgem.y = islandgemObject.y;
	islandgem.anchor.x = 0;
	islandgem.anchor.y = 1.0;
	objectContainer.addChild(islandgem);
	
	playerContainer.width = 32;
	playerContainer.height = 32;
	playerContainer.x = playerObject.x;
	playerContainer.y = playerObject.y;
	gameContainer.addChild(playerContainer);
	
	tilex = 52;
	tiley = 25;
	boatx = 9;
	boaty = 61;
	
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
		
		walkingClipsHat[i].anchor.x = 0;
		walkingClipsHat[i].anchor.y = 0.25;
		walkingClipsHat[i].visible = false;
		walkingClipsHat[i].animationSpeed = 0.1;
		playerContainer.addChild(walkingClipsHat[i]);
	}
	picking.anchor.x = 0;
	picking.anchor.y = 0.25;
	picking.visible = false;
	picking.loop = false;
	picking.animationSpeed = 0.09;
	picking.onComplete = function () {
		currScene.moving = false;
		currScene.rockbroken = true;
		picking.visible = false;
	}
	playerContainer.addChild(picking);
	
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
		currScene.facing = up;
		if (!currScene.inboat) {
			player.visible = false;
			walkingClips[up].visible = true;
			walkingClips[up].play();
		}
		player.texture = playerTextures[up];
		if (currScene.checkCollisions(up)) {
			currScene.moving = false;
			return;
		} else if (tiley == 24 && tilex == 9) {
			if (currScene.hashat) {
				playerContainer.x = playerContainer.x + 352;
				playerContainer.y = playerContainer.y - 192;
				walkingClips[up].visible = false;
				walkingClips[up].stop();
				playerTextures = playerTexturesHat;
				walkingClips = walkingClipsHat;
				tilex = 20;
				tiley = 18;
				currScene.moving = false;
			} else {
				playerContainer.y = playerContainer.y - 224;
				tiley = 18;
				currScene.updateCamera();
				playerContainer.y = playerContainer.y + 32;
				currScene.follow = false;
				currScene.moving = false;
			}
			return;
		} else if (tiley == 30 && tilex == 4) {
			playerContainer.y = playerContainer.y - 800;
			tiley = 5;
			currScene.moving = false;
			return;
		} else if ((tiley == 54 && tilex == 45) || (tiley == 58 && tilex == 6)) {
			playerTextures = playerTexturesNoHat;
			currScene.inboat = false;
			boat.texture = boatTextures[up];
			player.texture = playerTextures[up];
			player.visible = false;
			boatx = tilex;
			boaty = tiley;
			boat.x = playerContainer.x;
			boat.y = playerContainer.y+32;
			boat.visible = true;
			walkingClips[up].visible = true;
			walkingClips[up].play();
		}
		
		tiley--;
		createjs.Tween.get(playerContainer).to({y: playerContainer.y - 32}, 250).call(function() {
			currScene.moving = false;
		});
	} else if (dirHistory[dirHistory.length-1] == right) {
		currScene.moving = true;
		currScene.facing = right;
		if (!currScene.inboat) {
			player.visible = false;
			walkingClips[right].visible = true;
			walkingClips[right].play();
		}
		player.texture = playerTextures[right];
		if (currScene.checkCollisions(right)) {
			currScene.moving = false;
			return;
		} else if ((tilex == 9 && tiley == 61) || (tilex == 45 && tiley == 60) || (tilex == 57 && tiley == 59)) {
			playerTextures = playerTexturesNoHat;
			currScene.inboat = false;
			boat.texture = boatTextures[right];
			player.texture = playerTextures[right];
			player.visible = false;
			boatx = tilex;
			boaty = tiley;
			boat.x = playerContainer.x;
			boat.y = playerContainer.y+32;
			boat.visible = true;
			walkingClips[right].visible = true;
			walkingClips[right].play();
		}
		
		tilex++;
		createjs.Tween.get(playerContainer).to({x: playerContainer.x + 32}, 250).call(function() {
			if (tilex == boatx && tiley == boaty && !currScene.inboat) {
				walkingClips[right].visible = false;
				walkingClips[right].stop();
				playerTextures = playerTexturesBoat;
				player.texture = playerTextures[right];
				player.visible = true;
				boat.visible = false;
				currScene.inboat = true;
			}
			
			currScene.moving = false;
		});
	} else if (dirHistory[dirHistory.length-1] == down) {
		currScene.moving = true;
		currScene.facing = down;
		if (!currScene.inboat) {
			player.visible = false;
			walkingClips[down].visible = true;
			walkingClips[down].play();
		}
		player.texture = playerTextures[down];
		
		if (currScene.checkCollisions(down)) {
			currScene.moving = false;
			return;
		} else if (tiley == 18 && tilex == 20) {
			playerContainer.x = playerContainer.x - 352;
			playerContainer.y = playerContainer.y + 192;
			walkingClips[down].visible = false;
			walkingClips[down].stop();
			playerTextures = playerTexturesNoHat;
			walkingClips = walkingClipsNoHat;
			tilex = 9;
			tiley = 24;
			currScene.moving = false;
			return;
		} else if (tiley == 18 && tilex == 9) {
			playerContainer.y = playerContainer.y + 192;
			tiley = 24;
			currScene.follow = true;
			currScene.moving = false;
			return;
		} else if (tiley == 5 && tilex == 4) {
			playerContainer.y = playerContainer.y + 800;
			tiley = 30;
			currScene.moving = false;
			return;
		}
		
		tiley++;
		createjs.Tween.get(playerContainer).to({y: playerContainer.y + 32}, 250).call(function() {
			if (tilex == boatx && tiley == boaty && !currScene.inboat) {
				walkingClips[down].visible = false;
				walkingClips[down].stop();
				playerTextures = playerTexturesBoat;
				player.texture = playerTextures[down];
				player.visible = true;
				boat.visible = false;
				currScene.inboat = true;
			}
			
			currScene.moving = false;
		});
	} else if (dirHistory[dirHistory.length-1] == left) {
		currScene.moving = true;
		currScene.facing = left;
		if (!currScene.inboat) {
			player.visible = false;
			walkingClips[left].visible = true;
			walkingClips[left].play();
		}
		player.texture = playerTextures[left];
		
		if (currScene.checkCollisions(left)) {
			currScene.moving = false;
			return;
		} else if (tilex == 39 && tiley == 59) {
			playerTextures = playerTexturesNoHat;
			currScene.inboat = false;
			boat.texture = boatTextures[left];
			player.texture = playerTextures[left];
			player.visible = false;
			boatx = tilex;
			boaty = tiley;
			boat.x = playerContainer.x;
			boat.y = playerContainer.y+32;
			boat.visible = true;
			walkingClips[left].visible = true;
			walkingClips[left].play();
		}
		
		tilex--;
		createjs.Tween.get(playerContainer).to({x: playerContainer.x - 32}, 250).call(function() {
			if (tilex == boatx && tiley == boaty && !currScene.inboat) {
				walkingClips[left].visible = false;
				walkingClips[left].stop();
				playerTextures = playerTexturesBoat;
				player.texture = playerTextures[left];
				player.visible = true;
				boat.visible = false;
				currScene.inboat = true;
			}
			
			currScene.moving = false;
		});
	}
}

playGame.prototype.checkCollisions = function(direction) {
	if (direction == up) {
		if ((tilex == 22 && (tiley == 58 || tiley == 60)) || (tilex == 4 && tiley == 30 && !currScene.windowbroken)) {
			return true;
		}
		
		for (var i=0; i<collisions.length; i++) {
			if (tu.getIndex(playerContainer.x, playerContainer.y-32, 32, 32, 70) == collisions[i]) {
				return true;
			}
		}
	} else if (direction == right) {
		if (((tilex == 28 || tilex == 29) && (tiley == 49 || tiley == 50)) || (tilex == 30 && tiley == 17 && !currScene.rockbroken) || (tilex == 38 && tiley == 59 && (tilex != boatx-1 || tiley != boaty)) || (tilex == 59 && tiley == 34 && !currScene.cuttree)) {
			return true;
		}
		
		for (var i=0; i<collisions.length; i++) {
			if (tu.getIndex(playerContainer.x+32, playerContainer.y, 32, 32, 70) == collisions[i]) {
				return true;
			}
		}
	} else if (direction == down) {
		if ((tilex == 22 && (tiley == 57 || tiley == 59) || (tilex == 45 && tiley == 53 && (tilex != boatx || tiley != boaty-1)))) {
			return true;
		}
		
		for (var i=0; i<collisions.length; i++) {
			if (tu.getIndex(playerContainer.x, playerContainer.y+32, 32, 32, 70) == collisions[i]) {
				return true;
			}
		}
	} else if (direction == left) {
		if ((tilex == 10 && tiley == 61 && (tilex != boatx+1 || tiley != boaty)) || ((tilex == 29 || tilex == 30) && (tiley == 49 || tiley == 50))) {
			return true;
		}
		for (var i=0; i<collisions.length; i++) {
			if (tu.getIndex(playerContainer.x-32, playerContainer.y, 32, 32, 70) == collisions[i]) {
				return true;
			}
		}
	}
}

playGame.prototype.interact = function() {
	if (!currScene.moving) {
		currScene.moving = true;
		if (tilex == 35 && tiley == 20 && !currScene.hascavegem) {
			if (currScene.hasshovel) {
				cavegem.visible = false;
				currScene.hascavegem = true;
			}
			currScene.moving = false;
		} else if (tilex == 60 && tiley == 61 && !currScene.hasislandgem) {
			if (currScene.hasshovel) {
				islandgem.visible = false;
				currScene.hasislandgem = true;
			}
			currScene.moving = false;
		} else if (tilex == 66 && tiley == 34 && !currScene.hasforestgem) {
			if (currScene.hasshovel) {
				forestgem.visible = false;
				currScene.hasforestgem = true;
			}
			currScene.moving = false;
		} else if (currScene.facing == up) {
			if (tilex == 4 && tiley == 32 && !currScene.hasshovel) {
				currScene.hasshovel = true;
				shovel.visible = false;
				currScene.moving = false;
			} else if (tilex == 4 && tiley == 30 && !currScene.windowbroken) {
				if (currScene.hasshovel) {
					currScene.windowbroken = true;
					buildingWindow.visible = false;
					currScene.moving = false;
				}
			} else if (tilex == 25 && tiley == 13 && !currScene.haspick) {
				currScene.haspick = true;
				pick.visible = false;
				currScene.moving = false;
			}
			
		} else if (currScene.facing == right) {
			if (tilex == 7 && tiley == 4 && !currScene.hashat) {
				currScene.hashat = true;
				hat.visible = false;
				currScene.moving = false;
			} else if (tilex == 30 && tiley == 17 && !currScene.rockbroken) {
				if (currScene.haspick) {
					rock.play();
					picking.visible = true;
					picking.play();
				} else {
					currScene.moving = false;
				}
			} else if (tilex == 59 && tiley == 34 && !currScene.cuttree) {
				if (currScene.hasaxe) {
					tree.visible = false;
					currScene.cuttree = true;
					currScene.moving = false;
				}
			}
		} else if (currScene.facing == down) {
			if (tilex == 56 && tiley == 9 && !currScene.hasaxe) {
				axe.visible = false;
				currScene.hasaxe = true;
				currScene.moving = false;
			}
		} else if (currScene.facing == left) {
			if (tilex == 57 && tiley == 10 && !currScene.hasaxe) {
				axe.visible = false;
				currScene.hasaxe = true;
				currScene.moving = false;
			}
		} else {
			currScene.moving = false;
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
		currScene.move();
	}else if (e.keyCode == 68 && dirHistory.indexOf(right) == -1) { //move right
		dirHistory.push(right);
		currScene.move();
	} else if (e.keyCode == 83 && dirHistory.indexOf(down) == -1) { //move down
		dirHistory.push(down);
		currScene.move();
	} else if (e.keyCode == 65 && dirHistory.indexOf(left) == -1) { //move left
		dirHistory.push(left);
	} else if (e.keyCode == 32) { //interact
		currScene.interact();
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
	
	if (currScene.follow) {
		currScene.updateCamera();
	}
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