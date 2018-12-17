'use strict';

var mapa = require('./Mapa');
var j1 = require('./Player');

//var cursors;

  var PlayScene = {

  create: function () {

   this.world.setBounds(0, 0, 800, 596); //se ajusta los límites para no invadir el Hud inferior
   //GENERACION DE ELEM DE JUEGO
   //mapa y recursos
   this.mapa = new mapa (this.game);
   this.mapa.generate();
   //jugadores
   this.j1 = new j1(this.game, 200, 150, 'player_1');
  
  }, 

  update: function(){
    
    this.j1.muevePlayer();
    //se comprueba la colisión con las capas de obstáculos fijos del mapa
    this.game.physics.arcade.collide(this.j1, this.mapa.tile_Map.layerGroup.children);
    //se recorre el grupo de Objetos y comprueba los subGrupos la colision con los obj.
    for (var i = 0; i < this.mapa.GrupoObjetos.length; i++){
      this.game.physics.arcade.collide(this.j1, this.mapa.GrupoObjetos.children[i].children);
    }
    
  },

  render: function(){
    //DEBUG:
    //this.game.debug.text(`Debugging object: obstaculo:`, (2 * 16), (38 * 16), 'yellow', 'Segoe UI');
    //this.game.debug.bodyInfo(this.obstaculo,(2 * 16), (40 * 16), 'yellow', 'Segoe UI');

  }

};



module.exports = PlayScene;
