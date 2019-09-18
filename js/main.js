var canvas;

(function() {
  var $ = function(id){return document.getElementById(id)};

  canvas = this.__canvas = new fabric.Canvas('c', {
    isDrawingMode: true //기본 선 불러오기

  });

  var rect, isDown, origX, origY;
  var isRedoing = false;
  var h = [];

 function makeLine(coords) {
    return new fabric.Line(coords, {
      fill: 'black',
      stroke: 'black',
      strokeWidth: 1,
      selectable: false
    });
  }
  
  var line = makeLine([ 30, 100, 200, 100 ]),
  line2 = makeLine([ 30, 190, 670, 190 ]),
  line3 = makeLine([ 30, 230, 670, 230 ]),
  line4 = makeLine([ 30, 270, 670, 270 ]),
  line5 = makeLine([ 30, 310, 670, 310 ]),
  line6 = makeLine([ 30, 350, 670, 350 ]),
  line7 = makeLine([ 30, 390, 670, 390 ]),
  line8 = makeLine([ 30, 430, 670, 430 ])
  line9 = makeLine([ 30, 470, 670, 470 ]);
  
  canvas.add(line, line2, line3, line4, line5, line6,line7,line8,line9);

  fabric.Object.prototype.transparentCorners = false;

  var drawingModeEl = $('drawing-mode'), //그림 모드인가 아닌가 (나중에 삭제해도 될듯)
    drawingOptionsEl = $('drawing-mode-options'),   //모드 정하기
    drawingColorEl = $('drawing-color'),   //색깔 정하기
    drawingShadowColorEl = $('drawing-shadow-color'), //그림자모드 색깔
    drawingLineWidthEl = $('drawing-line-width'), 
    drawingShadowWidth = $('drawing-shadow-width'), //그림자모드 굵기
    drawingShadowOffset = $('drawing-shadow-offset'), //그림자 섀도우 번짐의 정도
    erasing=$('eraser'),  //지우개
    uploadImage=$('upload'), //이미지 불러오기
    savingImage=$('download'),  //캔버스 저장
    undoing=$('undo'),  //뒤로 가기
    redoing=$('redo'),  //앞으로 가기
    clearEl = $('clear-canvas');  //캔버스 리셋


  canvas.on('object:added',function(){
    if(!isRedoing){
      h = [];
    }
    isRedoing = false;
  });

  //캔버스 리셋
  clearEl.onclick = function() { canvas.clear() };

  //이미지 저장하기
  savingImage.onclick = function() {
    var link = document.createElement('a');   
    link.download = "download.png";
    link.href = canvas.toDataURL("download/png");
    link.click();
  }

  //이미지 불러오기
  uploadImage.onclick = function () {
   var input = document.createElement('input'); 

    input.setAttribute("type", "file");

      input.addEventListener('change', function() {
      var isChrome = !!window.chrome && !!window.chrome.webstore;
      var path = input.value;
      console.log(path);

      if (isChrome) {
         path = 'img' + path.split('akepath')[1];
         console.log(path);
      } else {
        path = 'img' + path.split('akepath')[1];
        console.log(path);
      }

      fabric.Image.fromURL(path, function(img) {
         canvas.add(img);
      });
   });

    input.click(); 
  };
  
  
      
  
  //뒤로가기
  undoing.onclick=function() {
    if(canvas._objects.length>0){
     h.push(canvas._objects.pop());
     canvas.renderAll();
    } 
  }

  //앞으로 가기
  redoing.onclick=function() {
    if(h.length>0){
      isRedoing = true;
     canvas.add(h.pop());
    }
  }

  //캔버스 그릴래 안 그릴래
  // drawingModeEl.onclick = function() {
  //   canvas.isDrawingMode = canvas.isDrawingMode;
  //   // if (canvas.isDrawingMode) {
  //   //   drawingModeEl.innerHTML = 'Cancel drawing mode';
  //   //   drawingOptionsEl.style.display = '';
  //   // }
  //   // else {
  //   //   drawingModeEl.innerHTML = 'Enter drawing mode';
  //   //   drawingOptionsEl.style.display = 'none';
  //   // }
  // };

  if (fabric.PatternBrush) {
    var vLinePatternBrush = new fabric.PatternBrush(canvas);
    vLinePatternBrush.getPatternSrc = function() {

      var patternCanvas = fabric.document.createElement('canvas');
          patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.lineTo(10, 5);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    var hLinePatternBrush = new fabric.PatternBrush(canvas);
    hLinePatternBrush.getPatternSrc = function() {

      var patternCanvas = fabric.document.createElement('canvas');
          patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(5, 10);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    var squarePatternBrush = new fabric.PatternBrush(canvas);
    squarePatternBrush.getPatternSrc = function() {

      var squareWidth = 10, squareDistance = 2;

      var patternCanvas = fabric.document.createElement('canvas');
          patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
      var ctx = patternCanvas.getContext('2d');

          ctx.fillStyle = this.color;
          ctx.fillRect(0, 0, squareWidth, squareWidth);

          return patternCanvas;
    };

    var diamondPatternBrush = new fabric.PatternBrush(canvas);
    diamondPatternBrush.getPatternSrc = function() {

      var squareWidth = 10, squareDistance = 5;
      var patternCanvas = fabric.document.createElement('canvas');
      var rect = new fabric.Rect({
          width: squareWidth,
          height: squareWidth,
          angle: 45,
          fill: this.color
      });

      var canvasWidth = rect.getBoundingRect().width;

      patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
      rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

      var ctx = patternCanvas.getContext('2d');
        rect.render(ctx);

      return patternCanvas;
    };

    // var img = new Image();
    // img.src = '../assets/honey_im_subtle.png';

    // var texturePatternBrush = new fabric.PatternBrush(canvas);
    // texturePatternBrush.source = img;
  }
  //PatternBrush 끝

  $('drawing-mode-selector').onchange = function() {
    if (this.value === 'hline') {
      canvas.freeDrawingBrush = vLinePatternBrush;
    }
    else if (this.value === 'vline') {
      canvas.freeDrawingBrush = hLinePatternBrush;
    }
    else if (this.value === 'square') {
      canvas.freeDrawingBrush = squarePatternBrush;
    }
    else if (this.value === 'diamond') {
      canvas.freeDrawingBrush = diamondPatternBrush;
    }
    else if (this.value === 'texture') {
      canvas.freeDrawingBrush = texturePatternBrush;
    }
    else {
      canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
    }

    //이건 그림자 모드 추가
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = drawingColorEl.value;
      canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
      canvas.freeDrawingBrush.shadow = new fabric.Shadow({
        blur: parseInt(drawingShadowWidth.value, 10) || 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: true,
        color: drawingShadowColorEl.value,
      });
    }
  };
  //drawing-mode-selector 끝

  //색깔 바꾸기
  drawingColorEl.onchange = function() {
    canvas.freeDrawingBrush.color = this.value;
  };

  //긁기 바꾸기
  drawingLineWidthEl.onchange = function() {
    canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
    this.previousSibling.innerHTML = this.value;
  };

  //그림자모드
  // drawingShadowColorEl.onchange = function() {
  //   canvas.freeDrawingBrush.shadow.color = this.value;
  // };

  //그림자모드 굵기
  // drawingShadowWidth.onchange = function() {
  //   canvas.freeDrawingBrush.shadow.blur = parseInt(this.value, 10) || 0;
  //   this.previousSibling.innerHTML = this.value;
  // };

  //그림자 번짐 정도
  // drawingShadowOffset.onchange = function() {
  //   canvas.freeDrawingBrush.shadow.offsetX = parseInt(this.value, 10) || 0;
  //   canvas.freeDrawingBrush.shadow.offsetY = parseInt(this.value, 10) || 0;
  //   this.previousSibling.innerHTML = this.value;
  // };

  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = drawingColorEl.value;
    canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
    // canvas.freeDrawingBrush.shadow = new fabric.Shadow({
    //   blur: parseInt(drawingShadowWidth.value, 10) || 0,
    //   offsetX: 0,
    //   offsetY: 0,
    //   affectStroke: true,
    //   color: drawingShadowColorEl.value,
    // });
  }

  erasing.onclick=function() {
    console.log('hi');
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new fabric['PencilBrush'](canvas);
    canvas.freeDrawingBrush.color = 'White';
    canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
  }
  // drawingRectangle.onclick = function() {
  //   canvas.on('mouse:down', function(o){
  //     isDown = true;
  //     var pointer = canvas.getPointer(o.e);
  //     origX = pointer.x;
  //     origY = pointer.y;
  //     var pointer = canvas.getPointer(o.e);
  //     rect = new fabric.Rect({
  //       left: origX,
  //       top: origY,
  //       originX: 'left',
  //       originY: 'top',
  //       width: pointer.x-origX,
  //       height: pointer.y-origY,
  //       angle: 0,
  //       fill: 'rgba(0,0,0,1)',
  //       transparentCorners: false
  //     });
  //     canvas.add(rect);
  //   });

  //   canvas.on('mouse:move', function(o){
  //     if (!isDown) return;
  //     var pointer = canvas.getPointer(o.e);
              
  //     if(origX>pointer.x){
  //       rect.set({ left: Math.abs(pointer.x) });
  //     }
  //     if(origY>pointer.y){
  //       rect.set({ top: Math.abs(pointer.y) });
  //     }
              
  //     rect.set({ width: Math.abs(origX - pointer.x) });
  //     rect.set({ height: Math.abs(origY - pointer.y) });
              
  //     canvas.renderAll();
  //   });

  //   canvas.on('mouse:up', function(o){
  //     isDown = false;
  //   });
  // }
})();