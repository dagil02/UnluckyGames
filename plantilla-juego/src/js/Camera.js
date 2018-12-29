//var game = require('./play_scene.js');

class Camera extends Phaser.Group {
	constructor({x = 0, y = 0}) {
		super(game);

		var {world, physics, camera} = game;
		var {centerX, centerY, bounds} = world;

		this.scale.setTo(1, 1);
		this.position.setTo(x, y);
		
		this.bounds = Phaser.Rectangle.clone(bounds);

		this.stalker = game.add.sprite(0, 0, null);
		this.stalker.position.setTo(centerX, centerY);
		physics.arcade.enable(this.stalker);
		camera.follow(this.stalker);

		this.nullTarget = game.add.sprite(centerX, centerY, null);
		this.target     = this.nullTarget;

		this.secondsToTarget = 0.5;
		this.safeDistance    = 3;

		return this;
    }		
	removeTarget(){
		this.target = this.nullTarget;
	}
	follow(target){
		this.target = target.world;
	}
	get speed(){
		var distance = this.stalker.position.distance(this.target);
		if (distance < this.safeDistance) return 0;
		else return distance/this.secondsToTarget;
	}
	update(){
		super.update();
		if (this.target) {
			var {stalker, target, speed} = this;
			var position = stalker.position;
			var arcade   = game.physics.arcade;
			if (!speed) position.copyFrom(target);
			else arcade.moveToObject(stalker, target, speed);
		}
	}
	zoomTo(scale, duration){
		var bounds       = this.bounds;
		var cameraBounds = game.camera.bounds;
		var postionScale = (1 - scale) / 2;
		var x      = bounds.width  * postionScale,
			y      = bounds.height * postionScale,
			width  = bounds.width  * scale,
			height = bounds.height * scale;
		if (!duration) {
			    cameraBounds.x      = x;
			    cameraBounds.y      = y;
			    cameraBounds.width  = width;
			    cameraBounds.height = height;
			    this.scale.setTo(scale);
		} else {
			game.add.tween(cameraBounds)
			.to({x, y, width, height}, duration).start();
			return game.add.tween(this.scale)
			.to({x: scale, y: scale}, duration).start();
		}
	}
};

module.exports = Camera;