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
		'orchid',
	]
};

let target = document.querySelector('.target');

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


const rgb_to_hex = (r,g,b) => {
	let hexes = [r,g,b].map(c=>c.toString(16).toUpperCase()).map(c=> c.length<2?'0'+c:c);
	let [r_,g_,b_] = hexes;
	return `#${r_}${g_}${b_}`;
}

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
		
		let textContainer = document.createElement('div');
		let text = document.createElement('p');
		
		let hexclr = window.getComputedStyle(block).backgroundColor;
		hexclr = hexclr.slice(3,).split(',');
		hexclr = hexclr.map(a=>a.replace('(','').replace(')',''));
		hexclr = hexclr.map(a=>parseInt(a));
		hexclr = rgb_to_hex(...hexclr);
		
		text.textContent = `${hexclr}\n(click to copy)`;
		text.style.display='inline';
		text.style.overflowWrap = 'break-word';
		text.classList.add('text');
		
		textContainer.appendChild(text)
		block.appendChild(textContainer);
		block.addEventListener('click', e=>{
			console.log(hexclr);
			
			navigator.clipboard.writeText(hexclr);
			alert('copied!');
		});
		
	});
	
}