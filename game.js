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
var textborder;
var message = new PIXI.Text("Find some tools, then find some gems! I recommend you start in some direction other than directly right.", {wordWrap: true, wordWrapWidth: 800});
message.scale.x = 0.23;
message.scale.y = 0.23;
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
var cavex;
var forestx;
var islandx;
var cavegem;
var forestgem;
var islandgem;
var picking;
var digging;
var digginghat;
var chopping;
var hitting;

var playerObject;
var boatObject;
var axeObject;
var pickObject;
var shovelObject;
var hatObject;
var buildingWindowObject;
var rockObject;
var treeObject;
var cavexObject;
var forestxObject;
var islandxObject;

var playerContainer = new PIXI.Container();
var playerTextures = [];
var playerTexturesNoHat = [];
var playerTexturesHat = [];
var playerTexturesBoat = [];
var walkingClips = [];
var walkingClipsNoHat = [];
var walkingClipsHat = [];
var endClip;

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
	textborder = new PIXI.Sprite(PIXI.Texture.fromFrame("textborder.png"));
	
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
	tree = new PIXI.extras.MovieClip.fromFrames(["treefalling1.png", "treefalling2.png", "treefalling3.png", "treefalling4.png", "treefalling5.png", "treefalling6.png"]);
	cavex = new PIXI.extras.MovieClip.fromFrames(["digx1.png", "digx2.png", "digx3.png", "digx4.png"]);
	forestx = new PIXI.extras.MovieClip.fromFrames(["digx1.png", "digx2.png", "digx3.png", "digx4.png"]);
	islandx = new PIXI.extras.MovieClip.fromFrames(["digx1.png", "digx2.png", "digx3.png", "digx4.png"]);
	
	cavegem = new PIXI.Sprite(PIXI.Texture.fromFrame("cavegem.png"));
	forestgem = new PIXI.Sprite(PIXI.Texture.fromFrame("forestgem.png"));
	islandgem = new PIXI.Sprite(PIXI.Texture.fromFrame("islandgem.png"));
	
	picking = new PIXI.extras.MovieClip.fromFrames(["picking1.png", "picking2.png", "picking3.png", "picking1.png", "picking2.png", "picking3.png", "picking1.png", "picking2.png", "picking3.png"]);
	digging = new PIXI.extras.MovieClip.fromFrames(["digging1.png", "digging2.png", "digging3.png", "digging1.png", "digging2.png", "digging3.png", "digging1.png", "digging2.png", "digging3.png"]);
	digginghat = new PIXI.extras.MovieClip.fromFrames(["digginghat1.png", "digginghat2.png", "digginghat3.png", "digginghat1.png", "digginghat2.png", "digginghat3.png", "digginghat1.png", "digginghat2.png", "digginghat3.png"]);
	chopping = new PIXI.extras.MovieClip.fromFrames(["chopping1.png", "chopping2.png", "chopping3.png", "chopping1.png", "chopping2.png", "chopping3.png", "chopping1.png", "chopping2.png", "chopping3.png"]);
	hitting = new PIXI.extras.MovieClip.fromFrames(["hitting1.png", "hitting2.png"]);
	endClip = new PIXI.extras.MovieClip.fromFrames(["endanimation1.png", "endanimation2.png", "endanimation3.png", "endanimation2.png", "endanimation3.png", "endanimation4.png", "endanimation5.png"]);
	
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
	this.moving = false;
	this.hashat = false;
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
	this.ridenboat = false;
	this.enteredcave = false;
	this.gemsfound = 0;
	
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
	cavexObject = world.getObject("cavegem");
	forestxObject = world.getObject("forestgem");
	islandxObject = world.getObject("islandgem");
	
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
	rock.onComplete = function () {
		message.text = "It's fun just breaking everything in my way.\n"
		currScene.rockbroken = true;
	}
	objectContainer.addChild(rock);
	
	tree.x = treeObject.x;
	tree.y = treeObject.y;
	tree.anchor.x = 0;
	tree.anchor.y = 1.0;
	tree.loop = false;
	tree.animationSpeed = 0.1;
	tree.onComplete = function () {
		message.text = "I'd like to be a tree, but somewhere far away from axes.\n";
		currScene.cuttree = true;
	}
	objectContainer.addChild(tree);
	
	cavegem.x = cavexObject.x;
	cavegem.y = cavexObject.y;
	cavegem.anchor.x = 0;
	cavegem.anchor.y = 1.0;
	
	forestgem.x = forestxObject.x;
	forestgem.y = forestxObject.y;
	forestgem.anchor.x = 0;
	forestgem.anchor.y = 1.0;
	
	islandgem.x = islandxObject.x;
	islandgem.y = islandxObject.y;
	islandgem.anchor.x = 0;
	islandgem.anchor.y = 1.0;
	
	cavex.x = cavexObject.x;
	cavex.y = cavexObject.y;
	cavex.anchor.x = 0;
	cavex.anchor.y = 1.0;
	cavex.loop = false;
	cavex.animationSpeed = 0.03;
	cavex.onComplete = function () {
		currScene.hascavegem = true;
		objectContainer.addChild(cavegem);
		createjs.Tween.get(cavegem).to({y: cavegem.y-32}, 1000, createjs.Ease.circIn).call(function () {
			objectContainer.removeChild(cavegem);
			currScene.checkGems("Yellow Gem");
		});
	}
	objectContainer.addChild(cavex);
	
	forestx.x = forestxObject.x;
	forestx.y = forestxObject.y;
	forestx.anchor.x = 0;
	forestx.anchor.y = 1.0;
	forestx.loop = false;
	forestx.animationSpeed = 0.03;
	forestx.onComplete = function () {
		currScene.hasforestgem = true;
		objectContainer.addChild(forestgem);
		createjs.Tween.get(forestgem).to({y: forestgem.y-32}, 1000, createjs.Ease.circIn).call(function () {
			objectContainer.removeChild(forestgem);
			currScene.checkGems("Green Gem");
		});
	}
	objectContainer.addChild(forestx);
	
	islandx.x = islandxObject.x;
	islandx.y = islandxObject.y;
	islandx.anchor.x = 0;
	islandx.anchor.y = 1.0;
	islandx.loop = false;
	islandx.animationSpeed = 0.03;
	islandx.onComplete = function () {
		currScene.hasislandgem = true;
		objectContainer.addChild(islandgem);
		createjs.Tween.get(islandgem).to({y: islandgem.y-32}, 1000, createjs.Ease.circIn).call(function () {
			objectContainer.removeChild(islandgem);
			currScene.checkGems("Blue Gem");
		});
	}
	objectContainer.addChild(islandx);
	
	playerContainer.width = 32;
	playerContainer.height = 32;
	playerContainer.x = playerObject.x;
	playerContainer.y = playerObject.y;
	gameContainer.addChild(playerContainer);
	
	textborder.anchor.x = 0.5;
	textborder.anchor.y = 0.5;
	textborder.x = 16;
	textborder.y = 105;
	playerContainer.addChild(textborder);
	
	message.anchor.x = 0;
	message.anchor.y = 0.5;
	message.x = -80;
	message.y = 106;
	playerContainer.addChild(message);
	
	player = new PIXI.Sprite(playerTextures[down]);
	player.anchor.x = 0;
	player.anchor.y = 0.25;
	playerContainer.addChild(player);
	
	endClip.anchor.x = 0;
	endClip.anchor.y = 0.25;
	endClip.animationSpeed = 0.02;
	endClip.loop = false;
	endClip.onComplete = function() {
		playerContainer.removeChild(endClip);
		message.text = "They disapeared! How magical.\n";
	}
	
	tilex = 52;
	tiley = 25;
	boatx = 9;
	boaty = 61;
	
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
	picking.loop = false;
	picking.animationSpeed = 0.09;
	picking.onComplete = function () {
		playerContainer.removeChild(picking);
		currScene.moving = false;
	}
	
	digging.anchor.x = 0;
	digging.anchor.y = 0.25;
	digging.visible = false;
	digging.loop = false;
	digging.animationSpeed = 0.09;
	digging.onComplete = function () {
		digging.visible = false;
		player.visible = true;
	}
	
	digginghat.anchor.x = 0;
	digginghat.anchor.y = 0.25;
	digginghat.visible = false;
	digginghat.loop = false;
	digginghat.animationSpeed = 0.09;
	digginghat.onComplete = function () {
		digginghat.visible = false;
		player.visible = true;
	}
	
	chopping.anchor.x = 0;
	chopping.anchor.y = 0.25;
	chopping.loop = false;
	chopping.animationSpeed = 0.09;
	chopping.onComplete = function () {
		player.visible = true;
		playerContainer.removeChild(chopping);
		tree.play();
		currScene.moving = false;
	}
	
	hitting.anchor.x = 0;
	hitting.anchor.y = 0.25;
	hitting.loop = false;
	hitting.animationSpeed = 0.15;
	hitting.onComplete = function () {
		player.visible = true;
		objectContainer.removeChild(buildingWindow);
		currScene.windowbroken = true;
		currScene.moving = false;
		playerContainer.removeChild(hitting);
		message.text = "It's okay. It's not like anyone lives here anymore...I think.\n"
	}
	
	playerContainer.addChild(digging);
	playerContainer.addChild(digginghat);
	
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
				if (!currScene.enteredcave) {
					message.text = "Ah that's better.\n";
					currScene.enteredcave = true;
				}
			} else {
				playerContainer.x = playerContainer.x - 32
				playerContainer.y = playerContainer.y - 256;
				tilex = 8;
				tiley = 16;
				currScene.moving = false;
				message.text = "It's too dark in here. I should find a way to bring light with me so I can see.";
			}
			return;
		} else if (tiley == 30 && tilex == 4) {
			playerContainer.y = playerContainer.y - 768;
			tiley = 6;
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
			boat.y = playerContainer.y + 32;
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
			boat.y = playerContainer.y + 32;
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
			playerContainer.y = playerContainer.y + 160;
			walkingClips[down].visible = false;
			walkingClips[down].stop();
			playerTextures = playerTexturesNoHat;
			walkingClips = walkingClipsNoHat;
			tilex = 9;
			tiley = 23;
			currScene.moving = false;
			return;
		} else if (tiley == 16 && tilex == 8) {
			playerContainer.x = playerContainer.x + 32;
			playerContainer.y = playerContainer.y + 224;
			tilex = 9
			tiley = 23;
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
				if (!currScene.ridenboat) {
					currScene.ridenboat = true;
					message.text = "Ha! And they said bringing 25 gallons of gasoline was unnecessary. Look at me now!"
				}
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
		if (((tilex == 28 || tilex == 29) && (tiley == 49 || tiley == 50)) || (tilex == 30 && tiley == 17 && !currScene.rockbroken) || (tilex == 59 && tiley == 34 && !currScene.cuttree)) {
			return true;
		}
		
		if (tilex == 38 && tiley == 59 && (tilex != boatx-1 || tiley != boaty)) {
			if (currScene.ridenboat) {
				message.text = "Where did I leave that thing again?\n";
			} else {
				message.text = "I wonder if there is a boat around here somewhere?\n";
			}
			return true;
		}
		
		for (var i=0; i<collisions.length; i++) {
			if (tu.getIndex(playerContainer.x+32, playerContainer.y, 32, 32, 70) == collisions[i]) {
				return true;
			}
		}
	} else if (direction == down) {
		if ((tilex == 22 && (tiley == 57 || tiley == 59))) {
			return true;
		}
		
		if (tilex == 45 && tiley == 53 && (tilex != boatx || tiley != boaty-1)) {
			if (currScene.ridenboat) {
				message.text = "Where did I leave that thing again?\n";
			} else {
				message.text = "I wonder if there is a boat around here somewhere?\n";
			}
			return true;
		}
		
		for (var i=0; i<collisions.length; i++) {
			if (tu.getIndex(playerContainer.x, playerContainer.y+32, 32, 32, 70) == collisions[i]) {
				return true;
			}
		}
	} else if (direction == left) {
		if ((tilex == 29 || tilex == 30) && (tiley == 49 || tiley == 50)) {
			return true;
		}
		
		if (tilex == 10 && tiley == 61 && (tilex != boatx+1 || tiley != boaty)) {
			if (currScene.ridenboat) {
				message.text = "Where did I leave that thing again?\n";
			} else {
				message.text = "I wonder if there is a boat around here somewhere?\n";
			}
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
		for (var i=0; i<4; i++) {
			walkingClips[i].visible = false;
			walkingClips[i].stop();
			player.visible = true;
		}
		
		if (currScene.facing == up) {
			if (tilex == 4 && tiley == 32) {
				currScene.hasshovel = true;
				//shovel.visible = false;
				objectContainer.removeChild(shovel);
				currScene.moving = false;
				message.text = "Found: Shovel!\nWhy did I go digging for treasure without one?";
			} else if (tilex == 4 && tiley == 30 && !currScene.windowbroken) {
				if (currScene.hasshovel) {
					player.visible = false;
					playerContainer.addChild(hitting);
					//hitting.visible = true;
					hitting.play();
					
				} else {
					currScene.moving = false;
					message.text = "Looks like someone tore the boards off but forgot to break the window.";
				}
			} else if (tilex == 25 && tiley == 13) {
				currScene.haspick = true;
				pick.visible = false;
				currScene.moving = false;
				message.text = "Found: Pickaxe!\nDiggy Diggy Hole.";
			} else {
				currScene.moving = false;
				message.text = "The ground here looks nice.\n";
			}
			
		} else if (currScene.facing == right) {
			if (tilex == 7 && tiley == 4) {
				currScene.hashat = true;
				objectContainer.removeChild(hat);
				currScene.moving = false;
				message.text = "Found: Mining Hat!\nGood thing I always carry spare batteries on me at ALL times."
			} else if (tilex == 30 && tiley == 17 && !currScene.rockbroken) {
				if (currScene.haspick) {
					rock.play();
					playerContainer.addChild(picking);
					picking.play();
				} else {
					currScene.moving = false;
					message.text = "A pick would make getting past this rock easier.\n";
				}
			} else if (tilex == 59 && tiley == 34 && !currScene.cuttree) {
				if (currScene.hasaxe) {
					player.visible = false;
					playerContainer.addChild(chopping);
					chopping.play();
				} else {
					currScene.moving = false;
					message.text = "This tree looks small and easy to cut down.\n"
				}
			} else {
				currScene.moving = false;
				message.text = "The ground here looks nice.\n";
			}
			
		} else if (currScene.facing == down) {
			if (tilex == 35 && tiley == 19 && !currScene.hascavegem) {
				cavex.play();
				digginghat.play();
				player.visible = false;
				digginghat.visible = true;
			} else if (tilex == 56 && tiley == 9 && !currScene.hasaxe) {
				objectContainer.removeChild(axe);
				currScene.hasaxe = true;
				currScene.moving = false;
				message.text = "Found: Axe!\nI wonder if they used to cut down this tree.";
			} else if (tilex == 60 && tiley == 60 && !currScene.hasislandgem) {
				if (currScene.hasshovel) {
					islandx.play();
					digging.gotoAndPlay(0);
					player.visible = false;
					digging.visible = true;
				} else {
					currScene.moving = false;
					message.text = "How could I forget to bring my shovel while digging for treasure?";
				}
			} else if (tilex == 66 && tiley == 35 && !currScene.hasforestgem) {
				if (currScene.hasshovel) {
					forestx.play();
					digging.gotoAndPlay(0);
					player.visible = false;
					digging.visible = true;
				} else {
					currScene.moving = false;
					message.text = "How could I forget to bring my shovel while digging for treasure?";
				}
			} else {
				currScene.moving = false;
				message.text = "The ground here looks nice.\n";
			}
			
		} else if (currScene.facing == left) {
			if (tilex == 57 && tiley == 10) {
				objectContainer.removeChild(axe);
				currScene.hasaxe = true;
				currScene.moving = false;
				message.text = "Found: Axe!\nI wonder if they used it to cut down this tree.";
			} else {
				currScene.moving = false;
				message.text = "The ground here looks nice.\n";
			}
		}
	}
}

playGame.prototype.checkGems = function(gem) {
	if (currScene.gemsfound == 0) {
		currScene.moving = false;
		message.text = "Found: " + gem + "!\nOff to a good start finding the first one.";
		currScene.gemsfound++;
	} else if (currScene.gemsfound == 1) {
		currScene.moving = false;
		message.text = "Found: " + gem + "!\nThey are so obviously marked. How are they still here?";
		currScene.gemsfound++;
	} else {
		message.text = "Found: " + gem + "!\n?";
		playerContainer.addChild(endClip);
		endClip.play();
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