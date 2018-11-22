'use strict';

var mapa = require('./Mapa');

//var cursors;

  var PlayScene = {

  create: function () {
   //this.game.physics.startSystem(Phaser.Physics.ARCADE);
   this.mapa = new mapa (this.game);
   this.mapa.generate();

   
   //********************* *//
   //Pruebas
   //this.j1 = new Player(this.game,50,50,'Casco1');
   
   //this.game.physics.arcade.enable(j1);
   //j1.body.collideWorldbounds = true;
   //this.j2 = new Player(this.game,200,200,'Casco2');
   //this.cursors = game.input.keyboard.createCursorKeys();

   //***************************** */
   
   
  }, 

  update: function(){
    //this.j1.compruebaInput();
    /*if (cursors.left.isDown)
    {
        this.j1.muevePlayer(-1,0);
    }
    else if (cursors.right.isDown)
    {
      this.j1.muevePlayer(1,0);
    }else if (cursors.up.isDown)
    {
      this.j1.muevePlayer(0,-1);
    }
    else if (cursors.down.isDown)
    {
      this.j1.muevePlayer(0,1);
    }*/
  }

};



module.exports = PlayScene;


//Pruebas clase player
/*function Player (game,x,y,sprite){
	Phaser.Sprite.call(this,game,x,y,sprite);
  this.game.world.addChild(this);
  //this.cursor = this.game.input.keyboard.createCursorKeys();;
}

Player.prototype=Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor=Player;

Player.prototype.muevePlayer = function(x,y){
this.x += x;
this.y += y;
}
Player.prototype.compruebaInput = function(){
    if (cursors.left.isDown)
    {
        this.muevePlayer(-1,0);
    }
    else if (cursors.right.isDown)
    {
      this.muevePlayer(1,0);
    }else if (cursors.up.isDown)
    {
      this.muevePlayer(0,-1);
    }
    else if (cursors.down.isDown)
    {
      this.muevePlayer(0,1);
    }
}*/
