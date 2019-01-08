"use strict";

var startScreen = {
  create: function (game) {

    this.game = game;
    this.MainMenu = this.game.add.sprite(0, 0, "Menu");
    this.Music = this.game.add.audio("AudioMenu", 0.4, true);
    this.Music.play();

    //startButton
    this.B1 = this.game.add.button(0, 100, 'startButton', this.actionOnClick, this);
    this.B1.onInputOver.add(this.funcionUP, this);
    this.B1.onInputOut.add(this.funcionOut, this);

    //creditButton
    this.B2 = this.game.add.button(100, 650, 'creditButton', this.actionOnClick2, this);
    this.B2.width = 250;
    this.B2.height = 70;
    this.B2.onInputOver.add(this.b2funcionUP, this);
    this.B2.onInputOut.add(this.b2funcionOut, this);

    //creditButton
    this.B3 = this.game.add.button(100, 500, 'tutorialButton', this.actionOnClick3, this);
    this.B3.width = 250;
    this.B3.height = 70;
    this.B3.onInputOver.add(this.b3funcionUP, this);
    this.B3.onInputOut.add(this.b3funcionOut, this);

    
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
  },

  actionOnClick2: function (){

    this.Music.stop();
    this.state.start("CreditScene");
  },

  b2funcionUP: function (){
    this.B2.loadTexture('creditButton_animation');
  },

  b2funcionOut: function(){
    this.B2.loadTexture('creditButton');
  },


  actionOnClick3: function (){
    this.Music.stop();
    this.state.start("tutorialScene");
  },

  b3funcionUP: function (){
    this.B3.loadTexture('tutorial_animation');
  },

  b3funcionOut: function(){
    this.B3.loadTexture('tutorialButton');
  },


  


};
module.exports = startScreen;

