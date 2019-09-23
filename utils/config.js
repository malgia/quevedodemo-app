/**
 * Here to set opencv configs
 */
exports.opencv = {
	// set webcam port
	camPort: 0,
	// set webcam FPS
	camFps: 60,
	// set frame size
	frameSize: 640
};

/**
 * Here to set server configs
 */
exports.server = {
	// set http port
	httpPort: 8080,
	// set websocket port
	wsPort: 8081,
	// set stream port
	streamPort: 8082,
	// set stream secret
	streamSecret: 'N23y08VnzfDH4Wmf2tXoDyxbwf2rGQJC'
};

/**
 * Here to set tensorflow object detection class names
 */
exports.classNames = {
	0: 'fondo',
	1: 'persona',
	2: 'bicicleta',
	3: 'carro',
	4: 'moto',
	5: 'semaforo',
	6: 'señal pare',
	14: 'parquimetro',
	15: 'bench',
	16: 'pajaro',
	17: 'gato',
	18: 'perro',
	19: 'caballo',
	20: 'sheep',
	21: 'cow',
	22: 'elephant',
	23: 'bear',
	24: 'zebra',
	25: 'giraffe',
	27: 'backpack',
	28: 'umbrella',
	31: 'handbag',
	32: 'tie',
	33: 'suitcase',
	34: 'frisbee',
	35: 'skis',
	36: 'snowboard',
	37: 'sports ball',
	38: 'kite',
	39: 'baseball bat',
	40: 'baseball glove',
	41: 'skateboard',
	42: 'surfboard',
	43: 'tennis racket',
	44: 'bottle',
	46: 'wine glass',
	47: 'cup',
	48: 'fork',
	49: 'knife',
	50: 'spoon',
	51: 'bowl',
	52: 'banana',
	53: 'apple',
	54: 'sandwich',
	55: 'orange',
	56: 'broccoli',
	57: 'carrot',
	58: 'hot dog',
	59: 'pizza',
	60: 'donut',
	61: 'cake',
	62: 'chair',
	63: 'couch',
	64: 'potted plant',
	65: 'bed',
	67: 'dining table',
	70: 'toilet',
	72: 'tv',
	73: 'laptop',
	74: 'mouse',
	75: 'remote',
	76: 'keyboard',
	77: 'cell phone',
	78: 'microwave',
	79: 'oven',
	80: 'toaster',
	81: 'sink',
	82: 'refrigerator',
	84: 'book',
	85: 'clock',
	86: 'vase',
	87: 'scissors',
	88: 'teddy bear',
	89: 'hair drier',
	90: 'toothbrush'
};
