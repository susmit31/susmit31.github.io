const video = document.querySelector('video');
let streamStarted = false;

const constraints = {
	video:{
		width:{
			max:2560
		},
		height:{
			max:1440
		}
	}
}

const getCamera = async()=>{
	if (streamStarted){
		video.play();
		return
	}
	
	if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia){
		const stream = await navigator.mediaDevices.getUserMedia(constraints);
		video.srcObject = stream;
		streamStarted = true;
	}
}

let startButton = document.querySelector('button.start');
startButton.onclick = ()=>{
	getCamera();
	video.classList.remove('d-none');
}

let stopButton = document.querySelector('button.stop')

stopButton.onclick = ()=>{
	video.pause();
	video.classList.add('d-none');	
}