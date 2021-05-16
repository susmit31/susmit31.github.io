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

const is_touch_device = ()=>'ontouchstart' in window;


const apply_class_on_hover = (ele, cls)=>{
	if (!is_touch_device()){
		ele.addEventListener('mouseenter', e=>{
			e.target.classList.add(cls);
			console.log(`${e.target.nodeName} hi`);
			e.target.addEventListener('mouseleave', e=>{
				e.target.classList.remove(cls);
				console.log(`${e.target.nodeName} bye`);
			});
		});
	}
}

const apply_mobile_class = (ele, cls)=>{
	if(is_touch_device()){
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


const addHoverText = (newBlock)=>{
	let hexclr = window.getComputedStyle(newBlock).backgroundColor;
	hexclr = hexclr.slice(4,)
				.split(',')
				.map(a=>a.replace(')',''))
				.map(a=>parseInt(a));
	hexclr = rgb_to_hex(...hexclr);
	
	let textContainer = document.createElement('div');
	textContainer.classList.add('text');
	
	let text1 = document.createElement('div');
	text1.innerHTML = `<p>Copy ${hexclr}</p>`;
	text1.classList.add('text-top');
	
	let text2 = document.createElement('div');
	text2.innerHTML = `<p>Make palette</p>`;
	text2.classList.add('text-bottom');
	
	textContainer.appendChild(text1);
	textContainer.appendChild(text2);
	newBlock.appendChild(textContainer);
	//apply_class_on_hover(textContainer, 'text-hover');
	text1.addEventListener('click', e=>{
		navigator.clipboard.writeText(hexclr);
		alert(`copied ${hexclr}!`);
	});
		
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
		
		addHoverText(block);
		
		apply_class_on_hover(block,'block-hover');
		apply_mobile_class(block);
	});
	
}

const displayFromInput = ()=>{
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
	
	addHoverText(newBlock);
	apply_class_on_hover(newBlock,'block-hover');
	apply_mobile_class(newBlock);
}

//console.log(is_touch_device());