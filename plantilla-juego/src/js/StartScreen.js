"use strict";

var startScreen = {
  create: function (game) {

    this.game = game;
    //this.game.world.setBounds(0, 0, 800, 800);
    this.MainMenu = this.game.add.sprite(0, 0, "Menu");
    this.Music = this.game.add.audio("AudioMenu", 0.4, true);
   

    //this.MainMenu.width = 800;
    //this.MainMenu.height = 800;

    //input
    //this.cursor = this.game.input.keyboard;
    //this.key1 = Phaser.KeyCode.ENTER;
    
    this.B1 = this.game.add.button(0, 100, 'startButton', this.actionOnClick, this);
 
  
    //this.B2 = game.add.button(300, 400, 'startButton_animation', this.functButton2, this, 1, 0, 2);
    //this.B1.onInputOver.add(this.funcionUP, this);
    //this.B1.onInputOut.add(this.funcionOut, this);


    this.Music.play();
  },

  update: function () {
    
  },

  actionOnClick: function (){

    this.state.start("SPScene");
  },

  /*funcionUP: function (){
    this.B1.texture.loadTexture('startButton_animation');
  },

  funcionOut: function(){
    this.B1.texture.loadTexture('startButton');
  }*/


};
module.exports = startScreen;

