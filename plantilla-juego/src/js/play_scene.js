'use strict';

var controls = {};

  var PlayScene = {

  create: function () {

    //EJEMPLO JESUS SPRITE MAP
    /*var mapa = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'mapa');
    mapa.anchor.setTo(0.5, 0.5);
    mapa.scale.setTo(1.78, 1.60);*/

    /*var Player1 = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'player1');
    Player1.anchor.setTo(0.5, 0.5); //situa el ancla en el centro del sprite y comienza a pintar desde esa posición 
    Player1.scale.setTo(0.5,0.5);

    //EJEMPLO MARIO TILEMAP
    /*this.game.stage.backgroundColor = '#787878';
    var map = this.game.add.tilemap('mario');
    map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
    var layer = map.createLayer('World1');
    layer.resizeWorld();*/

    this.game.stage.backgroundColor = '#787878';
    var map = this.game.add.tilemap('mundo1');
    map.addTilesetImage('mapaTiles', 'tiles');
    var layer = map.createLayer('Capa de Patrones 1');
    layer.resizeWorld();

    

    /*controls = {
      right: this.input.keyboard.addKey(Phaser.Keyboard.D),
      left: this.input.keyboard.addKey(Phaser.Keyboard.A),
      up: this.input.keyboard.addKey(Phaser.Keyboard.W),
      down: this.input.keyboard.addKey(Phaser.Keyboard.S),
    };*/

  }, //is importan the character ',' inside JavaScript XD 


  update: function(){}
};

module.exports = PlayScene;
