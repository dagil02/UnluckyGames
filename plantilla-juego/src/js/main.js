'use strict';

//node_modules/.bin/gulp run

var PlayScene = require('./play_scene.js');
var Menu = require('./StartScreen.js');

var BootScene = {
  preload: function () {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //this.scale.setMinMax(800, 592, 1600, 1184);
    this.scale.setMinMax(800, 592, 1600, 1184);
    //this.scale.pageAlignHorizontally = true;
    //this.scale.pageAlignVertically = true;
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {


    // ** ASSETS DEL JUEGO **
    //json y png del mapa
    this.game.load.tilemap('mapa', 'assets/mapas/mapa-0.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', 'assets/mapas/mapaTiles.png');

    //hud
    this.game.load.image('hud2', 'assets/canvas/hud.png');


    //OBJETOS
    //recursos
    this.game.load.image('arbol', 'assets/sprites/arbol.png');
    this.game.load.image('muro', 'assets/sprites/muro.png');
    //armas
    this.game.load.image('subFusil', 'assets/sprites/gun.png');
    this.game.load.image('pistola', 'assets/sprites/pistola.png');
    this.game.load.image('francoTirador', 'assets/sprites/francoTirador.png');
    //balas
    this.game.load.image('bala', 'assets/sprites/bala.png');


    //JUGADOR
    this.game.load.image('player_1', 'assets/sprites/character.png');

    this.game.physics.startSystem(Phaser.Physics.ARCADE);



    this.game.load.image('Menu', 'assets/sprites/menu.png');
  },

  create: function () {
    this.game.state.start('Menu');

  }
};


window.onload = function () {
  var game = new Phaser.Game((50 * 16), (50 * 16), Phaser.AUTO, 'game');
  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);
  game.state.add('Menu', Menu);
  game.state.start('boot');
};
