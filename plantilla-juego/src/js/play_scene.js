'use strict';

var controls = {};

  var PlayScene = {
  

  create: function () {
    var mapa = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'mapa');
    mapa.anchor.setTo(0.5, 0.5);
    mapa.scale.setTo(1.78, 1.60);

    var Player1 = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'player1');
    Player1.anchor.setTo(0.5, 0.5); //situa el ancla en el centro del sprite y comienza a pintar desde esa posición 
    Player1.scale.setTo(0.5,0.5);

    controls = {
      right: this.input.keyboard.addKey(Phaser.Keyboard.D),
      left: this.input.keyboard.addKey(Phaser.Keyboard.A),
      up: this.input.keyboard.addKey(Phaser.Keyboard.W),
      down: this.input.keyboard.addKey(Phaser.Keyboard.S),
    };

  }, //is importan the character ',' inside JavaScript XD 


  update: function(){}
};

module.exports = PlayScene;
