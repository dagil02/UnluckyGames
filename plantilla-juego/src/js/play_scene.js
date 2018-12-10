'use strict';

var mapa = require('./Mapa');
var j1 = require('./Player');

//var cursors;

  var PlayScene = {

  create: function () {

   this.game.physics.startSystem(Phaser.Physics.ARCADE); //inicia el motor de físicas

   this.mapa = new mapa (this.game);
   this.mapa.generate();
   

   this.j1 = new j1(this.game,50,50,'Casco1');

   //this.game.camera.scale.x += 1;
   //this.game.camera.scale.y += 1;
   
  }, 

  update: function(){

    this.j1.compruebaInput();


    
  },

  render: function(){
    //DEBUG:
    //this.game.debug.text(`Debugging object: loQueSea:`, (2 * 16), (38 * 16), 'yellow', 'Segoe UI');
 

  }

};



module.exports = PlayScene;


/*this.game.debug.funDeb = function(x, y, color){
    this.start(x, y, color);
		this.line('bloquea: ' + this.c);
		this.line('Cantidad: ' + this.b);
		this.stop();
   }*/