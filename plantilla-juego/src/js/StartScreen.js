"use strict";

var startScreen = {
  create: function(game) {
    this.MainMenu = this.game.add.sprite(0, 0, "Menu");
    this.Music = this.game.add.audio("AudioMenu", 0.4, true);
    this.cursor = this.game.input.keyboard;
    //input
    this.key1 = Phaser.KeyCode.ENTER;

    this.MainMenu.width = 800;
    this.MainMenu.height = 800;

    this.Music.play();
  },

  update: function(game) {
    if (this.cursor.isDown(this.key1)) {
      this.Music.destroy();

      this.state.start("SPScene");
    }
  }
};
module.exports = startScreen;

