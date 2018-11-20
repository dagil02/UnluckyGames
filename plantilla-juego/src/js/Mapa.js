'use strict';


function Mapa (game){


    //atributos del juego, carga de mapa y capas principales
    this.game = game;
    this.tile_Map;
    this.layer = this.game.add.group();

    
    //FUNCIONES 
    //genera aleatorio para recursos y añade a la lista.
    /*this.añadeRecursos = function (){
        var n_Recursos = 50; var n = 0;
        while (n < n_Recursos){
            
           var x = Math.floor(Math.random() * 50 );
           var y = Math.floor(Math.random() * 37 );

           this.recurso_lista.push (new this.recurso(this.game));
           this.recurso_lista[n].generate(( x * 16), ( y * 16), 'arbol');
           n++;       
        }//fin while   
    }*/

    //añade el mapa de tiles precargado en el main
    this.añadeTileMap = function (str){
        this.tile_Map = this.game.add.tilemap(str);
    }
    //añade la img de patrones
    this.añadeTileImg = function (str_1, str_2){
        this.tile_Map.addTilesetImage(str_1, str_2); 
    }
    //añade entidades al grupo
    this.añadeLayer = function (str_3){
        this.layer.add(this.tile_Map.createLayer(str_3));
    }
}

Mapa.prototype.generate = function() {
   this.añadeTileMap('mapa');
   this.añadeTileImg('tilesMap', 'tiles');

   //añadimos las entidades al grupo
   this.añadeLayer('background');  
   this.añadeLayer('obstaculo pradera');  
   this.añadeLayer('obstaculo nieve');  
   this.añadeLayer('obstaculo desierto'); 
   //this.añadeLayer('collider');

   
   
}


module.exports = Mapa;
