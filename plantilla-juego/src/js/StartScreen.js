"use strict";

var startScreen = {
  create: function (game) {

    this.game = game;
    this.MainMenu = this.game.add.sprite(0, 0, "Menu");
    this.Music = this.game.add.audio("AudioMenu", 0.4, true);
    this.Music.play();

    
    this.B1 = this.game.add.button(0, 100, 'startButton', this.actionOnClick, this);
    this.B1.onInputOver.add(this.funcionUP, this);
    this.B1.onInputOut.add(this.funcionOut, this);

    
  },

  update: function () {
    
  },

  actionOnClick: function (){

    this.Music.stop();
    this.state.start("SPScene");
  },

  funcionUP: function (){
    this.B1.loadTexture('startButton_animation');
  },

  funcionOut: function(){
    this.B1.loadTexture('startButton');
  }


};
module.exports = startScreen;

