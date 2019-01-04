"use strict";

var mapa = require("./Mapa");
var player = require("./Player");

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
    //jugadores
    this.playerGroup = this.game.add.group();
    //desierto; niveve; praderaTop; praderaButton
    this.playerPos = [
      { x: 128, y: 96 },
      { x: 32, y: 560 },
      { x: 688, y: 64 },
      { x: 640, y: 512 }
    ];
    for (var i = 0; i < this.playerPos.length; i++) {
      this.playerGroup.add(
        new player(
          this.game,
          this.playerPos[i].x,
          this.playerPos[i].y,
          "player_1"
        )
      );
    }
    //mapa y recursos
    this.mapa = new mapa(this.game);
    this.mapa.generate(this.playerGroup);

    //la variable recoge los grupos de físicas de obj. parametro en this.checkInput()
    this.objGr = this.mapa.GrupoObjetos;

    this.game.world.bringToTop(this.playerGroup);

    //Variables que controlan la pausa
    this.pause = false;
    var Pause;

    //Musica
    var MusicaFondo;
    this.MusicaFondo = this.game.add.audio('AudioJuego',0.05,true);
       
    this.MusicaFondo.play();

    
  },

  update: function() {
    if (!this.pause) {
      this.checkInput();
      this.playerGroup.children[0].bulletUpdate();
    } else {
      //La tecla enter manda al menu inicial
      if (this.inputAux.isDown(13)) {
        this.pause = false;
        this.game.state.start("Menu");
        //la barra espaciadora reanuda el juego
      } else if (this.inputAux.isDown(32)) {
        this.pause = false;
        this.endPause();
      }
    }
  },

  render: function() {
    var y = 38;

    this.game.debug.text(
      `Debugging object: PLAYER TEST`,
      32,
      610,
      "yellow",
      "Segoe UI"
    );
    //this.game.debug.cameraInfo(this.game.camera, 32, 640, "yellow");
    this.game.debug.text(
      "resources: " + this.playerGroup.children[0].resources + " walks: " + 
      this.playerGroup.children[0].walkCont,
      32,
      640,
      "yellow",
      "Segoe UI"
    );
    //this.game.debug.text("", 32, 660, "yellow", "Segoe UI");
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
    this.game.camera.follow(this.playerGroup.children[0]);
    //se invoca a los método de los gameObjects
    this.mapa.resizeLayer(scale);
    //this.playerGroup.children[0].resizePlayer(scale);
    this.playerGroup.forEach(element => {
      element.resizePlayer(scale);
    });
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
      this.playerGroup.children[0].checkInput(this.mapa, this.objGr);
    }
    //la tecla esc activa el menu de pausa
    if (this.inputAux.isDown(27)) {
      this.pause = true;
      this.startPause();
    }
  },

  startPause: function() {
    this.Pause = this.game.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      "Pausa"
    );
    this.Pause.alpha = 0.7;
    this.Pause.anchor.setTo(0.5, 0.5);
  },
  endPause: function() {
    //Hace transparente el menu de pausa
    this.Pause.alpha = 0;
  }
};

module.exports = PlayScene;