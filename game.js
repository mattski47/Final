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
var playerTexturesNoHat;
var playerTexturesHat;
var walkingClips;
var walkingClipsNoHat;
var walkingClipsHat;

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
	
	playerTexturesNoHat = [PIXI.Texture.fromFrame("walkingup1.png"), PIXI.Texture.fromFrame("walkingright1.png"), PIXI.Texture.fromFrame("walkingdown1.png"), PIXI.Texture.fromFrame("walkingleft1.png")];
	playerTexturesHat = [PIXI.Texture.fromFrame("walkinguphat1.png"), PIXI.Texture.fromFrame("walkingrighthat1.png"), PIXI.Texture.fromFrame("walkingdownhat1.png"), PIXI.Texture.fromFrame("walkinglefthat1.png")];
	playerTextures = playerTexturesNoHat;
	
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
		
		walkingClipsHat[i].anchor.x = 0;
		walkingClipsHat[i].anchor.y = 0.25;
		walkingClipsHat[i].visible = false;
		walkingClipsHat[i].animationSpeed = 0.1;
		playerContainer.addChild(walkingClipsHat[i]);
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
		
		if (tiley == 3 || 
		(tiley == 4 && ((tilex >= 52 && tilex <= 54) || tilex >= 60)) || 
		(tiley == 5 && (tilex == 50 || tilex == 51 || tilex >= 62)) || 
		(tiley == 6 && (tilex == 48 || tilex == 49)) || 
		(tiley == 7 && (tilex == 47 || tilex >= 64)) || 
		(tiley == 8 && tilex >= 65) || 
		(tiley == 9 && tilex == 46) || 
		(tiley == 10 && tilex >= 66) || 
		(tiley == 12 && tilex >= 18 && tilex <= 23) || 
		(tiley == 13 && (tilex == 17 || (tilex >= 24 && tilex <= 28))) || 
		(tiley == 14 && (tilex == 29 || tilex == 33 || tilex == 34)) || 
		(tiley == 15 && tilex >= 35 && tilex <= 37) || 
		(tiley == 17 && tilex >= 30 && tilex <= 32) || 
		(tiley == 23 && tilex >= 48 && tilex <= 50) || 
		(tiley == 24 && (tilex <= 8 || (tilex >= 10 && tilex <= 47) || tilex >= 64)) || 
		(tiley == 25 && (tilex == 5 || (tilex >= 13 && tilex <= 18) || (tilex >= 38 && tilex <= 43) || (tilex >= 59 && tilex <= 63))) || 
		(tiley == 26 && (tilex == 4 || tilex == 19 || tilex == 20 || tilex == 37 || tilex == 57 || tilex == 58)) || 
		(tiley == 27 && (tilex == 3 || tilex == 21 || tilex == 22 || tilex == 36 || tilex == 56)) || 
		(tiley == 28 && ((tilex >= 23 && tilex <= 35) || tilex == 55)) || 
		(tiley == 30 && tilex == 54) || 
		(tiley == 31 && ((tilex >= 47 && tilex <= 49) || tilex >= 65)) || 
		(tiley == 32 && (tilex == 46 || tilex == 50 || tilex == 64)) || 
		(tiley == 33 && (tilex == 45 || tilex == 63)) || 
		(tiley == 34 && (tilex == 44 || (tilex >= 60 && tilex <= 62))) || 
		(tiley == 35 && tilex == 27) || 
		(tiley == 36 && tilex == 43) || 
		(tiley == 38 && (tilex == 30 || tilex == 60)) || 
		(tiley == 40 && (tilex == 57 || tilex >= 61)) || 
		(tiley == 41 && (tilex == 46 || tilex == 47 || tilex == 55 || tilex == 56)) || 
		(tiley == 42 && (tilex == 48 || tilex == 49 || tilex == 54)) || 
		(tiley == 43 && tilex == 50) || 
		(tiley == 45 && (tilex <= 27 || (tilex >= 31 && tilex <= 34))) || 
		(tiley == 46 && (tilex <= 23 || (tilex >= 35 && tilex <= 37) || tilex >= 65)) || 
		(tiley == 47 && ((tilex >= 10 && tilex <= 21) || tilex == 38 || tilex == 39 || tilex == 63 || tilex == 64)) || 
		(tiley == 48 && ((tilex >= 12 && tilex <= 19) || tilex == 40 || tilex == 41 || (tilex >= 54 && tilex <= 62))) || 
		(tiley == 49 && ((tilex >= 15 && tilex <= 17) || (tilex >= 26 && tilex <= 28) || (tilex >= 30 && tilex <= 32) || (tilex >= 42 && tilex <= 44))) || 
		(tiley == 50 && (tilex <= 7 || tilex == 24 || tilex == 25 || (tilex >= 33 && tilex <= 35) || (tilex >= 45 && tilex <= 50))) || 
		(tiley == 51 && (tilex == 8 || tilex == 9 || tilex == 22 || tilex == 23 || tilex == 36 || tilex == 37 || tilex >= 65)) || 
		(tiley == 52 && ((tilex >= 10 && tilex <= 12) || tilex == 20 || tilex == 21 || tilex == 27 || tilex == 28 || (tilex >= 30 && tilex <= 32) || tilex == 38 || tilex == 39 || (tilex >= 56 && tilex <= 64))) || 
		(tiley == 53 && ((tilex >= 13 && tilex <= 19) || tilex == 25 || tilex == 26 || tilex == 33 || (tilex >= 40 && tilex <= 42) || (tilex >= 53 && tilex <= 55))) || 
		(tiley == 54 && ((tilex >= 5 && tilex <= 7) || tilex == 34 || tilex == 43 || tilex == 44 || (tilex >= 46 && tilex <= 52))) || 
		(tiley == 55 && ((tilex >= 13 && tilex <= 16) || tilex == 24 || tilex == 35 || (tilex >= 59 && tilex <= 61))) || 
		(tiley == 56 && (tilex == 6 || tilex == 12 || (tilex >= 17 && tilex <= 19) || tilex == 36 || (tilex >= 49 && tilex <= 52))) || 
		(tiley == 57 && (tilex == 20 || tilex == 37 || tilex == 48 || tilex == 53 || tilex == 62)) || 
		(tiley == 58 && (tilex <= 5 || tilex == 7 || tilex == 8 || tilex == 11 || tilex == 22 || tilex == 23 || tilex == 47 || tilex >= 66)) || 
		(tiley == 59 && (tilex == 3 || tilex == 21 || tilex == 38 || tilex == 54 || tilex == 58)) || 
		(tiley == 60 && (tilex == 22 || tilex == 46)) || 
		(tiley == 61 && tilex == 10) || 
		(tiley == 63 && (tilex == 21 || tilex == 23 || tilex == 24 || tilex == 38 || tilex == 46 || tilex == 54)) || 
		(tiley == 64 && ((tilex >= 18 && tilex <= 20) || (tilex >= 25 && tilex <= 37) || tilex == 47 || (tilex >= 58 && tilex <= 63))) || 
		(tiley == 65 && ((tilex >= 10 && tilex <= 17) || (tilex >= 48 && tilex <= 53)))) {
			currScene.moving = false;
			return;
		} else if (tiley == 24 && tilex == 9){
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
		
		if ((tilex == 3 && (tiley == 53 || tiley == 54)) || 
		(tilex == 5 && tiley == 55) || 
		(tilex == 6 && tiley == 57) || 
		(tilex == 7 && (tiley == 50 || (tiley >= 54 && tiley <= 56))) || 
		(tilex == 8 && tiley >= 66) || 
		(tilex == 9 && (tiley == 46 || tiley == 51 || (tiley >= 57 && tiley <= 60) || (tiley >= 62 && tiley <= 64))) || 
		(tilex == 10 && (tiley == 55 || tiley == 56)) || 
		(tilex == 11 && (tiley == 47 || tiley == 54)) || 
		(tilex == 12 && (tiley == 24 || tiley == 52)) || 
		(tilex == 14 && tiley == 48) || 
		(tilex == 16 && (tiley == 39 || tiley == 55 || tiley == 63)) || 
		(tilex == 18 && (tiley == 25 || tiley == 51 || tiley >= 66)) || 
		(tilex == 19 && ((tiley >= 34 && tiley <= 38) || tiley == 56 || tiley == 62)) || 
		(tilex == 20 && (tiley == 18 || tiley == 26 || tiley == 33 || tiley == 50 || tiley == 57 || tiley == 58 || tiley == 60 || tiley == 61)) || 
		(tilex == 21 && tiley == 32) || 
		(tilex == 22 && (tiley == 27 || tiley == 31 || tiley == 49 || (tiley >= 54 && tiley <= 57) || (tiley >= 59 && tiley <= 62))) || 
		(tilex == 23 && (tiley == 12 || tiley == 52 || tiley == 53)) || 
		(tilex == 24 && (tiley == 48 || tiley == 63)) || 
		(tilex == 25 && (tiley == 22 || tiley == 51)) || 
		(tilex == 27 && tiley == 21) || 
		(tilex == 28 && (tiley == 13 || tiley == 49 || tiley == 50)) || 
		(tilex == 29 && ((tiley >= 14 && tiley <= 16) || (tiley >= 18 && tiley <= 20) || (tiley >= 35 && tiley <= 37) || (tiley >= 48 && tiley <= 51))) || 
		(tilex == 30 && tiley >= 31 && tiley <= 44) || 
		(tilex == 32 && (tiley == 49 || tiley == 52 || tiley >= 66)) || 
		(tilex == 33 && tiley == 53) || 
		(tilex == 34 && (tiley == 14 || tiley == 45 || tiley == 54)) || 
		(tilex == 35 && (tiley == 20 || tiley == 50 || tiley == 55)) || 
		(tilex == 36 && (tiley == 18 || tiley == 19 || tiley == 30 || tiley == 56 || tiley == 62)) || 
		(tilex == 37 && ((tiley >= 15 && tiley <= 17) || tiley == 28 || tiley == 29 || tiley == 46 || tiley == 51 || tiley == 57 || tiley == 58 || tiley == 60 || tiley ==61)) || 
		(tilex == 39 && (tiley == 47 || tiley == 52)) || 
		(tilex == 41 && tiley == 48) || 
		(tilex == 42 && tiley == 53) || 
		(tilex == 44 && tiley == 49) || 
		(tilex == 45 && (tiley == 27 || (tiley >= 37 && tiley <= 40) || tiley == 53 || (tiley >= 57 && tiley <= 59) || tiley == 61 || tiley == 62)) || 
		(tilex == 46 && (tiley == 35 || tiley == 36 || tiley == 56 || tiley == 63)) || 
		(tilex == 47 && (tiley == 34 || tiley == 41 || tiley == 55 || tiley == 64)) || 
		(tilex == 48 && tiley == 26) || 
		(tilex == 49 && (tiley == 31 || tiley == 33 || tiley == 42 || tiley == 44)) || 
		(tilex == 51 && tiley == 52) || 
		(tilex == 52 && (tiley ==56 || tiley == 62 || tiley == 63 || tiley >= 66)) || 
		(tilex == 53 && ((tiley >= 23 && tiley <= 29) || (tiley >= 31 && tiley <= 41) || (tiley >= 43 && tiley <= 47) || tiley == 57 || tiley == 58 || tiley == 60 || tiley == 61)) || 
		(tilex == 54 && tiley == 51) || 
		(tilex == 55 && tiley == 22) || 
		(tilex == 57 && (tiley == 43 || (tiley >= 54 && tiley <= 58) || (tiley >= 60 && tiley <= 63))) || 
		(tilex == 59 && (tiley == 3 || tiley == 21 || (tiley >= 30 && tiley <= 33) || (tiley >= 35 && tiley <= 37))) || 
		(tilex == 60 && (tiley == 29 || tiley == 38 || tiley == 39)) || 
		(tilex == 61 && (tiley == 4 || tiley == 20 || tiley == 28 || tiley == 55 || tiley == 56 || tiley >= 66)) || 
		(tilex == 62 && tiley >= 57 && tiley <= 62) || 
		(tilex == 63 && (tiley == 5 || tiley == 6 || tiley == 19 || tiley == 50)) || 
		(tilex == 64 && (tiley == 7 || tiley == 17 || tiley == 18)) || 
		(tilex == 65 && (tiley == 8 || tiley == 9 || tiley == 15 || tiley == 16 || tiley == 49 || (tiley >= 54 && tiley <= 57) || tiley >= 62)) || 
		tilex == 66) {
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
		
		if ((tiley == 11 && tilex == 46) || 
		(tiley == 13 && tilex == 47) || 
		(tiley == 14 && tilex >= 66) || 
		(tiley == 16 && (tilex == 48 || tilex >= 65)) || 
		(tiley == 17 && ((tilex >= 17 && tilex <= 19) || tilex == 21 || tilex == 22 || (tilex >= 30 && tilex <= 32) || tilex == 37 || tilex == 49)) || 
		(tiley == 18 && (tilex == 23 || tilex >= 64)) || 
		(tiley == 19 && (tilex == 24 || tilex == 33 || tilex == 34 || tilex == 36 || tilex == 50 || tilex >= 62)) || 
		(tiley == 20 && (tilex == 28 || tilex == 29 || tilex == 35 || tilex >= 60)) || 
		(tiley == 21 && (tilex == 26 || tilex == 27 || tilex >= 56)) || 
		(tiley == 22 && (tilex == 25 || tilex >= 54)) || 
		(tiley == 25 && (tilex == 49 || tilex == 50)) || 
		(tiley == 26 && tilex >= 46 && tilex <= 48) || 
		(tiley == 27 && ((tilex >= 38 && tilex <= 45) || tilex >= 62)) || 
		(tiley == 28 && tilex >= 61) || 
		(tiley == 29 && (tilex == 37 || tilex >= 60)) || 
		(tiley == 30 && ((tilex >= 23 && tilex <= 27) || (tilex >= 31 && tilex <= 36) || tilex == 54)) || 
		(tiley == 31 && tilex == 22) || 
		(tiley == 32 && (tilex == 3 || tilex == 21 || tilex == 50 || tilex == 55 || tilex == 56)) || 
		(tiley == 33 && (tilex == 20 || tilex == 48 || tilex == 49)) || 
		(tiley == 34 && (tilex == 30 || tilex == 47 || (tilex >= 60 && tilex <= 63))) || 
		(tiley == 36 && (tilex <= 4 || tilex == 46 || tilex >= 64)) || 
		(tiley == 37 && (tilex <= 5 || tilex == 27)) || 
		(tiley == 38 && (tilex <= 6 || (tilex >= 17 && tilex <= 19) || tilex == 57)) || 
		(tiley == 39 && tilex <= 16) || 
		(tiley == 42 && (tilex == 43 || tilex == 44 || tilex == 54 || tilex >= 58)) || 
		(tiley == 43 && (tilex == 45 || tilex == 46 || tilex == 50 || tilex >= 55)) || 
		(tiley == 44 && tilex >= 47 && tilex <= 49) || 
		(tiley == 47 && ((tilex >= 25 && tilex <= 28) || (tilex >= 30 && tilex <= 33))) || 
		(tiley == 48 && (tilex <= 8 || tilex == 23 || tilex == 24 || (tilex >= 34 && tilex <= 36) || tilex >= 66)) || 
		(tiley == 49 && (tilex <= 10 || tilex == 21 || tilex == 22 || tilex == 37 || tilex == 38 || tilex >= 64)) || 
		(tiley == 50 && ((tilex >= 11 && tilex <= 13) || tilex == 19 || tilex == 20 || (tilex >= 26 && tilex <= 28) || (tilex >= 30 && tilex <= 33) || tilex == 39 || tilex == 40 || tilex >= 55)) || 
		(tiley == 51 && ((tilex >= 14 && tilex <= 18) || tilex == 24 || tilex == 25 || tilex == 34 || (tilex >= 41 && tilex <= 43) || (tilex >= 52 && tilex <= 54))) || 
		(tiley == 52 && ((tilex >= 4 && tilex <= 8) || tilex == 35 || tilex == 44 || (tilex >= 46 && tilex <= 51))) || 
		(tiley == 53 && ((tilex >= 12 && tilex <= 17) || tilex == 23 || tilex == 36 || (tilex >= 58 && tilex <= 62) || tilex >= 66)) || 
		(tiley == 54 && (tilex <= 3 || tilex == 6 || tilex == 11 || (tilex >= 18 && tilex <= 20) || tilex == 37 || (tilex >= 48 && tilex <= 53))) || 
		(tiley == 55 && (tilex == 21 || tilex == 38 || tilex == 47 || tilex == 54 || tilex == 63)) || 
		(tiley == 56 && (tilex <= 5 || tilex == 7 || tilex == 10 || tilex == 46)) || 
		(tiley == 57 && tilex == 22) || 
		(tiley == 58 && tilex == 23) || 
		(tiley == 59 && (tilex == 21 || tilex == 22 || tilex == 38 || tilex == 54 || tilex == 58)) || 
		(tiley == 60 && tilex == 46) || 
		(tiley == 61 && (tilex == 10 || tilex == 20 || tilex == 24 || tilex == 25 || tilex == 37 || tilex == 47 || tilex == 53 || tilex >= 66)) || 
		(tiley == 62 && ((tilex >= 17 && tilex <= 19) || (tilex >= 26 && tilex <= 36) || tilex == 48 || (tilex >= 59 && tilex <= 62))) || 
		(tiley == 63 && (tilex <= 3 || (tilex >= 11 && tilex <= 16) || (tilex >= 49 && tilex <= 52))) || 
		(tiley == 65 && ((tilex >= 9 && tilex <= 14) || (tilex >= 19 && tilex <= 21) || (tilex >= 33 && tilex <= 45) || (tilex >= 53 && tilex <= 56) || tilex >= 62)) || 
		tiley == 66) {
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
		
		if (tilex == 3 || 
		(tilex == 4 && (tiley == 26 || (tiley >= 33 && tiley <= 36) || tiley == 58 || tiley >= 64)) || 
		(tilex == 5 && (tiley == 25 || tiley == 37 || (tiley >= 54 && tiley <= 56))) || 
		(tilex == 6 && (tiley == 24 || tiley == 38 || tiley == 57)) || 
		(tilex == 7 && (tiley == 39 || tiley == 55)) || 
		(tilex == 9 && (tiley == 49 || (tiley >= 53 && tiley <= 57))) || 
		(tilex == 11 && (tiley == 50 || (tiley >= 58 && tiley <= 60) || tiley == 62 || tiley == 63)) || 
		(tilex == 12 && (tiley == 56 || tiley == 57)) || 
		(tilex == 13 && tiley == 55) || 
		(tilex == 14 && tiley == 51) || 
		(tilex == 15 && tiley >= 66) || 
		(tilex == 17 && tiley >= 13 && tiley <= 17) || 
		(tilex == 18 && (tiley == 12 || tiley == 48 || tiley == 54 || tiley == 64)) || 
		(tilex == 20 && (tiley == 18 || tiley == 47 || tiley == 52)) || 
		(tilex == 21 && (tiley == 55 || tiley == 63)) || 
		(tilex == 22 && (tiley == 46 || tiley == 51 || (tiley >= 56 && tiley <= 58) || (tiley >= 60 && tiley <= 62) || tiley >= 66)) || 
		(tilex == 23 && tiley == 18) || 
		(tilex == 24 && (tiley == 19 || tiley == 45 || tiley == 50 || (tiley >= 55 && tiley <= 57) || (tiley >= 59 && tiley <= 61))) || 
		(tilex == 25 && ((tiley >= 20 && tiley <= 22) || tiley == 53 || tiley == 54)) || 
		(tilex == 26 && (tiley == 49 || tiley == 62)) || 
		(tilex == 27 && ((tiley >= 35 && tiley <= 37) || tiley == 52)) || 
		(tilex == 28 && ((tiley >= 31 && tiley <= 34) || (tiley >= 38 && tiley <= 44))) || 
		(tilex == 29 && tiley >= 48 && tiley <= 51) || 
		(tilex == 30 && (tiley == 49 || tiley == 50)) || 
		(tilex == 33 && ((tiley >= 14 && tiley <= 16) || tiley == 18 || tiley == 19)) || 
		(tilex == 34 && (tiley == 48 || tiley == 51)) || 
		(tilex == 35 && (tiley == 20 || tiley == 52)) || 
		(tilex == 36 && (tiley == 27 || tiley == 53)) || 
		(tilex == 37 && (tiley == 26 || tiley == 49 || tiley == 54)) || 
		(tilex == 38 && (tiley == 25 || tiley == 55 || tiley == 63)) || 
		(tilex == 39 && (tiley == 50 || (tiley >= 56 && tiley <= 58) || (tiley >= 60 && tiley <= 62))) || 
		(tilex == 41 && tiley == 51) || 
		(tilex == 43 && tiley >= 36 && tiley <= 42) || 
		(tilex == 44 && (tiley == 24 || tiley == 34 || tiley == 35 || tiley == 52)) || 
		(tilex == 45 && (tiley == 33 || tiley == 43 || tiley == 53)) || 
		(tilex == 46 && (tiley <= 11 || tiley == 32 || tiley >= 66)) || 
		(tilex == 47 && (tiley <= 8 || tiley == 12 || tiley == 13 || tiley == 31 || tiley == 44 || tiley == 58 || tiley == 59 || tiley == 61)) || 
		(tilex == 48 && (tiley <= 6 || (tiley >= 14 && tiley <= 23) || tiley == 57 || tiley == 62)) || 
		(tilex == 49 && (tiley == 17 || tiley == 56 || tiley == 63)) || 
		(tilex == 50 && (tiley <= 5 || tiley == 18 || tiley == 19)) || 
		(tilex == 51 && ((tiley >= 20 && tiley <= 22) || (tiley >= 26 && tiley <= 31) || (tiley >= 33 && tiley <= 42) || (tiley >= 44 && tiley <= 49))) || 
		(tilex == 52 && tiley <= 4) || 
		(tilex == 53 && tiley == 53) || 
		(tilex == 54 && (tiley == 55 || tiley == 63 || tiley == 64)) || 
		(tilex == 55 && (tiley <= 3 || tiley == 28 || tiley == 29 || (tiley >= 31 && tiley <= 41) || tiley == 43 || (tiley >= 56 && tiley <= 58) || (tiley >= 60 && tiley <= 62))) || 
		(tilex == 56 && (tiley == 27 || tiley == 52)) || 
		(tilex == 57 && (tiley == 26 || (tiley >= 33 && tiley <= 40) || tiley >= 66)) || 
		(tilex == 58 && tiley == 39) || 
		(tilex == 59 && (tiley == 25 || (tiley >= 55 && tiley <= 58) || (tiley >= 60 && tiley <= 62))) || 
		(tilex == 63 && (tiley == 33 || tiley == 47 || tiley == 54 || tiley == 55)) || 
		(tilex == 64 && (tiley == 24 || tiley == 32 || tiley == 35 || tiley == 36 || (tiley >= 56 && tiley <= 63))) || 
		(tilex == 65 && (tiley == 31 || tiley == 46 || tiley == 51))) {
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