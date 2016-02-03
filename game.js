// JavaScript Document

// config
var game

$(document).ready(function(){
  game = new gameboard($('#gameboard:first'),5);
  $('#startbutton').hide();
  game.buildBoard();
  $(this).keyup(function(event) {
    //console.log(event.keyCode);
    switch(event.keyCode){
      case 65:
        $('#moveleft').click();
        event.preventDefault();
        break;
      case 87:
        $('#moveup').click();
        event.preventDefault();
        break;
      case 68:
        $('#moveright').click();
        event.preventDefault();
        break;
      case 83:
        $('#movedown').click();
        event.preventDefault();
        break;
      case 85:
        $('#jump').click();
        event.preventDefault();
        break;
    }
  });
  
});



function gameboard(el,boardSize){
  this.gameid = guidGenerator();
  this.isRunning = false;
  this.boardSize = boardSize;
  this.players = [];
  this.moves = [];
  this.el = el;
  this.currentPlayer = 0;
  this.colors = ['red','blue','green','orange','purple'];
  this.start = function(){
    //this.buildBoard();
    this.players = this.players.shuffle();
    this.setStartPositions();
    $('#controls').show();
    $('#startpanel').hide();
    $('#rules').slideUp();
    this.currentPlayer = 0;
    $.each(this.players,function(index,item){item.place();});
    this.isRunning = true;
  }
  this.setStartPositions = function(){
    var positions;
    switch (this.players.length){
      case 2:
        positions = [{x:0,y:0},{x:this.boardSize-1,y:this.boardSize-1}];
        break;
      case 3:
        positions = [{x:0,y:0},{x:(this.boardSize-1)/2,y:(this.boardSize-1)/2},{x:this.boardSize-1,y:this.boardSize-1}];
        break;
      case 4:
        positions = [{x:0,y:0},{x:this.boardSize-1,y:0},{x:this.boardSize-1,y:this.boardSize-1},{x:0,y:this.boardSize-1}];
        break;
      case 5:
        positions = [{x:0,y:0},{x:this.boardSize-1,y:0},{x:this.boardSize-1,y:this.boardSize-1},{x:0,y:this.boardSize-1},{x:(this.boardSize-1)/2,y:(this.boardSize-1)/2}];
        break;
    }
    for(p=0;p<this.players.length;p++){
      this.players[p].x = positions[p].x;
      this.players[p].y = positions[p].y;
    }
  }
  this.nextTurn = function(){
    this.updateScores();
    this.currentPlayer ++;
    if(this.currentPlayer == this.players.length){
      this.currentPlayer = 0;
    }
    $('#controls').css('border-color',this.players[this.currentPlayer].color);
    if($('.square').length==this.boardSize*this.boardSize*this.boardSize){
      alert('Game Over');
    }
    this.updateUI();
  }
  this.updateScores = function(){
    $.each(this.players,function(index,item){
      item.score = $('.square.'+item.color).length;
    });
  }
  this.buildBoard = function(){
    var boardRow='<div class="boardrow">';
    for(i=0;i<this.boardSize;i++){
      boardRow += '<div class="boardplace"><div class="square neutral">1</div></div>';
    }
    boardRow += '</div>';
    var $table = this.el;
    $table.html('');
    for(i=0;i<this.boardSize;i++){
      $table.append(boardRow);
    }
    this.el.find('.square').data('level',1);
  }
  this.addSquare = function(x,y){
    var target = this.el.find('div.boardrow:eq('+y+')').find('div.boardplace:eq('+x+')');
    var height = target.children('.square').length + 1;
    target.append($('<div class="square neutral">'+height+'</div>').data('level',height));
  }
  this.addPlayer = function(name){
      var newPlayer = new player(this,name,this.colors[this.players.length],null,null);
      $('#roster').append('<li>'+name+'</li>');
      this.players.push(newPlayer);
      if(this.players.length>1) $('#startbutton').show();
      if(this.players.length>4) $('#addplayer').hide();
      return newPlayer;
  }
  this.updateUI = function(){
    var scores = '';
    $.each(this.players,function(index,item){
      scores += '<div class="';
      if(index==item.game.currentPlayer){
        scores += 'current ';
      }
      scores += item.color + '">' + item.name + ': ' + item.score + '</div>';
    });
    $('#scores').html(scores);
  }
  this.restart = function(){
    this.buildBoard();
    this.start();
    //this.updateScores();
    //this.updateUI();
  }
}




function player(game,name,color,x,y) {
    this.game = game;
    this.name = name;
    this.color = color;
    this.x = x;
    this.y = y;
    this.square = null;
    this.place = function(){
      //find square by coords
      this.square = this.game.el.find('div.boardrow:eq('+this.y+')').find('div.boardplace:eq('+this.x+')').children('.square:last');
      this.square.removeClass('red blue green purple orange');
      this.square.removeClass('neutral').addClass(this.color).addClass('current');
      this.game.nextTurn();
      return this;
    };
    this.canMoveTo = function(x,y){
      var target = this.game.el.find('div.boardrow:eq('+y+')').find('div.boardplace:eq('+x+')').children('.square:last');
      if(!target) return false;
      if(target.hasClass('neutral') || target.hasClass(this.color)){
        return true;
      }else{
        if(!target.hasClass('current') && target.data('level')<this.square.data('level')){
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
        this.game.moves.push({p:this.name,m:'n'});
        return this.place();
      } 
    };
    this.moveDown = function() {
      if(this.canMoveTo(this.x,this.y+1)){
        this.square.removeClass('current');
        this.y++;
        this.game.moves.push({p:this.name,m:'s'});
        return this.place();
      }
    };
    this.moveLeft = function() {
      if(this.canMoveTo(this.x-1,this.y)){
        this.square.removeClass('current');
        this.x--;
        this.game.moves.push({p:this.name,m:'w'});
        return this.place();
      }
    };
    this.moveRight = function() {
      if(this.canMoveTo(this.x+1,this.y)){
        this.square.removeClass('current');
        this.x++;
        this.game.moves.push({p:this.name,m:'e'});
        return this.place();
      }
    };
    this.jump = function() {
      if(this.square.data('level')<this.game.boardSize){
        this.square.removeClass('current');
        this.game.addSquare(this.x,this.y);
        this.game.moves.push({p:this.name,m:'u'});
        return this.place();
      }
    };
}


//utilities
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
Array.prototype.shuffle = function() {
  var s = [];
  while (this.length) s.push(this.splice(Math.random() * this.length, 1));
  while (s.length) this.push(s.pop()[0]);
  return this;
}