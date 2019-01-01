"use strict";

var mapa = require("./Mapa");
var j1 = require("./Player");
var myCamera = require("./Camera.js");

//var cursors;

var PlayScene = {
  create: function() {
    this.game.world.setBounds(0, 0, 800, 592);
    this.game.camera.setBoundsToWorld();
    this.inputAux = this.game.input.keyboard;
    this.key1 = Phaser.KeyCode.ONE;
    this.key2 = Phaser.KeyCode.TWO;

  
    //GENERACION DE ELEM DE JUEGO
    //mapa y recursos
    this.mapa = new mapa(this.game);
    this.mapa.generate();
    //jugadores
    this.j1 = new j1(this.game, 200, 150, "player_1");
    

  },

  update: function() {

    if (this.inputAux.isDown(this.key1)){
      this.zoomTo(2);
    }
    else if (this.inputAux.isDown(this.key2)){
      this.zoomTo(1);
    }
    
    this.j1.compruebaInput();
    this.j1.Accion();

    //se comprueba la colisión con las capas de obstáculos fijos del mapa
    this.game.physics.arcade.collide(
      this.j1,
      this.mapa.tile_Map.layerGroup.children
    );
    //se recorre el grupo de Objetos y comprueba los subGrupos la colision con los obj.
    for (var i = 0; i < this.mapa.GrupoObjetos.length; i++) {
      this.game.physics.arcade.collide(
        this.j1,
        this.mapa.GrupoObjetos.children[i].children
      );
    }
  },

  render: function() {
    var y = 38;
    //DEBUG:
    this.game.debug.text(
      `Debugging object: World Children`,
      2 * 16,
      y * 16,
      "yellow",
      "Segoe UI"
    );
    for (var i = 0; i < this.world.children.length; i++) {
      var auxY = y + (i + 1);
      var auxX = this.world.children[i].name.length;
      this.game.debug.text(
        this.world.children[i].name,
        2 * 16,
        auxY * 16,
        "yellow",
        "Segoe UI"
      );
      this.game.debug.text(
        this.world.children[i].type,
        auxX * 16,
        auxY * 16,
        "yellow",
        "Segoe UI"
      );
    }
  },

  zoomTo: function(scale) {
    this.game.camera.follow(this.j1);
    this.mapa.resizeLayer(scale);
    this.j1.resizePlayer(scale);
  }
};

module.exports = PlayScene;

//childObj.resize(cameraBounds.width,  cameraBounds.height ); // If a tilemap layer, resize it..
