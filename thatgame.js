

/*------------------------------------*
 * The core game component
 * -----------------------------------*/ 
  ThatGame = function(config){
     this.defaults = {
      boardSize:5
     }
     this.settings = this.defaults;
     this.players = [];
     this.setup = function(){
        this.blocks = new Array(this.settings.boardSize);
        for(x=0;x<this.settings.boardSize;x++){
          this.blocks[x] = new Array(this.settings.boardSize);
          for(y=0;y<this.settings.boardSize;y++){
            this.blocks[x][y] = new Array(this.settings.boardSize);
            for(z=0;z<this.settings.boardSize;z++){
              this.blocks[x][y][z] = {state:'empty'};
            }
          }
        }
        this.initBoard();
     }
     
     this.initBoard = function(){
        for(x=0;x<this.settings.boardSize;x++){
          for(y=0;y<this.settings.boardSize;y++){
            this.blocks[x][y][0].state = 'neutral';
          }
        }
     }
     
     this.addPlayer = function(name,color,x,y){
      var newPlayer = new ThatGame.player(this,name,color,x,y);
      this.players.push(newPlayer);
      return newPlayer.place();
    }
  };

/*------------------------------------*
 * the player class
 * -----------------------------------*/ 
  ThatGame.player = function(config){
    this.game = config.game;
    this.name = config.name;
    this.color = config.color;
    this.x = config.x;
    this.y = config.y;
    this.square = null;
    this.place = function(){
      //find square by coords
      this.square = this.game.el.find('div.boardrow:eq('+this.y+')').find('div.boardplace:eq('+this.x+')').children('.square:last');
      this.square.removeClass('red blue green');
      this.square.removeClass('neutral').addClass(this.color).addClass('current');
      this.game.nextTurn();
      return this;
    };
    this.canMoveTo = function(x,y){
      if(!this.game.blocks[x][y]) return false;
      var target;
      for (z=this.game.blocks[x][y].length-1;z>=0;z--){
        if(this.game.blocks[x][y][z].status!='empty'){
          target = this.game.blocks[x][y][z];
          break;
        }
      }
      if(target.status='neutral' || target.color = this.color){
        return true;
      }else{
        for(i=0;i<this.game.players.length;i++){
        }
        if(!target.player && target.z<this.z){
          return true;
        }else{
          return false;
        }
      }
    };
    this.moveTo = function(x,y) {
      this.x = x;
      this.y = y;
      return this.place();
    };
    this.moveUp = function() {
      if(this.canMoveTo(this.x,this.y-1)){
        this.square.removeClass('current');
        this.y--;
        return this.place();
      } 
    };
    this.moveDown = function() {
      if(this.canMoveTo(this.x,this.y+1)){
        this.square.removeClass('current');
        this.y++;
        return this.place();
      }
    };
    this.moveLeft = function() {
      if(this.canMoveTo(this.x-1,this.y)){
        this.square.removeClass('current');
        this.x--;
        return this.place();
      }
    };
    this.moveRight = function() {
      if(this.canMoveTo(this.x+1,this.y)){
        this.square.removeClass('current');
        this.x++;
        return this.place();
      }
    };
    this.jump = function() {
      if(this.square.data('level')<this.game.boardSize){
        this.square.removeClass('current');
        this.game.addSquare(this.x,this.y);
        return this.place();
      }
    };
  };

  var thisGame = new ThatGame('test');