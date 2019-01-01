'use strict';

//node_modules/.bin/gulp run


function Mapa(game) {


    //ATRIBUTOS
    this.game = game;

    this.tile_Map; //recoge el mapa de tiles

    //capas
    this.layer_background; this.layer_obstaculo_0; this.layer_obstaculo_1; this.layer_obstaculo_2;

    //gestion escalar: 1 por defecto. se usa en el método Prototype.LayerResize
    this.auxScale = 1;

    //FUNCIONES 
    //------METODOS PARA LA CREACIÓN DE OBJETO------
    //Método que comprueba que no se va a posicionar el objeto encima de otro. se invoca dentro de AñadeObjeto
    this.AñadeObjetoAux = function (x, y) {
        var esta = false; var i = 0;
        var position = { 'x': x, 'y': y };
        //se recorre el grupo 
        while (!esta && i < this.GrupoObjetos.children.length) {
            var j = 0;
            while (!esta && j < this.GrupoObjetos.children[i].length) {
                esta = position === this.GrupoObjetos.children[i].children[j].position;
                j++;
            }
            i++;
        }
        return esta;
    }

    //Metodo para devolve un índice de armas
    this.Selec_Weapon = function () {
        var idSprite_list = ['subFusil', 'pistola', 'francoTirador'];
        var i = Math.floor(Math.random() * idSprite_list.length);
        var enlace = require('./Armas');

        var weapon = { 'idSprite': idSprite_list[i], 'enlace': enlace };
        return weapon;
    }

    //método para devolver el tipo de Objeto a crear en base al parámetro tipo string
    this.SeleccionObjeto = function (string) {
        if (string === "recurso") {
            var recurso = { 'idSprite': 'arbol', 'enlace': require('./recurso') }; return recurso;
        }
        else if (string === "arma") { return this.Selec_Weapon(); }
    }

    //genera aleatorio para recursos y añade al grupo
    this.añadeObjetos = function (string, nObj, group_obj_hijo) {

        //constante auxiliar
        var tile_patron_W = this.tile_Map.width; var tile_patron_H = this.tile_Map.height;

        //variables de control 
        var n_Recursos = nObj; var n = 0;

        while (n < n_Recursos) {
            //se crea el patrón de objeto en el bucle, para generar armas distintas dado el caso
            var objeto = this.SeleccionObjeto(string);

            var x = Math.floor(Math.random() * tile_patron_W);
            var y = Math.floor(Math.random() * tile_patron_H);

            //Var aux para Comprobar si el tile está ocupado
            var tile_W = this.tile_Map.tileWidth; var tile_H = this.tile_Map.tileHeight //recoge w/h del tile
            x = x * tile_W; y = y * tile_H; //recogen worldPosition
            var aux = this.game.add.sprite(x, y, 'arbol');

            var col = false;//variable de control de colision
            col = this.TileOcupado(aux, this.tile_Map.layerGroup.children);

            if (!col) {
                if (!this.AñadeObjetoAux(x, y)) {
                    var obj_aux = new objeto.enlace(this.game, x, y, objeto.idSprite);
                    obj_aux.generate();
                    group_obj_hijo.add(obj_aux);

                    n++;
                }
            }
            aux.destroy(); //destruye la variable para que no se quede renderizada                
        }//fin while   

    }

    //------METODOS PARA LA CREACIÓN DE TILEMAP------
    //añade el mapa de tiles precargado en el main
    this.añadeTileMap = function (str) {
        this.tile_Map = this.game.add.tilemap(str);
    }
    //añade la img de patrones
    this.añadeTileImg = function (str_1, str_2) {
        this.tile_Map.addTilesetImage(str_1, str_2);
    }

    //Método que devuelve un array de index correspondiente a cada capa. 
    this.RecogeIndex = function (nombreCapa) {
        //constante aux.
        var tile_patron_W = this.tile_Map.width; var tile_patron_H = this.tile_Map.height;
        var listaIndex = []; //lista auxiliar 
        //función que devuelve un patrón de orden ascendente
        function comparar(a, b) {
            return a - b;
        }
        //se recorre las fils/Cols del mapa patrón de tiles
        for (var y = 0; y < tile_patron_H; y++) {
            for (var x = 0; x < tile_patron_W; x++) {
                //se recorre el array aux para determinar que no se haya incluido ya ese index    
                var j = 0; var esta = false;
                while (!esta && j < listaIndex.length) {
                    esta = nombreCapa.layer.data[y][x].index == listaIndex[j];
                    j++;
                }
                //lo añade al array en caso de no ser -1 y no estar previamente. 
                if (!esta) {
                    if (nombreCapa.layer.data[y][x].index !== -1) {
                        listaIndex.push(nombreCapa.layer.data[y][x].index);
                    }
                }
                else { esta = false; } //vuelve a false para siguiente vuelta
            }
        }
        //se devuelve el array ordenado.
        return listaIndex.sort(comparar);//ordena el array de manera ascendente
    }

    //añade entidades al grupo
    this.añadeLayer = function () {

        //1º LAS VAR RECOGEN LAS CAPAS
        this.layer_background = this.tile_Map.createLayer('background');
        this.layer_obstaculo_0 = this.tile_Map.createLayer('obstaculo desierto');
        this.layer_obstaculo_1 = this.tile_Map.createLayer('obstaculo pradera');
        this.layer_obstaculo_2 = this.tile_Map.createLayer('obstaculo nieve');

        //2º SE AÑADEN AL GRUPO
        this.tile_Map.layerGroup.add(this.layer_background);
        this.tile_Map.layerGroup.add(this.layer_obstaculo_0);
        this.tile_Map.layerGroup.add(this.layer_obstaculo_1);
        this.tile_Map.layerGroup.add(this.layer_obstaculo_2);
        //se recorre el grupo saltando la capa Background
        for (var i = 1; i < this.tile_Map.layerGroup.length; i++) {
            //3º SE HABILITA LA FÍSICA PARA CADA CAPA
            this.game.physics.enable(this.tile_Map.layerGroup.children[i], Phaser.Physics.ARCADE);
            //4º SE DEFINE LAS COLISIONES PARA LOS TILES
            //hay que pasar el rango de index. puede: index === number || index === array
            //Doc.Oficial: Source code: tilemap/Tilemap.js (Line 816). En caso de array su función lo recorre
            this.tile_Map.setCollision((this.RecogeIndex(this.tile_Map.layerGroup.children[i])), true, this.tile_Map.layerGroup.children[i], true);
            //5º SE HABILITAN LOS ATRIBUTOS DEL PHYSIC.BODY
            this.tile_Map.layerGroup.children[i].body.collideWorldBounds = true;
            this.tile_Map.layerGroup.children[i].body.immovable = true;
            this.tile_Map.layerGroup.children[i].body.bounce.setTo(1, 1);
        }
    }

    //Comprueba si el tile está ocupado en base al valor del atributo index:
    this.TileOcupado = function (variable, grupoCapas) {
        var colision = false; var i = 1;
        //auxiliares recogen pos: se divide por el w,h del tile
        var x = variable.x / this.tile_Map.tileWidth; var y = variable.y / this.tile_Map.tileHeight;
        //aqui recorre el array de hijos de layerGroup saltándose la capa BackGround
        while (!colision && i < grupoCapas.length) {
            colision = grupoCapas[i].layer.data[y][x].index !== -1;
            i++;
        }
        return colision;
    }


}//cierre constructora


//****** */PROTOTYPE METHODS *******
Mapa.prototype.generate = function () {

    this.añadeTileMap('mapa');
    this.añadeTileImg('tilesMap', 'tiles');

    //ATRIBUTOS
    this.tile_Map.layerGroup = this.game.add.group(); //capas con los patrones del mapa
    this.tile_Map.layerGroup.name = "layersGroup"; //esto permite identificar el objeto en depuración
    this.GrupoObjetos = this.game.add.group(); //alberga grupos
    this.GrupoObjetos.name = "objectsGroup";
    //las armas y recursos se añaden a un grupo de físicas. habilita directamente su body
    this.GrupoRecursos = this.game.add.group();
    this.GrupoRecursos.name = "resourcesGroup";
    this.GrupoArmas = this.game.add.group();
    this.GrupoArmas.name = "weaponsGroup";
    //GrupoObjetos = [GrupoRecurso, GrupoArmas,...]
    this.GrupoObjetos.add(this.GrupoRecursos);
    this.GrupoObjetos.add(this.GrupoArmas);


    //se crean las capas, se definen como colisiones y se añaden al grupo
    this.añadeLayer();

    //se añaden los Objetos al mapa. el 1º param. es un identificador del método SeleccionObjeto
    this.añadeObjetos("recurso", 40, this.GrupoRecursos);
    this.añadeObjetos("arma", 15, this.GrupoArmas);
}


 //redimensiona los objetos según parámetro. 
 Mapa.prototype.resizeLayer = function (scale) {

    var aux = this.auxScale; //aux recoge el último escalar 
    this.auxScale = scale; //el atributo de la clase recoge el nuevo escalar


    //T.Map.layer escala en base al parámetro y se redimensiona al mundo
    for (var i = 0; i < this.tile_Map.layerGroup.length; i++) {
        var tiles = this.tile_Map.layerGroup.children[i].setScale(scale, scale);
        this.tile_Map.layerGroup.children[i].resizeWorld();
    }

    //objetos: recuperan dim. según anterior escalar y redimensionan según el nuevo escalar
    //recursos
    this.GrupoObjetos.children[0].children.forEach(element => {
        element.resizeObject(scale);
    });
    //armas
    this.GrupoObjetos.children[1].children.forEach(element => {
       element.resizeObject(scale);
    });

}

module.exports = Mapa;


