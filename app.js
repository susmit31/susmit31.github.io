let paths = document.querySelectorAll('#svg path');
let i = 0;
paths.forEach(path => {
	let len = path.getTotalLength();
	path.style.strokeDasharray = `${len}px`;
	path.style.strokeDashoffset = `${len}px`;
	path.style.animation = `renderText 3s ease forwards ${.1*i}s`;
	i++;
});

//Typing animation
let target = document.getElementById('typing');
target.style.fontWeight="bold";

let text = "";
let textBig = "AKA Sarif Mohammad Tasnim Islam. AKA Jack-ass of many trades, Kick-ass of none.";
let textMid = "AKA Sarif Mohammad Tasnim Islam.\nAKA Jack-ass of many trades, Kick-ass\nof none.";
let textSmol = "AKA Sarif Mohammad Tasnim \nIslam. AKA Jack-ass of many trades,\nKick-ass of none."

let wd = window.innerWidth;
if(wd<800 && wd>600) text = textMid;
else if(wd<=600) {
	let header = document.getElementById('svg');
	header.style.width = '125%';
	text=textSmol;
}
else text = textBig;

let state = 0;
let ch = null;

let writeLetter = ()=>{
	if (state>=text.length) clearInterval(intvl);
	else{
		if(text[state]==' ') ch = '&nbsp';
		else if(text[state]=='\n') ch = '<br/>';
		else ch = text[state];
		target.innerHTML += ch;
		state++
	}
}

let intvl= 'null';
let renderAnim = ()=>{
	intvl = setInterval(writeLetter,80);
}

let scrollBelow = ()=>{
	window.scrollTo(0,window.innerHeight-20);
}

setTimeout(renderAnim,5500);
setTimeout(scrollBelow,13500);