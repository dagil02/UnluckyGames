"use strict";

//node_modules/.bin/gulp run

var PlayScene = require("./play_scene.js");
var Menu = require("./StartScreen.js");
var Creditos = require("./Creditos.js");
var SelectPlayers = require("./SelectPlayers.js");
var IntroScene = require("./IntroScene.js");
var Victoria = require("./victoria.js");

var BootScene = {
  preload: function() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.setMinMax(800, 592, 1600, 1184);
  },

  create: function() {
    this.game.state.start("preloader");
  }
};

var PreloaderScene = {
  preload: function() {
    //motor de físicas
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // ** ASSETS DEL JUEGO **
    //json y png del mapa
    this.game.load.tilemap(
      "mapa",
      "assets/mapas/mapa-0.json",
      null,
      Phaser.Tilemap.TILED_JSON
    );
    this.game.load.image("tiles", "assets/mapas/mapaTiles.png");

    //hud
    this.game.load.image("hud2", "assets/canvas/hud.png");

    //fuentes
    this.game.load.bitmapFont('fuente1', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
    this.game.load.bitmapFont('fuente2', 'assets/fonts/font2.png', 'assets/fonts/font2.fnt');
   
    //OBJETOS
    //recursos
    this.game.load.image("arbol", "assets/sprites/arbol.png");
    this.game.load.image("muro", "assets/sprites/muro.png");
    //armas
    this.game.load.image("subFusil", "assets/sprites/gun.png");
    this.game.load.image("pistola", "assets/sprites/pistola.png");
    this.game.load.image("francoTirador", "assets/sprites/francoTirador.png");
    //balas
    this.game.load.image("bala", "assets/sprites/bala.png");

    //JUGADOR
    this.game.load.image("player_1", "assets/sprites/character.png"); //posPlayer.png
    this.game.load.image("posIni", "assets/sprites/posPlayer.png");

    //videos
    this.game.load.video("introScene", "assets/videos/Battlefort_intro.webm");

    //textura de menus
    this.game.load.image("Menu", "assets/sprites/menus/textura_mainMenu.png");
    this.game.load.image("Pausa", "assets/sprites/menus/pausa.png");
    this.game.load.image("FondoCreditos", "assets/sprites/menus/creditos.png");
    this.game.load.image(
      "FondoSelectPlayers",
      "assets/sprites/menus/fondoSelectPlayers.png"
    );
    this.game.load.image("FondoVictoria", "assets/sprites/menus/victoria.png");
    //BOTONES
    //startButton
    this.game.load.image(
      "startButton",
      "assets/sprites/button/startButton.png", 800,50
    ); //startButton
    this.game.load.image(
      "startButton_animation",
      "assets/sprites/button/startButton_check.png"
    ); 
    //creditButton
    this.game.load.image(
      "creditButton",
      "assets/sprites/button/creditButton.png", 800,50
    ); //startButton
    this.game.load.image(
      "creditButton_animation",
      "assets/sprites/button/creditButton_animation.png"
    ); 

    //selectPlayerButton
    //2 players
    this.game.load.image("Button1", "assets/sprites/button/button_2Players.png");
    this.game.load.image("Button1A", "assets/sprites/button/button_2Players_animation.png");
    //3 players
    this.game.load.image("Button2", "assets/sprites/button/button_3Players.png");
    this.game.load.image("Button2A", "assets/sprites/button/button_3Players_animation.png");
    //4 players
    this.game.load.image("Button3", "assets/sprites/button/button_4Players.png");
    this.game.load.image("Button3A", "assets/sprites/button/button_4Players_animation.png");

    //Musica y sonidos
    this.game.load.audio("AudioMenu", [
      "assets/musica/Menu_mp3.mp3",
      "assets/musica/Menu_ogg.ogg"
    ]);
    this.game.load.audio("AudioJuego", [
      "assets/musica/Juego_mp3.mp3",
      "assets/musica/Juego_ogg.ogg"
    ]);
    this.game.load.audio("Disparo", [
      "assets/musica/Disparo_mp3.mp3",
      "assets/musica/Disparo_ogg.ogg"
    ]);
    this.game.load.audio("Recursos", [
      "assets/musica/recursos_mp3.mp3",
      "assets/musica/recursos_ogg.ogg"
    ]);
    this.game.load.audio("Pasos", [
      "assets/musica/Pasos_mp3.mp3",
      "assets/musica/Pasos_ogg.ogg"
    ]);
    this.game.load.audio("Muro", [
      "assets/musica/Muro_mp3.mp3",
      "assets/musica/Muro_ogg.ogg"
    ]);
  },

  create: function() {
    this.game.state.start("introScene"); //introScene
  }
};

window.onload = function() {
  var game = new Phaser.Game(50 * 16, 50 * 16, Phaser.AUTO, "game");
  game.state.add("boot", BootScene);
  game.state.add("preloader", PreloaderScene);
  game.state.add("introScene", IntroScene);
  game.state.add("Menu", Menu);
  game.state.add("SPScene", SelectPlayers);
  game.state.add("play", PlayScene);
  game.state.add("CreditScene", Creditos);
  game.state.add("VictoryScene", Victoria);

  game.state.start("boot");
};
