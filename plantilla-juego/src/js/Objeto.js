'use strict';

function Objeto (game){

    this.game = game;

    this.pointPosition = {x: 0, y: 0};
    this.sprite;
    this.clase;


    this.designClase = function (clas){
        this.clase = clas;
    }

    this.asignPosition = function (x, y){
        this.pointPosition.x = x;
        this.pointPosition.y = y;
    }

    this.asignSprite = function (nombre){
        this.sprite = this.game.add.sprite (this.pointPosition.x, this.pointPosition.y, nombre);
    }
    
}

Objeto.prototype.generate = function() {
    
    this.pointPosition (25 , 10);
    this.asignSprite('arbol');
 }

//RECURSOS
/*Recurso.prototype = new Objeto(game);

function Recurso (game){

    this.cantidad; //esta propiedad recoge valor de una función generadora de un int aleatorio
    this.bloquea = true; //es un obstaculo destruible
    this.designClase ('recurso');

}

Recurso.prototype.generate = function (){

    this.asignPosition(25, 10); //debe ser un generador aleatorio que compruebe que no hay obstaculos
    this.asignSprite('arbol');
}*/


module.exports = Objeto;