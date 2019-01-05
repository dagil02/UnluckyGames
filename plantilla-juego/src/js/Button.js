//Crea el botón basandose en los botones de phaser

function PauseButton (_game, x, y,key, callBack, callBackContxt,parent){
    Phaser.Button.call(this, _game, x, y,key, callBack, callBackContxt, 1, 0, 2);    
    parent.addChild(this);
    this.anchor.setTo(1,0);
}
PauseButton.prototype = Object.create(Phaser.Button.prototype);
PauseButton.constructor = PauseButton;