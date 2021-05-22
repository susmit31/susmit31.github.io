const video = document.querySelector('video');
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