const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const MAXWIDTH = window.innerWidth*.95;

const constraints = {
	video:{
		width:{
			max:MAXWIDTH,
		},
	}
}

const getCamera = async()=>{	
	if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia){
		const stream = await navigator.mediaDevices.getUserMedia(constraints);
		video.srcObject = stream;
	}
	else{
		console.log("unsupported operation")
	}
}

const drawToCanvas = (video,canvas)=>{
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	let ctx = canvas.getContext('2d');
	ctx.translate(canvas.width,0);
	ctx.scale(-1,1);
	ctx.drawImage(video, 0, 0);
	drawBoundingBox(boundingBox,canvas);
}

let model;
const loadModel = async()=>{
	model = await blazeface.load();
}
loadModel();



const faceBoundingBox = async(model,canvas)=>{
	const return_tensors = false;
	
	const predictions = await model.estimateFaces(video, return_tensors);
	if (predictions.length>0){
		for(let i=0; i<predictions.length;i++){
			const start = predictions[i].topLeft;
			const end = predictions[i].bottomRight;
			const size = [end[0]-start[0], end[1]-start[1]];
			boundingBox = [start[0],start[1],size[0],size[1]]
		}
	}
}

const drawBoundingBox = (boundingBox, canvas)=>{
	let ctx = canvas.getContext('2d');
	ctx.lineWidth = '2';
	ctx.strokeStyle = 'tomato';
	ctx.rect(...boundingBox);
	ctx.stroke();
}


let boundingBox = [0,0,0,0];


let startButton = document.querySelector('button.start');
startButton.onclick = async()=>{
	canvas.classList.remove('d-none');
	getCamera();
	setInterval(()=>{
		drawToCanvas(video,canvas);
	},100);
	setInterval(()=>{
		faceBoundingBox(model, canvas);
	}, 500);
}

let stopButton = document.querySelector('button.stop')
stopButton.onclick = ()=>{
	video.pause();
	canvas.classList.add("d-none");
}