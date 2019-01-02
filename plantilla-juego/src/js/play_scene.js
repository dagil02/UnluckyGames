"use strict";

var mapa = require("./Mapa");
var j1 = require("./Player");
var myCamera = require("./Camera.js");

//var cursors;

var PlayScene = {
  create: function() {
    //World
    this.game.world.setBounds(0, 0, 800, 592);
    this.game.camera.setBoundsToWorld();
    this.hud = this.game.add.sprite(800, 208, "hud2");
    this.hud.x = 0;
    this.hud.y = 592;
    //atributos gestión escalar
    this.previousScale = 1; //por defecto
    this.previousWorld_W = this.game.world.bounds.width;
    this.previousWorld_H = this.game.world.bounds.height;
    this.boolScale = false;

    //Input
    this.inputAux = this.game.input.keyboard;
    this.key1 = Phaser.KeyCode.ONE;
    this.key2 = Phaser.KeyCode.TWO;
    this.key3 = Phaser.KeyCode.THREE;

    //GENERACION DE ELEM DE JUEGO
    //mapa y recursos
    this.mapa = new mapa(this.game);
    this.mapa.generate();

    //la variable recoge los grupos de físicas de tilemap método checkInput() ¡no permite pasar el mapa como tal!
    this.layerGr =  this.mapa.tile_Map.layerGroup.children;
    this.objGr = this.mapa.GrupoObjetos;

    this.layerGr[1].debug = true;
    //this.recogeInd = this.layerGr[1].getTiles(0, 0, 800, 592, true);

    //jugadores
    var pos1 = { x: 144, y: 80 };
    this.j1 = new j1(this.game, pos1.x, pos1.y, "player_1");
  },

  update: function() {
    //this.game.physics.arcade.collide(this.j1, this.mapa.tile_Map.layerGroup.children);
    this.checkInput();
  },

  render: function() {
    var y = 38;

    /*this.game.debug.text(
      `Debugging object: POSICIONES TEST`,
      32,
      610,
      "yellow",
      "Segoe UI"
    );*/
    //this.game.debug.cameraInfo(this.game.camera, 32, 640, "yellow");
    this.game.debug.bodyInfo(this.j1, 400, 640, "yellow");
    //this.game.debug.text( this.boolScale, 32, 750, "yellow", "Segoe UI");
  
  },

  zoomTo: function(scale) {
    //escalar
    var auxScale = this.previousScale; //auxiliar para recoger el escalar previo
    this.boolScale = this.previousScale === 2;
    this.previousScale = scale;
    //mundo
    //se opera para garantizar una correcta redimension de los límites del área de juego
    var auxW = this.previousWorld_W / auxScale;
    var auxH = this.previousWorld_H / auxScale;
    this.previousWorld_W = auxW * scale;
    this.previousWorld_H = auxH * scale;
    //cámara
    var auxCamera_H = this.hud.height + this.previousWorld_H; //eje: worldH 1184 + 208 = 1392; así permite a la cam sobrepasar los límites del mundo

    //gestion de la camara
    this.game.camera.follow(this.j1);
    //se invoca a los método de los gameObjects
    this.mapa.resizeLayer(scale);
    this.j1.resizePlayer(scale);
    //gestión del mundo para permitir rendrizado del hud fuera de los límites. así el jugador puede llegar al linde sin ser obstaculizado por el z-depth
    this.game.world.setBounds(0, 0, this.previousWorld_W, this.previousWorld_H);

    this.game.camera.bounds.setTo(0, 0, this.previousWorld_W, auxCamera_H);
    if (!this.boolScale) {
      this.HudScale();
    }
  },

  HudScale: function() {
    if (this.game.camera.x > 0 || this.game.camera.y > 0) {
      if (this.game.camera.x > 0) {
        this.hud.x = this.game.camera.x;
      }
      if (this.game.camera.y > 0) {
        this.hud.y = 592 + this.game.camera.y;
      }
    } else {
      this.hud.x = 0;
      this.hud.y = 592;
    }

    this.hud.fixedToCamera = true;
    this.game.world.bringToTop(this.hud);
  },

  checkInput: function() {
    if (this.inputAux.isDown(this.key1)) {
      this.zoomTo(2);
    } else if (this.inputAux.isDown(this.key2)) {
      this.zoomTo(1);
    } else {
      this.j1.checkInput(this.mapa, this.objGr);
    }
  }
};

module.exports = PlayScene;
