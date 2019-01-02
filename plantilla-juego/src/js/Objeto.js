'use strict';


//PHATHER CLASS: OBJECT
function Objeto(game, x, y, sprite) {
	Phaser.Sprite.call(this, game, x, y, sprite);//hereda de sprite
	
	this.game.world.addChild(this);

	//ATTRIBUTE
	this.cantidad;
	this.auxScale = 1; //1 por defecto
	this.name = sprite; //el nombre dependerá del tipo de objeto. más para depurar 

	//METHODS
	this.RandomItem = function (n) {
		var r = Math.floor(Math.random() * n);
		return r;
	}

	//funcion que define la nueva posicion cuando se ejecuta zoom y se reescala el sprite
	//interesa que nazca la superClass, para activarlo con cada shot Bullet. 
	this.resizeObject = function (scale) {
		var aux = this.auxScale; //aux recoge el último escalar
		this.auxScale = scale; //el atributo de la clase recoge el nuevo escalar
		this.scale.setTo(scale);
		this.x = this.x / aux;
		this.x = this.x * scale;
		this.y = this.y / aux;
		this.y = this.y * scale;
	}
}
//enlaza ambas propiedades prototype
Objeto.prototype = Object.create(Phaser.Sprite.prototype);
//corrige la propiedad constructor
Objeto.prototype.constructor = Objeto;



module.exports = Objeto;