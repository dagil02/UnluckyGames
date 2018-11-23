'use strict';


//Consturctora funciones Auxiliares
function RandomItem (){
	var r = Math.floor(Math.random() * 10 );
	return r;
}

//CLASE PADRE: Objeto
function Objeto (game, x, y, sprite){ 
	Phaser.Sprite.call(this, game, x, y, sprite);//hereda de sprite
	this.game.world.addChild(this);

	//atributos 
	this.bloquea = false; 
	this.cantidad; 
}
//enlaza ambas propiedades prototype
Objeto.prototype = Object.create(Phaser.Sprite.prototype);
//corrige la propiedad constructor
Objeto.prototype.constructor = Objeto;



module.exports = Objeto;