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
	const devices = await navigator.mediaDevices.enumerateDevices();
	const videoDevices = devices.filter(device=>device.kind=='videoinput');
	
	if (streamStarted){
		video.play();
		return
	}
	
	if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia){
		startStream();
	}
}

const startStream = async()=>{
	const stream = await navigator.mediaDevices.getUserMedia(constraints);
	video.srcObject = stream;
	streamStarted = true;
}

getCamera();

let button = document.querySelector('button')

button.onclick = ()=>{
	video.pause();
	video.classList.add('d-none');
	button.innerText = 'Start';
	
}