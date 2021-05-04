let paths = document.querySelectorAll('#svg path');

// SVG strokes animation
let anim_strokes = (paths, duration, delay)=>{
	let i = 0;
	paths.forEach(path => {
		let len = path.getTotalLength();
		
		if (window.innerWidth < 768) path.style.strokeWidth = 3;
		else path.style.strokeWidth = 2;
		
		path.style.strokeDasharray = `${len}px`;
		path.style.strokeDashoffset = `${len}px`;
		path.style.animation = `renderText ${duration}s ease forwards ${delay*i}s`;
		i++;
	});
}

// SVG Fade In animation 
let anim_fade_in = (paths, duration, delay)=>{
	let i = 0;
	paths.forEach(path => {
		path.style.opacity = 0;
		path.style.stroke='#ffffff';
		path.style.animation = `fadeInText ${duration}s ease forwards ${delay*i}s`
		i++;
	});
}

anim_fade_in(paths, .6, .1);

// Navbar Fade In
let anim_nav_fade_in = (nav, duration, delay) => {
	nav.style.opacity = 0;
	nav.style.animation =  `fadeInText ${duration}s ease-in-out forwards ${delay}s`;
}
let nav = document.querySelector('nav');
//anim_nav_fade_in(nav, 1, 7.7);


// SVG fill animation
let anim_fill_shape = (svg, duration, delay)=>{
	svg.style.animation = `fillShape ${duration}s ease forwards ${delay}s`;
}
let svg = document.querySelector('#svg');
anim_fill_shape(svg, 1, 1.8);



//Typing animation
let anim_type = (target, typeStartDelay, scrollStartDelay, keyStrokeIntervalMS)=>{
	target.style.fontWeight="bold";

	let text = "";
	let textBig = "Med Schooler | Programmer | Aspiring Computational Biologist";
	let textMid = "Med Schooler | Programmer | \nAspiring Computational Biologist";
	let textSmol = "Med Schooler | Programmer | \nAspiring Computational \nBiologist";

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
		intvl = setInterval(writeLetter,keyStrokeIntervalMS);
	}

	let scrollBelow = ()=>{
		if (window.scrollY<window.innerHeight-20){
			window.scrollTo(0,window.innerHeight-20);
		}
	}


	// Render typing animation
	setTimeout(renderAnim,typeStartDelay*1000);
	setTimeout(scrollBelow,scrollStartDelay*1000);
}

let typingDiv = document.querySelector('#typing');
anim_type(typingDiv, typeStartDelay=3.5, scrollStartDelay=7.7 , keyStrokeIntervalMS=50);



// Scroll Spy 
let scrollSpy = ()=>{
	let anchors = document.querySelectorAll('a.nav-link');
	
	// Determine distance of each section from the centre of screen height
	let two_thirds_ht = window.innerHeight*2/3;
	let y_of_top = window.scrollY;
	
	let intro = document.querySelector('#intro');
	let about = document.querySelector('#about');
	let contact = document.querySelector('#contact');
	let sections = [intro, about, contact]
	
	let offsets = sections.map(x=>x.offsetTop);
	
	anchors.forEach(x=>{
		x.classList.remove('active');
	});
	if (y_of_top + two_thirds_ht >= offsets[1] && y_of_top + two_thirds_ht < offsets[2]){
		anchors[1].classList.add('active');	
	}
	else if(y_of_top +two_thirds_ht >= offsets[2]){
		anchors[2].classList.add('active');
	}
	else{
		anchors[0].classList.add('active');
	}
	
}

let slideInSec = ()=>{
	let from_rt = document.querySelectorAll('.from-right');
	let from_lt = document.querySelectorAll('.from-left');
	let secs = [...from_lt, ...from_rt];
	console.log(secs);
	
	const options = {
		threshold: 0,
		rootMargin: `-${window.innerHeight-200}px 0px -200px 0px`
	}
	const callback  = (entries, observer)=>{
		entries.forEach(entry=>{
			if(entry.isIntersecting){
				entry.target.classList.add('appear');
			}
			else{
				entry.target.classList.remove('appear');
			}
		});
	};
	let observer = new IntersectionObserver(callback, options);
	
	secs.forEach(sec=>{
		observer.observe(sec);
	});
}

setInterval(scrollSpy,300);
slideInSec();

// Set rel of all anchors to "noreferrer"

let anchors = document.querySelectorAll('a');
anchors.forEach(x=>x.rel="noreferrer");