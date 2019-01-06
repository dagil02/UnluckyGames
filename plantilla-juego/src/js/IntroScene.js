"use strict";

var introScene = {
  create: function(game) {
    this.game = game;
    this.game.world.setBounds(0, 0, 800, 800);
    this.video = this.game.add.video("Intro");

    this.video.addToWorld(450, 400, 0.5, 0.5, 0.5, 0.5);
    this.video.play();
    this.cursor = this.game.input.keyboard;

    //input
    //this.key1 = Phaser.KeyCode.ENTER;

    this.introTime = 3200;
   
   
  },
  update: function(game) {
    if (this.game.time.now > this.introTime){
        this.state.start("Menu");
    }
  }
};
module.exports = introScene;

//onComplete
