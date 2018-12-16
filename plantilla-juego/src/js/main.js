'use strict';

//node_modules/.bin/gulp run

var PlayScene = require('./play_scene.js');


var BootScene = {
  preload: function () {
    // load here assets  required for the loading screen
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
	

    //OBJETOS
    //recursos
    this.game.load.image ('arbol', 'assets/sprites/arbol.png' ); 
    this.game.load.image ('muro', 'assets/sprites/muro.png' );
    //armas
    this.game.load.image ('subFusil', 'assets/sprites/gun.png' );
    this.game.load.image ('pistola', 'assets/sprites/pistola.png' );
    this.game.load.image ('francoTirador', 'assets/sprites/francoTirador.png' );
    //balas
    this.game.load.image ('bala', 'assets/sprites/bala.png' );
  

    //JUGADOR
    this.game.load.image('player_1', 'assets/sprites/character.png');

  },

  create: function () {
    this.game.state.start('play');
    
  }
};


window.onload = function () {
  //var game = new Phaser.Game((50 * 16), (37 * 16), Phaser.AUTO, 'game');
  var game = new Phaser.Game((50 * 16), (50 * 16), Phaser.AUTO, 'game');

  //game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('preloader');
};
