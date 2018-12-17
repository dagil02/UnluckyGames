'use strict';


var objeto = require('./Objeto');

function Recurso (game, x, y, sprite){
    
	objeto.call(this, game, x, y, sprite); //hereda de objeto 


}
Recurso.prototype = Object.create (objeto.prototype);
Recurso.prototype.constructor = Recurso;

Recurso.prototype.generate = function (){

	//las propiedades y la función las hereda de la clase Objeto
	this.cantidad = this.RandomItem(10); 
	this.bloquea = true; //debe bloquear el paso
	
}


module.exports = Recurso;
