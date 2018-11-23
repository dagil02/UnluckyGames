'use strict';

//node_modules/.bin/gulp run

var PlayScene = require('./play_scene.js');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    //this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    //this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    //this.loadingBar.anchor.setTo(0, 0.5);
    //this.load.setPreloadSprite(this.loadingBar);

    // ** ASSETS DEL JUEGO **
    //json y png del mapa
    this.game.load.tilemap('mapa', 'assets/mapas/mapa-0.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', 'assets/mapas/mapaTiles.png');
	

    //objetos
    this.game.load.image ('arbol', 'assets/sprites/arbol.png' ); //recursos
    this.game.load.image ('subFusil', 'assets/sprites/gun.png' ); //armas

    //jugador
    this.game.load.image('Casco1', 'assets/sprites/Casco1.png');
    this.game.load.image('Casco2', 'assets/sprites/Casco2.png');

  },

  create: function () {
    this.game.state.start('play');
    
  }
};


window.onload = function () {
  var game = new Phaser.Game((50 * 16), (37 * 16), Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};
