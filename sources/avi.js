$(document).ready(function(){
    var active;
    var enabled;
    var symbols ={'x' : '<i class="fa fa-user txt"><span style="color: white;font-size: small;">&nbspYou</span></i>',
                  'o' : '<i class="fa fa-tv txt"><b style="color: white;font-size: small;">AI</b></i>',
                  '?' : '<i class="fa fa-exclamation txt"></i>' };
    var human;
    var board;
    var moves;
    
    function toggleState(act){
      if (act === 'o')
        act = 'x';
      else
        act = 'o'
      return act;
    }
    
    function checkPatterns(pos){
      var row = Math.floor(pos/3);
      var col = pos%3;
      var diag = (col === row) ? 1 : ((col === 0 || col === 2) && (row === 2 || row === 0)) ? 2 : 0;
      var base = board[pos];
       if(board[row*3] === board[row*3 +1 ] && board[row*3] === board[row*3 + 2])
         return {pattern : 'r', number : row , symbol : base};
       if(board[col] === board[col + 3] && board[col] === board[col+6])
         return {pattern : 'c', number : col , symbol : base};
      if(diag === 1){
        if(board[0] === board[4] && board[0] === board[8])
          return {pattern : 'd', number : 1 , symbol : base};
        if(row == 1 && col == 1){
          if(board[2] === board[4] && board[4] === board[6])
            return {pattern : 'd', number : 2 , symbol : base};
        }
      }else if(diag ===2){
        if(board[2] === board[4] && board[4] === board[6])
          return {pattern : 'd', number : 2 , symbol : base};
      } 
      return false;
    }
  
    function updateScroll(){
        var element = document.getElementById("lastcurs");
        element.scrollTop = element.scrollHeight;
    }



  function minimax(symbol,pos,level){
      var i, res;     
      var w = checkPatterns(pos);
      if(w){
        if(w.symbol === active)
          return 100 + level;
        else
          return -100 - level;
      } else if (level === 0 || moves === 9) {
        return 0;
      }
      if(symbol !== active){
        res = 1000;
        for(i=0;i<9;i++){
        if(board[i]==undefined)
          {
            board[i]=symbol; 
            moves++;
            res = Math.min(res, minimax(toggleState(symbol),i,level-1));
            moves--;
            board[i]=undefined;
          }
        }
      }else{
        res = -1000;
        for(i=0;i<9;i++){
        if(board[i]==undefined)
          {
            board[i]=symbol;     
            moves++;
            res = Math.max(res, minimax(toggleState(symbol),i,level-1));
            board[i]=undefined;
            moves--;
          }
        }
      }
      return res;
    }
    
    function computerMove(pos=0){
        

      var i;
      var max=-1000; 
      var mi=4;
      var t;
          
      for(i=0;i<9;i++)
        if(board[i]==undefined)
        {
          board[i]=active;
          moves++
          t=minimax(toggleState(active),i,7);
          if(t>max)
          {
            max=t;
            mi=i;
          }
          board[i]=undefined;
          moves--;
        }

        if(mi==0){
            ki=mi+1;
            rn=pos+1;
            $('#cmd').append('<p class="line3"><img src="sources/ai_image.png" style="width:10%;height:10%;" />AI start move: Position->['+ki+']<b></b></p>');
            updateScroll();
 
        }else{
            rn=pos+1;
            ki=mi+1;
            $('#cmd').append('<p class="line4"><img src="sources/head.png" style="width:10%;height:10%;" />Human move:Position->['+rn+']<b></b></p>');
            $('#cmd').append('<p class="line3"><img src="sources/ai_image.png" style="width:10%;height:10%;" />computer move:Position->['+ki+']<b></b></p>');
            updateScroll();

        }

      return mi;

    }
     
    
    function displayTie(){
      // TODO
      $('.out').text("TIE!");
      $('.el-o').append($(symbols['?'])).addClass('tie');
      $('#cmd').empty();


    }
    
    function boardClick(){
      if(enabled && moves < 9){
        $(this).append($(symbols[active])).off('click').removeClass('free');
        var pos = parseInt($(this).attr('id').slice(1));
        board[pos] = active;
        active = toggleState(active);
        moves++;
        var w = checkPatterns(pos);
        // game ends
        if (w){
          displayWin(w);
          enabled = false;
          setTimeout(function(){
            $('.screen').fadeIn();
            $('.console').fadeIn();
          },500);
          $('#cmd').append('<p class="line2">AI<img src="sources/ai_image.png" style="width:10%;height:10%;" />>_Tac Toe AI  active....,<span class="cursor1">_</span></p> <p class="line1">AI<img src="sources/ai_image.png" style="width:10%;height:10%;" />>_Waiting for <img src="sources/head.png" style="width:10%;height:10%;" />Human input..<span class="cursor2">_</span></p> ');

          return;

        } else if (moves === 9){
          enabled = false;
          displayTie();
          setTimeout(function(){
            $('.screen').fadeIn();
            $('.console').fadeIn();
          },500);
          $('#cmd').append('<p class="line2">AI<img src="sources/ai_image.png" style="width:10%;height:10%;" />>_Tac Toe AI  active....,<span class="cursor1">_</span></p> <p class="line1">AI<img src="sources/ai_image.png" style="width:10%;height:10%;" />>_Waiting for <img src="sources/head.png" style="width:10%;height:10%;" />Human input..<span class="cursor2">_</span></p> ');
          return;
        } else {
          human = !human;
          if(!human){
            enabled=false;
             setTimeout(function(){
               enabled=true;
               $('#n'+computerMove(pos)).click();
             },500);
          }
          return;
        }
      }   
    }
    
    function displayWin(obj){
      $('.el').removeClass('free').off('click');
      switch (obj.pattern) {
        case 'r' :
          $('div.r'+obj.number+' div').addClass('win');
          break;
        case 'c' :
          $('.c'+obj.number).addClass('win');
          break;
        case 'd' :
          $('.d'+obj.number).addClass('win');
          break;       
      }
      $('.out').text('WINS!')
      $('.el-o').append($(symbols[obj.symbol])).addClass('win');
      $('#cmd').empty();

    }
    
    $('.el-s').click(function(){
      $('.screen').fadeOut();
      $('.select').fadeOut();
      if($(this).attr('id') === 'o'){
        active = 'o';
        human = false;
        enabled = false;
        setTimeout(function(){
          enabled = true;
          $('#n'+computerMove(0)).click();
        },500);
        $('#cmd').append('<p class="line3"><b><img src="sources/ai_image.png" style="width:10%;height:10%;" />Computer goes first..</b></p>');
        updateScroll();
      }else{
        $('#cmd').append('<p class="line4"><b><img src="sources/head.png" style="width:10%;height:10%;" />Human goes first..</b></p>');
        updateScroll();
      }
    });
    
    function init(){
      $('.el').empty().off('click').click(boardClick).removeClass('win').addClass('free');
      $('.el-o').empty().removeClass('win tie');
      active = 'x';
      board = new Array(9);
      enabled = true;
      human = true;
      moves = 0;
      $('.screen').fadeIn();
      $('.select').fadeIn();
      $('.console').fadeOut();
    }
  
    $('.console').click(init).click();
  });



  
