// globals!

var endorseeInfo;	// dictionary - name, office, caucus
var name;
var job;
var quotation;
var volunteer;
var doorknocking;
var calling;
var texting;
var berning;
var othervolunteering;
var bgcolor;
var background;
var avatarImageSrc;
var plural;

var imgs=[];
var imagesOK=0;
var statePath = '';
var candidatePath = '';



// Load multiple images and draw when totally finished loading
// https://stackoverflow.com/questions/33596638/loading-multiple-png-images-in-html5-canvas#answer-33601666

// put the paths to your images in imageURLs[]
var imageURLs=[];

const AVATAR = 0
const BACKGROUND = 1
const BERNIE = 2
const STATE = 3
const CANDIDATE = 4

// red = #ec1f2b
const dsared = '#EE3342';

// https://stackoverflow.com/a/53636623/25560
const prepareFontLoad = (fontList) => Promise.all(fontList.map(font => document.fonts.load(font)));

/* exported startGeneratingImage */

async function startGeneratingImage() {

	const fontList = ['700 60px Montserrat', '700 italic 60px Montserrat', '700 60px freight-sans-pro', '500 60px freight-sans-pro', ]
	await prepareFontLoad(fontList);

	// the loaded images will be placed in imgs[]
	imgs=[];

	imageURLs=[];
	imageURLs.push(avatarImageSrc ? avatarImageSrc : "img/logo.png");

	imageURLs.push('img/' + background);
	imageURLs.push("img/logo.png");

	imagesOK=0;
	startLoadingAllImages(imagesAreNowLoaded);
}

// Create a new Image() for each item in imageURLs[]
// When all images are loaded, run the callback (==imagesAreNowLoaded)
function startLoadingAllImages(callback){

	// iterate through the imageURLs array and create new images for each
	for (var i=0; i<imageURLs.length; i++) {
		// create a new image an push it into the imgs[] array
		var img = new Image();
		// Important! By pushing (saving) this img into imgs[],
		//     we make sure the img variable is free to
		//     take on the next value in the loop.
		imgs.push(img);
		// when this image loads, call this img.onload
		img.onload = function(){
			// this img loaded, increment the image counter
			imagesOK++;
			// if we've loaded all images, call the callback
			if (imagesOK>=imageURLs.length ) {
				callback();
			}
		};
		// notify if there's an error
		img.onerror=function(){
			alert("image load failed: " + imageURLs[i]);
		}
		// set img properties
		img.src = imageURLs[i];
	}
}

// All the images are now loaded
function imagesAreNowLoaded(){

	// DRAW SOME TEXT

	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	var w = canvas.width;
	var h = canvas.height;

	// Background Color

	ctx.fillStyle = bgcolor;
	ctx.fillRect(0, 0, w, h);

	// ----------------------------------------------------- Background Image - width is twice height

		ctx.globalAlpha = 0.7;
    // if background.includes("Join") {
    //   ctx.globalAlpha = 1.0;
    // }
		ctx.drawImage(imgs[BACKGROUND], 0, 0, w, h/2);
		ctx.globalAlpha = 1.0;



	// ----------------------------------------------------- Background Image - width is twice height
    //
		// if (background.includes('-')) {
    //
		// 	ctx.font = "500 " + String(20 * h/1000) + "px freight-sans-pro, monospace";
		// 	ctx.textAlign = "right"
    //
		// 	var link = background.replace('background-', 'https://flic.kr/p/');
		// 	link = link.replace('.jpg', '');
    //
		// 	ctx.fillStyle = 'rgba(255,255,255,0.3)';
    //
		// 	ctx.fillText(link, w*.99, h*0.02, w*.90);
		// }



	// ----------------------------------------------------- Avatar + Circle

	var centerX = w * 0.25;
	var centerY = h * 0.22;
	var radius = w * 0.19;

	// Save the state, so we can undo the clipping
	ctx.save();

	// Create a circle
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);

	// Clip to the current path
	ctx.clip();

	var image = imgs[AVATAR];
	var imageWidth = image.naturalWidth;
	var imageHeight = image.naturalHeight;
	var aspect = imageWidth / imageHeight;

	if (aspect > 1.0) {

		ctx.drawImage(image, centerX-(radius*aspect), centerY-radius, radius*2*aspect,radius*2);

	}
	else {

		ctx.drawImage(image, centerX-radius, centerY-(radius/aspect), radius*2,(radius/aspect)*2);

	}


	// Undo the clipping
	ctx.restore();


	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	ctx.lineWidth = w * 0.015;
	ctx.strokeStyle = 'white';
	ctx.stroke();

	// ----------------------------------------------------- Job Title

	ctx.font = "700 " + String(30 * h/1000) + "px freight-sans-pro, monospace";
	ctx.textAlign = "left"

	var textWidth = ctx.measureText(job+ " ").width;
	var textX = w*0.051

	ctx.fillStyle = 'black';
	ctx.fillRect(0, h*0.39, textX+textWidth, h*0.036)

	ctx.fillStyle = 'white';

	ctx.fillText(job, textX, h*0.415, w*0.9);

	// ----------------------------------------------------- Name + Endorses ______

	var endorses = "joined ";//(plural ? "endorse" : "endorses") + " ";
	var endorseeName = "MORE";//endorseeInfo.name;

	var fontSize = 112 * w/1000;
	ctx.font = "700 " + String(fontSize) + "px Montserrat,monospace";

	var textWidth1 = ctx.measureText(name).width;


	ctx.font = "700 italic " + String(fontSize) + "px Montserrat,monospace";
	var textWidth2a = ctx.measureText(endorses).width;
	ctx.font = "700 " + String(fontSize) + "px Montserrat,monospace";
	var textWidth2 = textWidth2a + ctx.measureText(endorseeName).width;



	// Make sure user's and "endorses" + endorsee's name fits

	if (textWidth1 > w * 0.9 || textWidth2 > w*0.9) {
		fontSize *= w*0.9/Math.max(textWidth1, textWidth2);
		ctx.font = "700 " + String(fontSize) + "px Montserrat,monospace";

		// Recalc widths based on new size
		textWidth1 = ctx.measureText(name).width;
		ctx.font = "700 italic " + String(fontSize) + "px Montserrat,monospace";
		textWidth2a = ctx.measureText(endorses).width;
		ctx.font = "700 " + String(fontSize) + "px Montserrat,monospace";
		textWidth2 = textWidth2a + ctx.measureText(endorseeName).width;
	}

	var ascent = fontSize * 0.74;
	var extra = h * 0.005;

	var y = h*0.52;
	textX = w*0.058

	ctx.fillStyle = dsared;
	ctx.fillRect(textX, y-ascent-extra, textWidth1, ascent+2*extra);

	ctx.fillStyle = 'white';
	ctx.fillText(name, textX, y, textWidth1);




	y = h*0.62;

	ctx.fillStyle = dsared;
	ctx.fillRect(textX, y-ascent-extra, textWidth2, ascent+2*extra);  // background of entire width - endorses + name

	ctx.font = "700 italic " + String(fontSize) + "px Montserrat,monospace";

	ctx.fillStyle = 'white';
	ctx.fillText(endorses, textX, y, textWidth2a);

	textX += textWidth2a;
	ctx.font = "700 " + String(fontSize) + "px Montserrat,monospace";

	textWidth2 = ctx.measureText(endorseeName).width

	ctx.fillStyle = 'white';
	ctx.fillText(endorseeName, textX, y, textWidth2);


	var andBernieText = "Join today at bit.ly/Join-MORE";

	fontSize = 80 * h/1000;
	ctx.font = "700 italic " + String(fontSize) + "px Montserrat,monospace";
	var textWidth4 = ctx.measureText(andBernieText).width

	if (textWidth4 + textX > w * 0.8) {
		fontSize *= w*0.8/textWidth4;
		ctx.font = "700 italic " + String(fontSize) + "px Montserrat,monospace";

		// Recalc width based on new size
		textWidth4 = ctx.measureText(andBernieText).width;
	}

	ascent = fontSize * 0.74;
	y = h*.93;
	textX = w*0.058


	ctx.fillStyle = dsared;
	ctx.fillRect(textX-extra, y-ascent-extra, textWidth4+2*extra, ascent+2*extra);

	ctx.fillStyle = 'white';
	ctx.fillText(andBernieText, textX, y, textWidth4);


	// Third & fourth lines (but not for Bernie)

	// if (endorseeName != "Bernie") {
  //
	// 	extra = h * 0.003;
	// 	textX = w*0.40;
  //
	// 	var officeText = "for " + endorseeInfo.officeText;
	// 	fontSize = 80 * h/1000;
	// 	ctx.font = "700 " + String(fontSize) + "px Jubilat,monospace";
	// 	textWidth3 = ctx.measureText(officeText).width
  //
	// 	if (textWidth3 + textX > w * 0.9) {
	// 		fontSize *= w*0.5/textWidth3;
	// 		ctx.font = "700 " + String(fontSize) + "px Jubilat,monospace";
  //
	// 		// Recalc width based on new size
	// 		textWidth3 = ctx.measureText(officeText).width;
	// 	}
	// 	ascent = fontSize * 0.74;
	// 	y = h*.67;
  //
	// 	ctx.fillStyle = 'white';
	// 	ctx.fillRect(textX, y-ascent-extra, textWidth3, ascent+2*extra);
  //
	// 	ctx.fillStyle = 'red';
	// 	ctx.fillText(officeText, textX, y, textWidth3);
  //
  //
  //
  //
	// 	var andBernieText = "& Bernie Sanders for President";
  //
	// 	fontSize = 80 * h/1000;
	// 	ctx.font = "700 italic " + String(fontSize) + "px Jubilat,monospace";
	// 	var textWidth4 = ctx.measureText(andBernieText).width
  //
	// 	if (textWidth4 + textX > w * 0.8) {
	// 		fontSize *= w*0.8/textWidth4;
	// 		ctx.font = "700 italic " + String(fontSize) + "px Jubilat,monospace";
  //
	// 		// Recalc width based on new size
	// 		textWidth4 = ctx.measureText(andBernieText).width;
	// 	}
  //
	// 	ascent = fontSize * 0.74;
	// 	y = h*.93;
	// 	textX = w*0.058
  //
  //
	// 	ctx.fillStyle = 'white';
	// 	ctx.fillRect(textX-extra, y-ascent-extra, textWidth4+2*extra, ascent+2*extra);
  //
	// 	ctx.fillStyle = 'red';
	// 	ctx.fillText(andBernieText, textX, y, textWidth4);
  //
  //
	// }

	// TODO - draw boxes THEN draw text.



	// ----------------------------------------------------- Quote Mark

	ctx.font = "700 " + String(150 * h/1000) + "px Montserrat,monospace";
	ctx.fillStyle = 'rgba(255,255,255,0.5)';
	ctx.fillText("“", w*0.031, h*0.77, w*0.9);


	// ----------------------------------------------------- Paragraph Text
	var setting = {
			maxSpaceSize : 1,
			minSpaceSize : 1,
			lineSpacing : 1.07,
			compact : false
	}

	ctx.textAlign = "left";
	ctx.fillStyle = "transparent";

	var endquote = "”";
	var left = w*.09;
	var wid = w*.82;
	var origY = h*0.72;
	var size;
	var volSize;

	var volunteerString = "";
	console.log("doing paragraph!")
	for(size = 50 ; size > 15 ; size -= 1) {
		console.log(size);
		y = origY;
		ctx.font = "700 " + String(size * h/1000) + "px freight-sans-pro, monospace";

		// Draw paragraph
		var line = ctx.fillParaText(quotation+endquote, left, y, wid, setting);  // settings is remembered

    	y = line.nextLine;
		if (y < h * 0.90) {
			break;  // it fits, so really draw now.
		}
	}


	// var GENERATED_TEXT = "Democratic Socialists of America";
	// var GENERATED_HASHTAG = " #TrySocialism #JoinDSA"
	// var IM_VOLUNTEERING = endorseeName == "Bernie" ? "I’m volunteering for Bernie by:" :  "I’m volunteering for Bernie & " + endorseeName + " by:";
	// const VOL_URL = "berniesanders.com/volunteer";

	ctx.fillStyle = "white";
	y = origY;
	ctx.font = "700 " + String(size * h/1000) + "px freight-sans-pro, monospace";
	line = ctx.fillParaText(quotation+endquote, left, y, wid, setting);  // settings is remembered
	// if (volunteer) {
	// 	ctx.font = "500 " + String(volSize * h/1000) + "px freight-sans-pro, monospace";
	// 	ctx.fillStyle = "rgba(255,255,255,0.7)";
	// 	y = line.nextLine + volSize*2;
	// 	ctx.fillText(IM_VOLUNTEERING, left, y, wid);
  //
	// 	ctx.font = "500 " + String(volSize*.75 * h/1000) + "px freight-sans-pro, monospace";
	// 	ctx.fillStyle = "rgba(255,255,255,0.4)";
	// 	ctx.textAlign = "right"
	// 	ctx.fillText(VOL_URL, w*0.95, y, w*0.95);
  //
	// 	ctx.font = "500 " + String(volSize * h/1000) + "px freight-sans-pro, monospace";
	// 	ctx.fillStyle = "rgba(255,255,255,0.7)";
	// 	ctx.textAlign = "left"
	// 	y += volSize * 2;
	// 	ctx.fillText(volunteerString, left, y, wid);
  //
	// }




	// ----------------------------------------------------- BOTTOM STUFF

	// ctx.font = "500 " + String(20 * h/1000) + "px freight-sans-pro, monospace";
	// ctx.fillStyle = 'white';
	// ctx.fillText(GENERATED_TEXT, w*0.051, h*0.96, w*0.9);
  //
	// var thatWidth = ctx.measureText(GENERATED_TEXT + "  ").width;
	// ctx.fillStyle = 'RGBA(255,255,255,0.6';
	// ctx.font = "700 " + String(20 * h/1000) + "px freight-sans-pro, monospace";
	// ctx.fillText(GENERATED_HASHTAG, w*0.051 + thatWidth, h*0.96, w*0.9);
  //
	// ctx.font = "500 " + String(15 * h/1000) + "px freight-sans-pro, monospace";
	// ctx.fillStyle = 'RGBA(255,255,255,0.4';
	// ctx.fillText("Continuing the Political Revolution", w*0.051, h*0.98, w*0.9);


	var logoWidth = w*0.10;
	ctx.drawImage(imgs[BERNIE], w*0.88, h*0.88, logoWidth, logoWidth);

	canvas.toBlob(function(blob) {
        $("a#download").attr('href', URL.createObjectURL(blob));
        $("a#download").attr('download', "I_Joined_MORE.png");
	});

	var saveContainer = document.getElementById('saveContainer');
	saveContainer.style.display = 'block';		// reveal all!

	var canvas = document.getElementById('canvas');
	canvas.style.display = 'block';		// reveal all!

	var canvasImg = document.getElementById('canvasImg');
	canvasImg.style.display = 'none';		// hide sample image




	// Reference Image - overlay

		// ctx.globalAlpha = 0.4;
		// ctx.drawImage(imgs[REFERENCE], 0, 0, w, h);
		// ctx.globalAlpha = 1.0;


	// STORE INTO Local storage????
	// https://hacks.mozilla.org/2012/02/saving-images-and-files-in-localstorage/

	// How to save an image to localStorage and display it on the next page?
	// https://stackoverflow.com/questions/19183180/how-to-save-an-image-to-localstorage-and-display-it-on-the-next-page



}
