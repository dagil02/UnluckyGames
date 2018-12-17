'use strict';


//PHATHER CLASS: OBJECT
function Objeto (game, x, y, sprite){ 
	Phaser.Sprite.call(this, game, x, y, sprite);//hereda de sprite
	this.game.world.addChild(this);

	//ATTRIBUTE
	this.cantidad; 

	//METHODS
	this.RandomItem = function (n){
		var r = Math.floor(Math.random() * n );
		return r;
	}
}
//enlaza ambas propiedades prototype
Objeto.prototype = Object.create(Phaser.Sprite.prototype);
//corrige la propiedad constructor
Objeto.prototype.constructor = Objeto;



module.exports = Objeto;