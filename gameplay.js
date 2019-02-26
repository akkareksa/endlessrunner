let main = new Phaser.Scene('Main');

main.preload = function(){
	this.load.setBaseURL('assets/')
	this.load.image('ground', 'platform/land.png');
	this.load.image('duri','obstacle/green_little_bug.png');
	this.load.image('lalet','obstacle/fly1.png');
	this.load.image('coin','Coin.png');
	this.load.image('start_btn','start_btn.png');
	this.load.audio('jumpSound','jump.wav');
	this.load.audio('coinSound','coinSound.wav');
	this.load.atlas('character','spritesheet.png','spritesheet.json');
}

var jump=true;
var score;
var scoreText;
var obstacles,coins;
var gameManager;
var runner;
var platformCollider;
var scoreText;
var gameOver;
var jumpSound;
var coinSound;

main.create = function(){
	click=false;
	gameOver=false;
	jumpSound=this.sound.add('jumpSound');
	coinSound=this.sound.add('coinSound');
	runner = this.physics.add.sprite(50,config.height-200,'character','RunRight01.png');
	gameManager= this;
	this.score=0;
	this.scoreText = this.add.text(16,16,'score: 0', { font: "30px Arial", fill: "#ffffff" }); 
	// runner.setGravity(0,1000);
	// runner.setEnable();
	runner.setGravity(0,1000);
	runner.setCollideWorldBounds(true);
	this.obstacles = this.add.group();
	this.coins = this.add.group();
	this.anims.create(
		{key:'running',
		frames: this.anims.generateFrameNames('character',{start:1, end:4, zeroPad:2, prefix:'RunRight',suffix:'.png'}),
		repeat:-1,
		frameRate:10
	});
	this.anims.create(
		{key:'stop',
		frames: this.anims.generateFrameNames('character',{start:4, end:4, zeroPad:2, prefix:'RunRight',suffix:'.png'}),
		repeat:-1,
		frameRate:10
	});
	this.anims.create(
		{key:'die',
		frames: this.anims.generateFrameNames('character',{start:1, end:1, zeroPad:2, prefix:'RunRight',suffix:'.png'}),
		repeat:-1,
		frameRate:10
	});
	runner.play('running');
	var platforms = this.physics.add.staticGroup();
	platforms.create(290, 568, 'ground');
	this.physics.add.collider(runner,platforms);
	cursors = this.input.keyboard.createCursorKeys();
	this.physics.add.collider(runner,this.obstacles,()=>{
		gameOver=true;
	});
	this.physics.add.overlap(runner, this.coins, collectCoin, null, this);
	this.physics.world.removeCollider(this.platformCollider);
	this.timer = this.time.addEvent({
			delay: 3000,	
			callback: ()=>{
				if(!gameOver){
					addObstacle();
					addCoins();
				}
			},
			callbackScope: this,
			loop: true
	});
}

main.update = function(){
	if(gameOver){
		let gameOverText = this.add.text(game.config.width / 2-100, game.config.height / 2, 'GAME OVER', { fontSize: '32px', fill: '#fff' });
		gameOverText.setDepth(1);
		runner.setTint(0xff0000);
		gameManager.physics.pause();
		var btn = this.add.image(config.width/2,config.height-200,'start_btn');
		btn.setInteractive();
		btn.on('pointerup',
		function(){
			gameManager.scene.resume('Main');
			gameManager.scene.restart();
			});
		runner.anims.play('die', true);
	}
	if (jump && cursors.up.isDown){
		jumpSound.play();
		runner.setVelocityY(-600);
		runner.anims.play('stop', true);
		cursors = gameManager.input.keyboard.disable=false;
		jump = false;
		}
	if (runner.body.touching.down){
		runner.anims.play('running',true);
		jump=true;
	}
	cursors = gameManager.input.keyboard.createCursorKeys();
	this.scoreText.setText('score: '+this.score);
}

function addObstacle(){
	var xRandom = config.width+Math.floor(Math.random() * 100);
	var xRandom1 = Math.floor(Math.random() * 100);
	var yRandom = Math.floor(Math.random() * 200);
	var duri = gameManager.physics.add.image(xRandom,config.height-130,'duri').setScale(0.2);
	var lalet = gameManager.physics.add.image(xRandom1+xRandom*3/2,config.height-280-yRandom,'lalet').setScale(0.2);
	duri.setActive();
	duri.setVelocity(-400,0);
	duri.setGravity(0);
	lalet.setActive();
	lalet.setVelocity(-400,0);
	lalet.setGravity(0);
	gameManager.obstacles.add(duri);
	gameManager.obstacles.add(lalet);
	// gameManager.physics.add.collider(player,duri);
}

function addCoins(){
	var xRandom = Math.floor(Math.random() * 100);
	var yRandom = Math.floor(Math.random() * 200);
	var coin1 = gameManager.physics.add.image(xRandom+config.width*5/3,config.height-130-yRandom,'coin').setScale(0.1);
	var coin2 = gameManager.physics.add.image(xRandom+config.width*4/3,config.height-200-yRandom,'coin').setScale(0.1);
	coin2.setActive();
	coin2.setVelocity(-400,0);
	coin2.setGravity(0);
	coin1.setActive();
	coin1.setVelocity(-400,0);
	coin1.setGravity(0);
	gameManager.coins.add(coin1);
	gameManager.coins.add(coin2);
}

function collectCoin(player, coins)
{
	coins.disableBody(true, true);
	coinSound.play();
	this.score++;
 }

