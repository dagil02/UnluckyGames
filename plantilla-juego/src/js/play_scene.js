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
    this.hud = this.game.add.sprite(800, 208, 'hud2');
    this.hud.x = 0; this.hud.y = 592;
    //atributos gestión escalar
    this.previousScale = 1; //por defecto
    this.previousWorld_W = this.game.world.bounds.width;
    this.previousWorld_H = this.game.world.bounds.height;
    this.boolScale = false;


    //Input
    this.inputAux = this.game.input.keyboard;
    this.key1 = Phaser.KeyCode.ONE;
    this.key2 = Phaser.KeyCode.TWO;

  
    //GENERACION DE ELEM DE JUEGO
    //mapa y recursos
    this.mapa = new mapa(this.game);
    this.mapa.generate();
    this.mapa.resizeLayer(1); //ajusta el mapa al mundo. //necesario para usar el hud

    //this.recogeI = this.mapa.RecogeIndex( this.mapa.tile_Map.layerGroup.children[1]);
    this.mapa.tile_Map.layerGroup.children[1].debug = true;
    

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

    this.checkCollision();
   
   
  },

  render: function() {
    var y = 38;
  
    this.game.debug.text( `Debugging object: HUD TEST`, 32, 610, "yellow", "Segoe UI");
    this.game.debug.cameraInfo(this.game.camera, 32, 640, "yellow");
    this.game.debug.spriteInfo(this.hud, 400, 640, "yellow");
    this.game.debug.text( this.boolScale, 32, 750, "yellow", "Segoe UI");
   
  },

  zoomTo: function (scale) {
    
    //escalar
    var auxScale = this.previousScale; //auxiliar para recoger el escalar previo
    this.boolScale = this.previousScale === 2;
    this.previousScale = scale;      
    //mundo
    //se opera para garantizar una correcta redimension de los límites del área de juego
    var auxW = this.previousWorld_W / auxScale;
    var auxH  =  this.previousWorld_H  / auxScale;
    this.previousWorld_W = auxW * scale;
    this.previousWorld_H  =  auxH * scale;
    //cámara
    var auxCamera_H = this.hud.height +  this.previousWorld_H; //eje: worldH 1184 + 208 = 1392; así permite a la cam sobrepasar los límites del mundo
    
    //gestion de la camara
    this.game.camera.follow(this.j1);
    //se invoca a los método de los gameObjects
    this.mapa.resizeLayer(scale);
    this.j1.resizePlayer(scale);
    //gestión del mundo para permitir rendrizado del hud fuera de los límites. así el jugador puede llegar al linde sin ser obstaculizado por el z-depth
    this.game.world.setBounds(0, 0, this.previousWorld_W ,  this.previousWorld_H);
   
    this.game.camera.bounds.setTo(0, 0,this.previousWorld_W, auxCamera_H);
    if (!this.boolScale){this.HudScale();}

  },

  HudScale: function () {

    if (this.game.camera.x > 0 || this.game.camera.y > 0 ){
      if (this.game.camera.x > 0) {
        this.hud.x = this.game.camera.x;
      }
      if (this.game.camera.y > 0) {
        this.hud.y = (592 + this.game.camera.y);
      }
    }
    else {
      this.hud.x = 0;
      this.hud.y = 592;
    }


    this.hud.fixedToCamera = true;
    this.game.world.bringToTop(this.hud);
  },

  checkCollision: function () {

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
  }
};

module.exports = PlayScene;

//childObj.resize(cameraBounds.width,  cameraBounds.height ); // If a tilemap layer, resize it..
