
var GameLayer = cc.Layer.extend({
    spritePelota: null,
    velocidadX:null,
    velocidadY:null,
    spriteCoche: null,
    spriteBarra:null,
    spriteBarraIA:null,
    dificultad:null,
    scorePlayer:null,
    labelScorePlayer:null,
    scoreIA:null,
    labelScoreIA:null,
    scoreToWin:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;
        // Hasta aqui lo comun

        // 1 = Fácil
        // 2 = Normal
        // 3 = Difícil
        // 4 = Imposible
        this.dificultad = 2;

        // Velocidades
        this.velocidadX = 4;
        this.velocidadY = 4;

        // Puntuaciones
        this.scorePlayer = 0;
        this.scoreIA = 0;
        this.scoreToWin = 3;

        // Fondo
        var spriteFondo = cc.Sprite.create(res.fondo_png);
        spriteFondo.setPosition(cc.p(size.width/2, size.height/2));
        spriteFondo.setScale(size.width / spriteFondo.width);
        this.addChild(spriteFondo);

        // Pelota
        this.spritePelota = cc.Sprite.create(res.bola_png);
        this.spritePelota.setPosition( cc.p( size.width/2 , size.height/2 )  );
        this.addChild(this.spritePelota);

        // Barra jugador
        this.spriteBarra = cc.Sprite.create(res.barra_2_png);
        this.spriteBarra.setPosition(cc.p(size.width*0.1, size.height*0.5 ));
        this.spriteBarra.rotation = 90;
        this.addChild(this.spriteBarra);

        // Barra IA
        this.spriteBarraIA = cc.Sprite.create(res.barra_2_png);
        this.spriteBarraIA.setPosition(cc.p(size.width*0.9, size.height*0.5 ));
        this.spriteBarraIA.rotation = 90;
        this.addChild(this.spriteBarraIA);

        // Puntuación jugador
        this.labelScorePlayer = new cc.LabelTTF(this.scorePlayer.toString());
        this.labelScorePlayer.setFontSize(80);
        this.labelScorePlayer.setPosition(cc.p(size.width*0.4, size.height*0.9));
        this.addChild(this.labelScorePlayer);

        // Puntuación IA
        this.labelScoreIA = new cc.LabelTTF(this.scoreIA.toString());
        this.labelScoreIA.setFontSize(80);
        this.labelScoreIA.setPosition(cc.p(size.width*0.6, size.height*0.9));
        this.addChild(this.labelScoreIA);

        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.procesarMouseDown
        }, this)

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.teclaPulsada
        }, this);


        this.scheduleUpdate();

        return true;

        //Keycodes:
        //37 = left arrow
        //38 = up arrow
        //39 = right arrow
        //40 = down arrow
    }, teclaPulsada: function( keyCode, event ){
         var instancia = event.getCurrentTarget();
         console.log(keyCode);
         if ( keyCode == 38 && instancia.spriteBarra.y < 400){ 
            instancia.spriteBarra.y =  instancia.spriteBarra.y + 14;
         }
         if ( keyCode == 40 && instancia.spriteBarra.y > 50){
            instancia.spriteBarra.y =  instancia.spriteBarra.y - 14;
         }

    }, procesarMouseDown: function ( event ){
        // NUNCA THIS ->  "event.getCurrentTarget()"
        console.log("x: "+event.getLocationX());
        console.log("y: "+event.getLocationY());

        var actionMoverPelota = cc.MoveTo.create( 3,  cc.p( event.getLocationX() , event.getLocationY() )  );
        event.getCurrentTarget().spritePelota.runAction(actionMoverPelota);

    }, update: function(){


        // Comprobar GAME OVER
        if (this.scorePlayer == this.scoreToWin || this.scoreIA == this.scoreToWin){
            cc.audioEngine.stopMusic();
            cc.director.pause();
            this.addChild(new GameOverLayer);
        }

        // Mover pelota
        this.spritePelota.x = this.spritePelota.x + this.velocidadX;
        this.spritePelota.y = this.spritePelota.y + this.velocidadY;

        // Mover barra enemiga
        if (this.spriteBarraIA.y < 400 && this.spritePelota.y > this.spriteBarraIA.y){
            this.spriteBarraIA.y = this.spriteBarraIA.y + this.dificultad;
        } else if (this.spriteBarraIA.y > 50 && this.spritePelota.y < this.spriteBarraIA.y){
            this.spriteBarraIA.y = this.spriteBarraIA.y - this.dificultad;
        }

        if (this.spritePelota.x < 0){
            // Aumentamos la puntuación
            this.scoreIA += 1;
            this.labelScoreIA.setString(this.scoreIA.toString());
            // Reseteamos la posición de la pelota y la lanzamos en la dirección contraria
            this.spritePelota.x = cc.winSize.width/2;
            this.spritePelota.y = cc.winSize.height/2;
            this.velocidadX = this.velocidadX*-1;

        }

        if (this.spritePelota.x > cc.winSize.width){
            // Aumentamos la puntuación
            this.scorePlayer += 1;
            this.labelScorePlayer.setString(this.scorePlayer.toString());
            // Reseteamos la posición de la pelota y la lanzamos en la dirección contraria
            this.spritePelota.x = cc.winSize.width/2;
            this.spritePelota.y = cc.winSize.height/2;
            this.velocidadX = this.velocidadX*-1;
        }
        if (this.spritePelota.y < 0){
            this.spritePelota.y = 0;
            this.velocidadY = this.velocidadY*-1;
        }
        if (this.spritePelota.y > cc.winSize.height){
            this.spritePelota.y = cc.winSize.height;
            this.velocidadY = this.velocidadY*-1;
        }

       // Colisiones
        var areaPelota = this.spritePelota.getBoundingBox();
        var areaBarra = this.spriteBarra.getBoundingBox();
        var areaBarraIA = this.spriteBarraIA.getBoundingBox();

        if(cc.rectIntersectsRect(areaPelota, areaBarra) || 
            cc.rectIntersectsRect(areaPelota, areaBarraIA)){
                console.log("Collision");
                cc.audioEngine.playEffect(res.grunt_wav);
                this.velocidadX = this.velocidadX*-1;
        }
    }

});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        // Hasta aqui lo común
        cc.director.resume();
        cc.audioEngine.playMusic(res.sonidobucle_wav, true);
        var layer = new GameLayer();
        this.addChild(layer);
    }
});

