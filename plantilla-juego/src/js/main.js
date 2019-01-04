'use strict';

//node_modules/.bin/gulp run

var PlayScene = require('./play_scene.js');
var Menu = require('./StartScreen.js');
var Creditos = require('./Creditos.js');

var BootScene = {
  preload: function () {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.setMinMax(800, 592, 1600, 1184);
    
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {


    //motor de físicas
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

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
    this.game.load.image('player_1', 'assets/sprites/character.png'); //posPlayer.png
    this.game.load.image('posIni', 'assets/sprites/posPlayer.png');

    



    this.game.load.image('Menu', 'assets/sprites/menu.png');
    this.game.load.image('Pausa', 'assets/sprites/pausa.png');
    this.game.load.image('FondoCreditos', 'assets/sprites/creditos.png');
  
  
  //Musica y sonidos
    this.game.load.audio('AudioMenu', ['assets/musica/Menu_mp3.mp3', 'assets/musica/Menu_ogg.ogg']);
    this.game.load.audio('AudioJuego', ['assets/musica/Juego_mp3.mp3', 'assets/musica/Juego_ogg.ogg']);
    this.game.load.audio('Disparo', ['assets/musica/Disparo_mp3.mp3', 'assets/musica/Disparo_ogg.ogg']);
    this.game.load.audio('Recursos', ['assets/musica/recursos_mp3.mp3', 'assets/musica/recursos_ogg.ogg']);
    this.game.load.audio('Pasos', ['assets/musica/Pasos_mp3.mp3', 'assets/musica/Pasos_ogg.ogg']);
  
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
  game.state.add('CreditScene', Creditos);

  game.state.start('boot');
};
