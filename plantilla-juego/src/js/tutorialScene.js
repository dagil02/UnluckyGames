"use strict";

var Tutorial = {

    create: function (game) {

        this.game = game;
        this.MainMenu = this.game.add.sprite(0, 0, "tutorialtextura");
    
        this.cursor = this.game.input.keyboard;
        this.key1 = Phaser.KeyCode.ENTER;
    
      
        this.text1 = this.game.add.text(500, 250, 'PULSA ENTER', 28);
        this.tex2 = this.game.add.text (450, 280, 'PARA VOLVER AL MENU', 28);
        
      },
    
      update: function () {
    
        if (this.cursor.isDown(this.key1)) {
            this.state.start('Menu');
          }
        }
        

};

module.exports = Tutorial;

 