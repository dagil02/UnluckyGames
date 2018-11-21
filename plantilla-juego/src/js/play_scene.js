'use strict';

var mapa = require('./Mapa');



  var PlayScene = {

  create: function () {

   this.mapa = new mapa (this.game);
   this.mapa.generate();
   //Pruebas
   /*this.j1 = new Player(this.game,50,50,'Casco1');
   this.j2 = new Player(this.game,200,200,'Casco2');*/
  }, 

  update: function(){
  //this.j1.muevePlayer(1,1);
    
  }

};



module.exports = PlayScene;


//Pruebas clase player

/*function Player (game,x,y,sprite){
	Phaser.Sprite.call(this,game,x,y,sprite);
	this.game.world.addChild(this);
}

Player.prototype=Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor=Player;

Player.prototype.muevePlayer = function(x,y){
this.x += x;
this.y += y;
}*/
