'use strict';


function Mapa (game){


    this.game = game;
    this.tile_Map;
    this.layer= [];
    
    //añade el mapa de tiles precargado en el main
    this.añadeTileMap = function (str){
        this.tile_Map = this.game.add.tilemap(str);
    }
    //añade la img de patrones
    this.añadeTileImg = function (str_1, str_2){
        this.tile_Map.addTilesetImage(str_1, str_2); 
    }
    //añade capas a la lista
    this.añadeLayer = function (str_3){
        this.layer.push(this.tile_Map.createLayer(str_3));
    }

}

Mapa.prototype.generate = function() {
   this.añadeTileMap('mapa');
   this.añadeTileImg('tilesMap', 'tiles');
   this.añadeLayer('background');  
   this.añadeLayer('obstaculo pradera');  
   this.añadeLayer('obstaculo nieve');  
   this.añadeLayer('obstaculo desierto'); 
   this.añadeLayer('collider');

   
}




module.exports = Mapa;
