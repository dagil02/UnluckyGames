'use strict';

var mapa = require('./Mapa');
var j1 = require('./Player');

//var cursors;

  var PlayScene = {

  create: function () {

   this.game.physics.startSystem(Phaser.Physics.ARCADE); //inicia el motor de físicas

   this.mapa = new mapa (this.game);
   this.mapa.generate();
   this.layerDebug = this.mapa.layer_obstaculo_1;
   
   this.j1 = new j1(this.game,50,50,'Casco1');

   this.game.camera.scale.x += 1;
   this.game.camera.scale.y += 1;

   
   
  }, 

  update: function(){

    this.j1.compruebaInput();


    
  },

  render: function(){
    //DEBUG:
    /*this.game.debug.text(`Debugging Body: Layers:`, (2 * 16), (38 * 16), 'yellow', 'Segoe UI');
    this.layerDebug.debug = true;
    this.game.debug.bodyInfo(this.layerDebug, (2 * 16), (40 * 16), 'yellow');*/

  }

};



module.exports = PlayScene;



