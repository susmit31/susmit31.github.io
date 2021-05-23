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
	ctx.drawImage(video, 0, 0);
}

const runModel = async(canvas)=>{
	const model = await blazeface.load();
	const return_tensors = false;
	
	const predictions = await model.estimateFaces(video, return_tensors);
	if (predictions.length>0){
		for(let i=0; i<predictions.length;i++){
			const start = predictions[i].topLeft;
			const end = predictions[i].bottomRight;
			const size = [end[0]-start[0], end[1]-start[1]];
			
			let ctx = canvas.getContext('2d');
			ctx.fillStyle = 'rgba(255,0,0,.1)';
			ctx.fillRect(start[0], start[1], size[0], size[1]);
		}
	}
}

let startButton = document.querySelector('button.start');
startButton.onclick = ()=>{
	getCamera();
	setInterval(()=>{
		drawToCanvas(video,canvas);
		runModel(canvas);
	},300);
}

let stopButton = document.querySelector('button.stop')
stopButton.onclick = ()=>{
	video.pause();
}