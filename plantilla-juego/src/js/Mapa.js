'use strict';

//node_modules/.bin/gulp run


function Mapa (game){


    //ATRIBUTOS
    this.game = game;

    this.tile_Map; //recoge el mapa de tiles

    this.layer_background; this.layer_obstaculo_0; this.layer_obstaculo_1; this.layer_obstaculo_2;
    
    
    


    //FUNCIONES 
    //genera aleatorio para recursos y añade al grupo
    this.añadeObjetos = function (enlace, idSprite, nObj){

        var n_Recursos = nObj; var n = 0;
        var objeto = enlace; //recoge el valor por parámetro
 

        while (n < n_Recursos){
            
           var x = Math.floor(Math.random() * 50 );
           var y = Math.floor(Math.random() * 37 );

           //variable auxiliar. 
           var aux = this.game.add.sprite(x, y, 'Casco1');
           
           var col = false;
           col = this.TileOcupado(aux, this.tile_Map.layerGroup.children);
          

           console.log ("BOOL COL: " + col); //MENSAJE EN CONSOLA

           if (!col){ 
               var hijo = -1;
               //this.recurso.physicsBodyType = Phaser.Physics.ARCADE;
               //this.recurso.enableBody = true;
               if (idSprite === 'arbol'){ hijo = 0; }
               else if (idSprite === 'subFusil'){ hijo = 1; }

               if (hijo !== -1){
                   if (hijo === 0){
                    if (this.GrupoObjetos.children[1].x !==  x * 16 && this.GrupoObjetos.children[1].y !==  y * 16 ){
                        this.GrupoObjetos.children[hijo].add(new objeto(this.game, x * 16, y * 16, idSprite));
                        n++;
                    }  
                   }
                   else if (hijo === 1){
                        if (this.GrupoObjetos.children[0].x !==  x * 16 && this.GrupoObjetos.children[1].y !==  y * 16 ){
                            this.GrupoObjetos.children[hijo].add(new objeto(this.game, x * 16, y * 16, idSprite));
                            n++;
                        }  
                    }
                }
                
            }

             
    
           aux.destroy(); //destruye la variable para que no se quede renderizada
                  
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
    //añade entidades al grupo
    this.añadeLayer = function (){

       
        
        //º las variables recojen las capas
        this.layer_background = this.tile_Map.createLayer('background');
        this.layer_obstaculo_0 = this.tile_Map.createLayer('obstaculo desierto'); 
        this.layer_obstaculo_1 = this.tile_Map.createLayer('obstaculo pradera'); 
        this.layer_obstaculo_2 = this.tile_Map.createLayer('obstaculo nieve');

        
 
        this.game.physics.arcade.enable(this.layer_obstaculo_0);
        this.game.physics.arcade.enable(this.layer_obstaculo_1);
        this.game.physics.arcade.enable(this.layer_obstaculo_2);

        /*this.layer_obstaculo_0.enableBody = true;
        this.layer_obstaculo_1.enableBody = true;
        this.layer_obstaculo_2.enableBody = true;

        this.layer_obstaculo_0.body.collideWorldBounds = true;
        this.layer_obstaculo_1.body.collideWorldBounds = true;
        this.layer_obstaculo_2.body.collideWorldBounds = true;*/


        this.tile_Map.setCollision(1, true, this.layer_obstaculo_0);
        this.tile_Map.setCollision(2, true, this.layer_obstaculo_1);
        this.tile_Map.setCollision(3, true, this.layer_obstaculo_2);



        //this.tile_Map.setCollisionByExclusion([10, 11, 12], true); 
        /*this.tile_Map.setCollisionByExclusion([11], true,  this.layer_obstaculo_1); 
        this.tile_Map.setCollisionByExclusion([12], true,  this.layer_obstaculo_2); */


        //º se añaden al grupo
        this.tile_Map.layerGroup.add(this.layer_background);
        this.tile_Map.layerGroup.add(this.layer_obstaculo_0);
        this.tile_Map.layerGroup.add(this.layer_obstaculo_1);
        this.tile_Map.layerGroup.add(this.layer_obstaculo_2);

    }

    //COMO NO CONSIGO LO DE LAS FUCKING COLISIONES. ACCEDO AL ARRAY DE LA CAPA Y COMPRUEBO SI ESTÁ OCUPADO
    this.TileOcupado = function(variable, nombreCapa) {
       var colision = false; var i = 1;
       while (!colision && i < nombreCapa.length){
           colision = nombreCapa[i].layer.data[variable.y][variable.x].index !== -1;
           i++;
       }

       
       return colision;

    }



}


Mapa.prototype.generate = function() {
    
   this.añadeTileMap('mapa');
   this.añadeTileImg('tilesMap', 'tiles');
   

   //Grupos
   this.tile_Map.layerGroup = this.game.add.group(); //capas con los patrones del mapa
   this.GrupoObjetos = this.game.add.group(); //alberga grupos
   this.GrupoRecursos = this.game.add.group(); //arbol = identificador en Preload clase Game
   this.GrupoArmas = this.game.add.group(); //subfusil = identificador
   //GrupoObjetos = [GrupoRecurso, GrupoArmas,...]
   this.GrupoObjetos.add(this.GrupoRecursos);
   this.GrupoObjetos.add(this.GrupoArmas);


   //se crean las capas, se definen como colisiones y se añaden al grupo
   this.añadeLayer();

   console.log ('POSICION TILE '+this.layer_obstaculo_0.layer.data[2][3].x);


   //se require de la clase objeto para genrar sus hijos. 
   var recursosClass = require('./recurso'); //recursos 
   var armasClass = require('./Armas'); //armas
   var recursoIdSprite = 'arbol'; var armasIdSprite = 'subFusil';
   this.añadeObjetos(recursosClass, recursoIdSprite, 50);
   this.añadeObjetos(armasClass, armasIdSprite, 12);
}


module.exports = Mapa;
