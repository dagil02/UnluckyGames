'use strict';

var mapa = require('./Mapa');
var j1 = require('./Player');
var myCamera = require('./Camera.js');

//var cursors;

  var PlayScene = {

  create: function () {

   this.game.world.setBounds(0, 0, 800, 596);
   this.camera.setBoundsToWorld();
   
   //GENERACION DE ELEM DE JUEGO
   //mapa y recursos
   this.mapa = new mapa (this.game);
   this.mapa.generate();
   //jugadores
   this.j1 = new j1(this.game, 200, 150, 'player_1');

   var pos = {'x': 0, 'y':0};
   var camera = new myCamera(pos);
   this.camera = camera;
   //this.camera.zoomTo(0);
   
;
   /*for (var i = 0; i < this.mapa.tile_Map.layerGroup.length   ; i++){
    this.mapa.tile_Map.layerGroup.children[i].scale.setTo(2, 2);
    this.mapa.tile_Map.layerGroup.children[i].resizeWorld();
   }

   for (var p = 0; p < this.mapa.GrupoObjetos.length; p++){
    for (var j = 0; j <  this.mapa.GrupoObjetos.children[p].length; j++){
      this.mapa.GrupoObjetos.children[p].children[j].scale.setTo(2, 2);
    }
  }*/
   
   this.camera.follow(this.j1);

  var i = 0;

   
  }, 

  update: function(){
    
    this.j1.compruebaInput();
    this.j1.Accion();
    //this.game.camera.follow(this.j1);
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



