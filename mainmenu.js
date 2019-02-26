let menu = new Phaser.Scene('Menu');

menu.preload = function(){
	this.load.setBaseURL('assets/');
	this.load.image('start_btn','start_btn.png');
}

menu.create = function(){
	var btn = this.add.image(config.width/2,config.height,'start_btn');
	// btn.scaleX = 0;
	// btn.scaleY = 0;
	btn.setInteractive();
	btn.on('pointerup',
		function(){
			this.scene.scene.start('Main');
		});

	this.tweens.add({
		targets:[btn],
		y: config.height/2,
		duration : 500,
		ease : 'Bounce.easeOut'	
	});
}