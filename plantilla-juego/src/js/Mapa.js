'use strict';


function Mapa (game){


    //atributos del juego, carga de mapa y capas principales
    this.game = game;
    this.tile_Map;
    this.layer= [];

    

    //atributos objeto: recursos, armas, powerUps (se cargan en capas del mapa)
    function recurso (){} //constructora de recursos
    this.recurso_lista = [];//lista que guardará los recursos.

    
    //FUNCIONES 
    //genera aleatorio para recursos y añade a la lista. PROVISIONAL!!!
    this.añadeRecursos = function (){
        var n_Recursos = 50; var n = 0;
        while (n < n_Recursos){
            
           var x = Math.floor(Math.random() * 50 );
           var y = Math.floor(Math.random() * 37 );

           this.recurso_lista.push (new recurso());
           this.recurso_lista[n].x = x;
           this.recurso_lista[n].y = y;
           this.recurso_lista[n].sprite = this.game.add.sprite (( x * 16), ( y * 16), 'arbol');
           n++;

            //recorre la lista de collider comprobando las posiciones
            /*var esta = false; var i = 0;
            while (!esta && i < (this.layer[4].objects.length - 1)){
                esta = this.layer[4].objects[i].x === x && this.layer[4].objects[i].y === y;
                i++;
            }*/

            //si la pisicon no coincide instancia un nuevo recurso a la lista y asigna valores
            /*if (!esta){
                this.recurso_lista.push (new this.recurso());
                this.recurso_lista[n].x = x;
                this.recurso_lista[n].y = y;
                this.recurso_lista[n].sprite = this.game.add.sprite (( x * 16), ( y * 16), 'arbol');
                n++;
            }*/
            
        }//fin while   
    }

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

    this.añadeLayerObj = function (str_4){
        this.layer.push(str_4);
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

   //Genera la lista de recursos y la añade como nueva capa del mapa
   this.añadeRecursos();
   this.añadeLayerObj (this.recurso_lista);
   
}




module.exports = Mapa;
