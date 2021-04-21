let paths = document.querySelectorAll('#svg path');

// SVG strokes animation
let anim_strokes = (paths)=>{
	let i = 0;
	paths.forEach(path => {
		let len = path.getTotalLength();
		
		if (window.innerWidth < 768) path.style.strokeWidth = 3;
		else path.style.strokeWidth = 2;
		
		path.style.strokeDasharray = `${len}px`;
		path.style.strokeDashoffset = `${len}px`;
		path.style.animation = `renderText 3s ease forwards ${.1*i}s`;
		i++;
	});
}

// SVG Fade In animation 
let anim_fade_in = (paths)=>{
	let i = 0;
	paths.forEach(path => {
		path.style.opacity = 0;
		path.style.animation = `fadeInText 1s ease forwards ${.2*i}s`
		i++;
	});
}

anim_fade_in(paths);


// SVG fill animation
let anim_fill_shape = (svg)=>{
	svg.style.animation = "fillShape 1s ease forwards 3s";
}

anim_fill_shape(document.querySelector('#svg'));



//Typing animation
let anim_type = (target)=>{
	target.style.fontWeight="bold";

	let text = "";
	let textBig = "Med Schooler | Programmer | Aspiring Computational Biologist";
	let textMid = "Med Schooler | Programmer | \nAspiring Computational Biologist";
	let textSmol = "Med Schooler | Programmer | \nAspiring Computational \nBiologist"

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
		if (window.scrollY<window.innerHeight-20){
			window.scrollTo(0,window.innerHeight-20);
		}
	}


	// Render typing animation
	setTimeout(renderAnim,4000);
	setTimeout(scrollBelow,10000);
}

anim_type(document.querySelector('#typing'));



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
	
	anchors.forEach(x=>x.classList.remove('active'));
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

setInterval(scrollSpy,300);


// Set rel of all anchors to "noreferrer"

let anchors = document.querySelectorAll('a');
anchors.forEach(x=>x.rel="noreferrer");