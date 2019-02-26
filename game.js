	var config = {
		type: Phaser.AUTO,
		width: 800,
		height: 600,
		backgroundColor: '#71c5cf',
		physics: {
			default: 'arcade',
			arcade: {
				gravity: { y: 0 }
			}
		},
		scene: [menu,main]
	};

	var game = new Phaser.Game(config);

	