
function setupFileReader(target, callable) {

	if (typeof FileReader === "undefined") throw "不支援 FileReader";
	if (typeof callable !== "function") throw "arg2 必須是function";

	var file = target.files[0];

	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function(e){
		callable(this.result, file);
	}

	return reader;
}


function loadImgae(src, callable) {

	if (typeof callable !== "function") throw "arg2 必須是function";

	var image = new Image;
	image.src = src;

	image.onload = function() {
		callable(this);
	}

	image.onerror = function(e) {
		throw e;
	}

	return image;
}


function toDataUrl(image, type, quality) {

	try {
		var canvas = document.createElement("canvas");

		canvas.width  = image.width;
		canvas.height = image.height;

		var ctx = canvas.getContext("2d");
		ctx.drawImage(image, 0, 0);

		return canvas.toDataURL("image/" + type, quality * 0.01);

	} catch(e) {
		console.log(e);
	}
}


function $(query) {
	return document.querySelector(query);
}


window.addEventListener("load", function() {
	$("#inputFile").addEventListener("change", function() {
		$("#inputText").value = this.files[0].name;
		clearOutput();
	});

	$("#inputFile").addEventListener("change", function() {

		$("#inputImageUrl").value = "";

		var imageWrapper = $("#inputImageWrapper");
		imageWrapper.innerHTML = "";
		

		setupFileReader(this, onFileLoaded);

		function onFileLoaded(src, file) {
			if ( ! (/image\/\w+/.test(file.type))) return;

			$("#inputImageUrl").value = src;
			loadImgae(src, onImageLoaded);
		}

		function onImageLoaded(image) {
			imageWrapper.appendChild(image);
		}
	});

	$("#inputSubmit").addEventListener("click", function() {
		this.blur();

		var src = $("#inputImageUrl").value;
		if ( ! src) return;

		var output = $("#outputText");
		output.value = "Loading...";

		var imageWrapper = $("#outputImageWrapper");
		imageWrapper.innerHTML = "";


		loadImgae(src, onImageLoaded);
		
		function onImageLoaded(image) {
			var type    = $("input[name=type]:checked").value;
			var quality = $("#inputQuality").value;

			var dataUrl = toDataUrl(image, type, quality);
			output.value = dataUrl;
			

			loadImgae(dataUrl, function(image) {
				imageWrapper.appendChild(image);
			});
		}
	});

	$("#outputButton1").addEventListener("click", function() {
		var target = $("#outputText");
		target.focus();
		target.select();
	});

	$("#outputButton2").addEventListener("click", function() {
		var target = $("#outputText");
		if (target.value) location.href = target.value;
	});

	$("#outputButton3").addEventListener("click", function() {
		clearOutput();
	});

	function clearOutput() {
		$("#outputImageWrapper").innerHTML = "";
		$("#outputText").value = "";
	}
});
