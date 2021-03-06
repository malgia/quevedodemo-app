const path = require('path');
const fs = require('fs');

const { cv, grabFrames } = require('./opencv-helpers');
const matchFeatures = require('./match-features');
const { opencv, classNames } = require('./config');
// const openalpr = require ("node-openalpr");
const tesseract = require('tesseractocr');


if (!cv.modules.dnn) {
	throw new Error('exiting: opencv4nodejs compiled without dnn module');
}


// set stdout encoding to 'binary'
process.stdout.setDefaultEncoding('binary');

const modelPath = path.resolve(__dirname, '../model/frozen_inference_graph.pb');
const configPath = path.resolve(
	__dirname,
	'../model/ssd_mobilenet_v2_coco_2018_03_29.pbtxt'
);

if (!fs.existsSync(modelPath) || !fs.existsSync(configPath)) {
	console.log('could not find tensorflow object detection model');
	console.log(
		'download the model from: https://github.com/opencv/opencv/wiki/TensorFlow-Object-Detection-API#use-existing-config-file-for-your-model'
	);
	throw new Error('exiting: could not find tensorflow object detection model');
}

// initialize tensorflow darknet model from modelFile
const net = cv.readNetFromTensorflow(modelPath, configPath);

// set webcam interval
const camInterval = 1000 / opencv.camFps;

exports.objectDetect = (im) => {
	// object detection model works with 300 x 300 images
	const size = new cv.Size(300, 300);
	const vec3 = new cv.Vec(0, 0, 0);

	// network accepts blobs as input
	//const inputBlob = cv.blobFromImage(img, 1, size, vec3, true, true);

	// const inputBlob = cv.blobFromImage(im, 1, size, vec3, true, true);
	// net.setInput(inputBlob);

	const img = cv.imdecode(Buffer.from(im, 'base64'));
	const filename = 'public/images/screenshot_'+new Date().toLocaleString().split(' ').join('')+'.jpg';
	try{
		fs.writeFileSync(filename, im, {encoding: 'base64'});
		//console.log('success');
		if (fs.existsSync(filename, err=> {if(err) console.log(err)})) {
			//console.log(filename);
			const plate_img = cv.imread(filename);
			gray = plate_img.cvtColor(cv.COLOR_BGR2GRAY)
			blurred = gray.gaussianBlur(new cv.Size(5, 5), 0)
			thresh = blurred.threshold(60, 255, cv.THRESH_BINARY)
			cnts = thresh.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE);
			if(cnts){
				cnts = cnts.sort((c0, c1) => c1.area - c0.area);
				const imgCnts = cnts.map((cnt) => {
	                return cnt.getPoints();
	            });
				//console.log(imgCnts);
				// thresh.drawContours(imgCnts, -1, new cv.Vec(0,0,255), 2);
				cv.imwrite(filename, thresh);
				tesseract.recognize(filename, {language: 'Shentox', tessdataDir: 'utils/tessdata' ,configfiles: 'utils/tesseract.config', psm: 9, userWords: 'utils/tessdata/Shentox.userwords'}, (err, data) => {
					if(err) {
						console.log('err:',err.stderr);
						if (fs.existsSync(filename, err=> {if(err) console.log(err)})) {
							fs.unlinkSync(filename, err=> {if(err) console.log(err)});
						}
					}else{
						if(!data ) {
							console.log('nothing');
							if (fs.existsSync(filename, err=> {if(err) console.log(err)})) {
								fs.unlinkSync(filename, err=> {if(err) console.log(err)});
							}
						} else {
							data = data.trim();
							if(data.length != 3){
								console.log('wrong:'+data);
							} else {
								console.log('Placa #'+data);
								thresh.putText('Placa #Ba7', new cv.Point(0, 0), cv.FONT_HERSHEY_SIMPLEX, 1, new cv.Vec(255, 0, 0), 3);
								return 'data:image/jpeg;base64,'+cv.imencode('.jpg', thresh).toString('base64');
							}
						}
					}
				});
				//cv.imshowWait('ORB with BFMatcher - crossCheck true', thresh);
			}

		}
	}catch(err){
		console.log(err);
	}

	const inputBlob = cv.blobFromImage(img, 1, size, vec3, true, true);
	net.setInput(inputBlob);

	// forward pass input through entire network, will return
	// classification result as 1x1xNxM Mat
	const outputBlob = net.forward();

	// get height and width from the image
	const [imgHeight, imgWidth] = img.sizes;
	const numRows = outputBlob.sizes.slice(2, 3);

	for (let y = 0; y < numRows; y += 1) {
		const confidence = outputBlob.at([0, 0, y, 2]);
		if (confidence > 0.3) {
			const classId = outputBlob.at([0, 0, y, 1]);
			const className = classNames[classId];
			const boxX = imgWidth * outputBlob.at([0, 0, y, 3]);
			const boxY = imgHeight * outputBlob.at([0, 0, y, 4]);
			const boxWidht = imgWidth * outputBlob.at([0, 0, y, 5]);
			const boxHeight = imgHeight * outputBlob.at([0, 0, y, 6]);

			const pt1 = new cv.Point(boxX, boxY);
			const pt2 = new cv.Point(boxWidht, boxHeight);
			const rectColor = new cv.Vec(23, 230, 210);
			const rectThickness = 2;
			const rectLineType = cv.LINE_8;

			// draw the rect for the object
			img.drawRectangle(pt1, pt2, rectColor, rectThickness, rectLineType);

			// const text = `${className} ${confidence.toFixed(5)}`;
			const text = `${className}`;
			const org = new cv.Point(boxX, boxY + 15);
			const fontFace = cv.FONT_HERSHEY_SIMPLEX;
			const fontScale = 0.5;
			const textColor = new cv.Vec(123, 123, 255);
			const thickness = 2;

			// put text on the object
			img.putText(text, org, fontFace, fontScale, textColor, thickness);

			// if (fs.existsSync(filename)) {
			//
			// 	openalpr.Start ();
			//
			// 	for (var i = 0; i < 350; i++) {
			// 		openalpr.IdentifyLicense (filename, function (error, output) {
						// var results = output.results;
						// console.log(output);
						// if(results.length > 0) {
						// 	img.putText('Placa: '+results[0].plate, org, fontFace, fontScale, textColor, thickness);
						// } else {
						//
						// }
						// if (i == 349) {
				        //     console.log (openalpr.Stop ());
				        // }
						// if (error) {
						// 	console.log(filename);
						// }
			// 		});
			// 	}
			// }
		}
	}



	// write the jpg binary data to stdout
	return 'data:image/jpeg;base64,'+cv.imencode('.jpg', img).toString('base64');
};

// const runWebcamObjectDetect = (src, objectDetect) =>
// 	grabFrames(src, camInterval, (frame) => {
// 		const frameResized = frame.resizeToMax(opencv.frameSize);
//
// 		// detect objects
// 		objectDetect(frameResized);
// 	});
//
//
// runWebcamObjectDetect(opencv.camPort, objectDetect);
