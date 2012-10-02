(function(W,D){

	var feedback = {},
	highlight = {},
	highlights,
	canvas, ctx, fillStyle;

	fillStyle = 'rgba(0,0,0, 0.7)';

	var init = function(){
		canvas = document.createElement('canvas');
		canvas.style.position = 'fixed';
		canvas.style.left = 0;
		canvas.style.top = 0;
		document.body.appendChild(canvas);
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		ctx = canvas.getContext('2d');

		ctx.fillStyle = fillStyle;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		canvas.addEventListener('mousedown', drawHighlight, false);

		bindDownload();
	};

	var downloadHandler = function(e){
		if(String.fromCharCode(e.which) == 'd')
			saveImage();
	}

	var bindDownload = function(){
		window.addEventListener('keypress', downloadHandler, false);
	}

	var unbindDownload = function(){
		window.removeEventListener('keypress', downloadHandler, false);
	}

	var drawHighlight = function(e){
		highlight.initialX = e.offsetX;
		highlight.initialY = e.offsetY;
		canvas.addEventListener('mousemove', expandHighlight, false);
		canvas.addEventListener('mouseup', clipHighlight, false);
	};

	var expandHighlight = function(e){
		highlight.currentX = e.offsetX;
		highlight.currentY = e.offsetY;

		var w = Math.abs(e.offsetX - highlight.initialX), h = Math.abs(e.offsetY - highlight.initialY),
		x = highlight.initialX < highlight.currentX ? highlight.initialX : highlight.currentX,
		y = highlight.initialY < highlight.currentY ? highlight.initialY : highlight.currentY;
		ctx.clearRect(x, y, w, h);
		highlight.final = {x:x, y:y, w:w, h:h};
	};

	var clipHighlight = function(e){
		canvas.removeEventListener('mousemove', expandHighlight, false);

		var clip = document.createElement('div');
		clip.className = 'clip';
		clip.style.position = 'fixed';
		clip.style.left = highlight.final.x+'px';
		clip.style.top = highlight.final.y+'px';
		clip.style.width = highlight.final.w+'px';
		clip.style.height = highlight.final.h+'px';
		clip.properties = highlight.final;
		
		clip.addEventListener('click', newClipNote);
		document.body.appendChild(clip);
	};

	var newClipNote = function(e){
		var clip = e.target;
		var note = document.createElement('div');
		note.className = 'note';
		note.style.width = '80px';
		note.style.position = 'absolute';
		note.style.left = (clip.properties.x + clip.properties.w + 10) + 'px';
		note.style.top = (clip.properties.y) + 'px';
		note.innerHTML = 'Tip your note here';
		note.contentEditable = true;
		note.addEventListener('focus', function(){
			unbindDownload();
		}, false);
		note.addEventListener('blur', function(){
			bindDownload();
		}, false);
		document.body.appendChild(note);
	}

	var saveImage = function(){

		html2canvas([document.body], {
			onrendered: function(finalCanvas){
				var finalCtx = finalCanvas.getContext('2d');
				var imageUrl = finalCanvas.toDataURL('image/jpeg');
				//document.write('<img src="'+imageUrl+'"/>');
				var imageUrl = imageUrl.replace("image/jpeg", "image/octet-stream");
				//console.log(imageUrl);
				window.location.href = imageUrl;
				//window.open(imageUrl,'_blank');
			}
		});

	};


	feedback.init = init;
	feedback.saveImage = saveImage;
	W.feedback = feedback;

})(window, document);


feedback.init();