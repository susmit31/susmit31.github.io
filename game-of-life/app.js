//---------------------------------
// constants and functions
//---------------------------------

const ACTIVE_CLR = 'rgb(255, 255, 255)';
const INACTIVE_CLR = '#5F9EA0';
const NUM_TARGETS = 10;

let explore = false;
let simuln = null;

let game = document.querySelector('#game');
let home = document.querySelector('#home');
let simBtn = document.querySelector('.sim');
let resetBtn = document.querySelector('.reset');
let stopBtn = document.querySelector('.stop');
let gameBtn = document.querySelector('.gamestart');
let exploreBtn = document.querySelector('.explore');
let helpBtn = document.querySelector('.help');

const GAME_WD = parseInt(window.getComputedStyle(game).width);

const N_COL =  GAME_WD > 700? 40: GAME_WD > 500? 30: 18;
const BOX_SIZE = parseInt(
		window.getComputedStyle(game).width
	)/ N_COL;
const N_ROW = Math.floor(window.innerHeight *.87/BOX_SIZE);

const isAlive = sqr=>
	window.getComputedStyle(sqr).backgroundColor == ACTIVE_CLR? 
	true : false;

const toggleLife = sqr=>{
	if (isAlive(sqr)) sqr.style.backgroundColor = INACTIVE_CLR;
	else sqr.style.backgroundColor = ACTIVE_CLR;
}

const randint = (upper)=> Math.floor(Math.random()*(upper));

const drawOnDrag = e=>{
	if (e.target.style.backgroundColor!==ACTIVE_CLR)
		e.target.style.backgroundColor = ACTIVE_CLR;
};

const mobileDrawOnDrag = e=>{
	let touch = (typeof(e.originalEvent)=='undefined')? e.changedTouches[0] : e.originalEvent.changedTouches[0];
	let x = touch.clientX, y = touch.clientY;
	let elem = document.elementFromPoint(x,y);
	if (!isAlive(elem)) toggleLife(elem);
};

const findNeighbours = sqr => {
	let neighbours = [];
	let idx = Array.from(sqrs).findIndex(s=>s==sqr);
	let pos_x = Math.floor(idx/N_COL), pos_y = idx%N_COL;
	
	const start_x = pos_x > 0? -1 : 0;
	const end_x = pos_x < N_ROW-1? 1 : 0;
	const start_y = pos_y > 0? -1 : 0;
	const end_y = pos_y < N_COL-1? 1 : 0;
	for (let i = start_x; i<=end_x; i++){
		for (let j=start_y; j<=end_y; j++){
			if (i!==0 || j!==0){
				let neigh = sqrs[idx + N_COL*i + j]
				if (neigh)
					neighbours.push(neigh);
			}
		}
	}
	
	return neighbours
}

const range = n=> n==1? [0] : [...range(n-1),n-1];

const generateTargets = (sqrs_grid, num_targets, targets_subgrid_dim)=>{
	let num_rows = sqrs_grid.length;
	let num_cols = sqrs_grid[0].length;	
	let box_width = Math.floor(num_cols / targets_subgrid_dim[1]);
	let box_height = Math.floor(num_rows / targets_subgrid_dim[0]);
	let box_width_last = box_width + num_cols - targets_subgrid_dim[1]*box_width;
	let box_height_last = box_height + num_rows - targets_subgrid_dim[0]*box_height;
	let box_width_curr, box_height_curr;

	let xs = [], ys = [];
	for (let i=0; i<targets_subgrid_dim[0]; i++){
		for (let j=0; j<targets_subgrid_dim[1]; j++){
			if (i==targets_subgrid_dim[0]-1) box_height_curr = box_height_last;
			else box_height_curr = box_height;
			if (j==targets_subgrid_dim[1]-1) box_width_curr = box_width_last;
			else box_width_curr = box_width;
			
			let x = randint(box_height_curr-1), y=randint(box_width_curr-1);
			xs.push(i*box_height + x);
			ys.push(j*box_width + y);
		}
	}
	
	let targets = range(xs.length).map(i=>sqrs_grid[xs[i]][ys[i]]);
	return targets;
};

const generateTargetsDefaults = ()=>generateTargets(sqrs_grid,NUM_TARGETS,[Math.floor(NUM_TARGETS/2),2]);

const markTargets = targets=>{
	targets.forEach(t=>{
		t.innerHTML = 'X';
		t.classList.add('target');
		toggleLife(t);
	});
};

const countLiveTargets = targets => {
	let count = 0;
	targets.forEach(t=>{
		isAlive(t)? count++ : null;
	});
	return count;
};

//----------------------------
// main
//----------------------------

Array(N_ROW*N_COL).fill(0).forEach(i=>{
	game.appendChild(document.createElement('div'));
});

let sqrs = game.children;
let sqrs_grid = (()=>{
	let grid = [];
	for (let i = 0; i<N_ROW; i++){
		let row = [];
		for (let j =0; j<N_COL; j++){
			row.push(sqrs[N_COL*i + j]);
		}
		grid.push(row);
	}
	return grid;
})();

Array.from(sqrs).forEach(c=>{
	c.style.width = `${BOX_SIZE}px`;
	c.style.height = `${BOX_SIZE}px`;
});

let targets = generateTargetsDefaults();
markTargets(targets);

game.onmousedown = (e)=>{
	toggleLife(e.target);
	Array.from(sqrs).forEach(c=>{
		c.addEventListener('mouseenter',drawOnDrag);
	});
};

game.ontouchstart = (e)=>{
	e.target.addEventListener('touchmove',mobileDrawOnDrag);
};

game.onmouseup = ()=>{
	Array.from(sqrs).forEach(c=>{
		c.removeEventListener('mouseenter',drawOnDrag);
	})
};

game.ontouchend = (e)=>{
	e.target.removeEventListener('touchmove',mobileDrawOnDrag);
};

stopBtn.addEventListener('click', e=>{
	clearInterval(simuln);
	simuln = null;
	simBtn.disabled = false;
	e.target.disabled = true;
});

resetBtn.addEventListener('click', e=>{
	Array.from(sqrs).forEach(s=>{
		s.style.backgroundColor = INACTIVE_CLR;
		s.classList.remove('target');
		s.innerHTML = '';
	})
	stopBtn.click();
	stopBtn.disabled = true;
	if (!explore){
		let targets = generateTargetsDefaults();
		markTargets(targets);
	}
});

const updateFrame = ()=>{
	let newSqrs = Array.from(sqrs).map(a=>isAlive(a)? 1: 0);
	for(let i=0; i<newSqrs.length; i++){
		let sqr = Array.from(sqrs)[i];
		let neighs = findNeighbours(sqr);
		const live_neighs = neighs.map(n=>isAlive(n)).reduce((a,b)=>a+b);
		if (isAlive(sqr)){
			if (live_neighs==2 || live_neighs==3) null;
			else newSqrs[i] = 0;
		}
		else{
			if (live_neighs==3) newSqrs[i]=1;
			else null;
		}
	}
	let oldSqrs = Array.from(sqrs);
	for (let i=0; i<oldSqrs.length; i++){
		if (newSqrs[i]==1 && !isAlive(oldSqrs[i])) toggleLife(oldSqrs[i]);
		else if (newSqrs[i]==0 && isAlive(oldSqrs[i])) toggleLife(oldSqrs[i]);
		else null;
	}
}

exploreBtn.addEventListener('click',e=>{
	explore = true;
	gameBtn.click();
	document.querySelectorAll('.target').forEach(target=>{
		toggleLife(target);
		target.innerHTML = '';
	});
});

simBtn.addEventListener('click', e=>{
	if (simuln===null){
		simuln = setInterval(()=>{
			updateFrame();
			if (!explore){
				let targets =document.querySelectorAll('.target');
				let live_targets = countLiveTargets(targets);
				if (live_targets == 0){
					setTimeout(()=>{
						alert('Game Over');
						resetBtn.click();
					}, 400);
				}
			}
		},500);
		e.target.disabled = true;
		stopBtn.disabled = false;
	}
});

gameBtn.addEventListener('click',e=>{
	document.querySelectorAll('.container')[1].style.opacity = 1;
	home.style.display = 'none';
});

helpBtn.addEventListener('click',e=>{
	let help = document.createElement('div');
	let listContainer = document.createElement('div');
	let crossBtn = document.createElement('div');
	let list = document.createElement('ul');
	
	let rules = ['The white cells are called "alive", the gray ones are called "dead". The cells which will be alive at any generation of the simulation are determined by the following rules.',
	'If a cell was alive in the previous generation, and has fewer than 2 or more than 3 live neighbours, then it dies in the next generation, due to underpopulation and overpopulation, respectively.',
	'If a cell was dead in the previous generation, and has exactly three live neighbours, then it will become alive in the next generation, as if due to reproduction.',
	'Once you draw an initial configuration of live cells, the above rules are used to simulate the next generations.',
	'The cells marked with x are your targets - you have to save them at all costs. Your job is to draw such a pattern of live cells that maximises their survival time.']
	
	rules = rules.map(rule=>`<li>${rule}</li><br/>`);
	list.innerHTML = rules.join('');
	
	crossBtn.innerHTML = 'x';
	crossBtn.classList.add('cross-btn');
	crossBtn.addEventListener('click',e=>{
		let helpModal = document.querySelector('.help-modal');
		helpModal.parentElement.removeChild(helpModal);
	});
	
	listContainer.appendChild(list);
	help.appendChild(listContainer);
	help.appendChild(crossBtn);
	help.classList.add('help-modal');
	home.appendChild(help);
});