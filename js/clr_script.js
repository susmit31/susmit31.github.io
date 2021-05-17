const clr_fam = {
	grays: [
		'mediumturquoise','turquoise','cadetblue',
	],
	whites: [
		'wheat', 'seashell', 'lavenderblush',		
	],
	yellows: [
		'yellow','greenyellow', 'gold',
	],
	greens:[
		'lawngreen','lime',
		'limegreen', 'mediumseagreen', 'yellowgreen',
		'springgreen', 'palegreen'
	],
	blues: [
		'purple', 'dodgerblue', 'blueviolet', 
		'slateblue', 'aqua',
		'magenta', 'mediumblue', 
	],
	reds: [
		'tomato', 'peru', 'orangered',
		'lightcoral', 'lightsalmon', 'orange',
		'orchid'
	]
};

const IS_TOUCH_DEVICE = 'ontouchstart' in window;

const decimal_to_hex = num=>{
	if (num<16){
		if (num==10) return 'A';
		else if (num>10){
			return String.fromCharCode('A'.charCodeAt() + num-10);
		}
		else return ''+num;
	}
	
	else{
		let remainder = num % 16;
		let ratio = Math.floor(num/16);
		return decimal_to_hex(ratio)+decimal_to_hex(remainder);
	}
}


const apply_hover_class = (ele, cls)=>{
	if (!IS_TOUCH_DEVICE){
		ele.addEventListener('mouseenter', e=>{
			e.target.classList.add(cls);
			e.target.addEventListener('mouseleave', e=>{
				e.target.classList.remove(cls);
			});
		});
	}
}

const apply_mobile_class = (ele, cls)=>{
	if(IS_TOUCH_DEVICE){
		ele.addEventListener('click', e=>{
			let prevSel = document.querySelector('.mob-click');
			if (prevSel) {
				prevSel.classList.remove('mob-click');
				prevSel.classList.remove('block-hover');
			}
			e.target.classList.add('block-hover');
			e.target.classList.add('mob-click');
		});
	}
};

const rgb_to_hex = (r,g,b) => {
	let hexes = [r,g,b].map(c=>c.toString(16).toUpperCase()).map(c=> c.length<2?'0'+c:c);
	let [r_,g_,b_] = hexes;
	return `#${r_}${g_}${b_}`;
}


const add_hover_text = (newBlock)=>{
	let bgclr = window.getComputedStyle(newBlock).backgroundColor;
	let rgb = bgclr.slice(4,)
				.split(',')
				.map(a=>a.replace(')',''))
				.map(a=>parseInt(a));
				
	let hexclr = rgb_to_hex(...rgb);
	
	let textContainer = document.createElement('div');
	textContainer.classList.add('text-container');
	
	let text1 = document.createElement('div');
	text1.innerHTML = `<p>Copy ${hexclr}</p>`;
	text1.classList.add('text-box');
	text1.classList.add('copy');
	text1.addEventListener('click', e=>{
		navigator.clipboard.writeText(hexclr);
		alert(`copied ${hexclr}!`);
	});
	
	let text2 = document.createElement('div');
	text2.innerHTML = `<p>Make palette</p>`;
	text2.classList.add('text-box');
	text2.classList.add('palette');
	text2.addEventListener('click', e=>{
		const palette = make_palette(...rgb);
		display_palette(palette);
	});
	
	textContainer.appendChild(text1);
	textContainer.appendChild(text2);
	newBlock.appendChild(textContainer);		
}


const rgb_to_hsl = (r,g,b)=>{
	r/=255; g/=255; b/=255;
	
	let cmin = Math.min(r,g,b),
		cmax = Math.max(r,g,b),
		delta = cmax - cmin,
		h=0, s=0, l=0;
		
	if (delta==0) 
		h=0;
	else if (cmax==r)
		h = ((g-b)/delta)%6;
	else if (cmax==g)
		h = ((b-r)/delta) + 2;
	else
		h = ((r-g)/delta) + 4;
	
	h = Math.round(h*60);
	
	if (h < 0)
		h += 360;
	
	l = (cmax + cmin) / 2;
	
	s = delta==0? 0 : delta / (1 - Math.abs(2*l - 1));
	
	s = +(s * 100);
	l = +(l * 100);
	
	return [h,s,l]
}

const hsl_to_rgb = (h,s,l)=>{
	h /= 360; s /= 100; l/=100;
	let r,g,b;
	
	if (s==0) r = g = b = l;
	else{
		const hue2rgb = (p,q,t)=>{
			if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
		}
		
		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
	}
	
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


const make_palette = (r,g,b)=>{
	let hsl = rgb_to_hsl(r,g,b);
	let palette = [];
	let delta_l = hsl[2]/5;
	let delta_s = hsl[1]/3;
	
	for (let i=0; i<3; i++){
		let clr = [...hsl];
		clr[2] += delta_l*i*Math.pow(-1,i);
		clr[1] += delta_s*i*Math.pow(-1,i);
		palette.push(clr);
	}
	
	return palette;
}

const display_palette = palette => {
	let modal = document.createElement('div');
	modal.classList.add('modal');
	
	let container = document.createElement('div');
	container.classList.add('container');
	
	let cross = document.createElement('div');
	cross.innerHTML = 'x';
	cross.classList.add('cross');
	
	cross.addEventListener('click', e=>{
		document.querySelector('body').removeChild(modal);
	})
	
	container.appendChild(cross);
	
	modal.appendChild(container);
	document.querySelector('body').appendChild(modal);
	
	palette.forEach(clr=>{
		let [h,s,l] = clr;
		let [r,g,b] = hsl_to_rgb(h,s,l);
		let block = document.createElement('div');
		block.style.backgroundColor = `rgb(${r},${g},${b})`;
		container.appendChild(block);
		
		
		add_hover_text(block);
		
		apply_hover_class(block,'block-hover');
		apply_mobile_class(block);
	});
	
}

const display_from_input = ()=>{
	let input = document.querySelector('input').value;
	let newBlock = document.createElement('div');
	newBlock.style.backgroundColor = input;
	newBlock.classList.add('from-input');
	const input_container = document.querySelector('div.container');
	let prevBlock = input_container.children[input_container.children.length-1];
	if (prevBlock.nodeName!=='BR') {
		input_container.removeChild(prevBlock);
	}
	input_container.appendChild(newBlock);
	
	add_hover_text(newBlock);
	apply_hover_class(newBlock,'block-hover');
	apply_mobile_class(newBlock);
}



let target = document.querySelector('.target');
let count = 0;
for (family in clr_fam){
	let container = document.createElement('div');
	container.classList.add('container');
	let heading = document.createElement('h1');
	heading.textContent = family;
	container.appendChild(heading);
	target.appendChild(container);
	
	clr_fam[family].forEach(clr=>{
		let block = document.createElement('div');
		block.style.backgroundColor = clr;
		block.classList.add(family);
		container.appendChild(block);
		
		add_hover_text(block);
		
		apply_hover_class(block,'block-hover');
		apply_mobile_class(block);
	});
	
}