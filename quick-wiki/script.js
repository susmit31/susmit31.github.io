async function text_decoder(text_url){
	const utf8decoder = new TextDecoder('utf-8');
	const resp = await fetch(text_url);

	// Response().body is a ReadableStream object
	// that contains the contents of the response
	const reader = resp.body.getReader();

	// The reader.read() method is an asynchronous generator
	// that yields contents from the fetched URL as they get received.
	// Subsequent calls will deliver chunks from the same URL.
	let {value: chunk, done: done_reading} = await reader.read();
	// Decoding the first chunk
	chunk = chunk? utf8decoder.decode(chunk) : '';

	return chunk;
}

const fetch_article = async (title) =>{
	let url = 'https://en.wikipedia.org/w/api.php?' + new URLSearchParams({
		origin: '*',
		action: 'parse',
		page: title,
		format: 'json',
	});

	try{
		const response = await fetch(url);
		const json = await response.json();
		const html = json.parse.text['*'];

		const parser = new DOMParser();
		const parsed = parser.parseFromString(html, "text/html");
		let txt = parsed.getElementsByTagName('body')[0].textContent;
		txt = txt.slice(0,txt.indexOf('References'));
		const tags = /<\/?(.)+?\>/ig;
		const css = /(\n)+((@|\.|body|html|\.mw)[^\{]+\{[^\}]+?\})/ig;

		// painful brute-force way to eliminate the CSS and HTML
		txt = txt.replaceAll('}', '}\n')
		txt = txt.replaceAll(tags,'');

		txt = txt.replaceAll(css,'');
		txt = txt.replaceAll(/\n+/g, '\n');
		txt = txt.replaceAll('}','');

		// Erasing all references
		txt = txt.replace(/\[[0-9]+\]/g, '');
		txt = txt.replaceAll(/([^\.])\n/ig, '$1.\n')
		
		// Fetching stopwords
		url = 'https://raw.githubusercontent.com/igorbrigadir/stopwords/master/en/spacy.txt';

		stops = await text_decoder(url);
		const stopwords = stops.split('\n');


		// Splitting txt
		let lines_words = txt.replaceAll(/'\w+/g,"").toLowerCase().replaceAll(/[\.,;\(\)\[\]\n:/\-\+=\*&]/g,' ').replaceAll("'",'').replaceAll('"','').replaceAll(/[0-9]+\w?/g,'').split(' ').filter(word => word!='');
		
		// Replacing the stopwords
		/*let txt_filtered = lines_words.map(words => {
			for (stop of stopwords)
				words = words.filter(word => word != stop)
			return words.join(' ')
		});*/
		for (stop of stopwords){
			lines_words = lines_words.filter(word => word!=stop);
		}
		//txt_filtered = txt_filtered.join(' ');


		let word_scores = {};
		for (word of lines_words){
			if (word_scores[word])
				word_scores[word]+=1;
			else word_scores[word] = 1;
		}

		let max_count = curr_count = 0;
		for (word of Object.keys(word_scores)){
			curr_count = word_scores[word]
			if (curr_count > max_count)
				max_count = curr_count; 
		}

		for (word of Object.keys(word_scores)){
			word_scores[word] /= max_count;
		}

		let lines_scores = {};
		let score = 0;
		for (line of txt.split('.')){
			for (word of line.split(' ')){
				word = word.toLowerCase();
				if (word_scores[word]) score += word_scores[word];
			}
			lines_scores[line] = score/line.split(' ').length;
			score = 0;
		}

		let exclusion_keywords = ['See also', 'Further info', 'Main article', 'disambiguation']
		let lines_sorted = Object.keys(lines_scores).sort((x,y) => lines_scores[y] - lines_scores[x])
		.filter(x => x.split(' ').length > 8)
		for (kw of exclusion_keywords){
			lines_sorted = lines_sorted.filter(line => !line.includes(kw));
		}

		lines_sorted = lines_sorted.slice(0,25);


		let out_body = document.querySelector('.out-body');
		let out_title = document.querySelector('.out-title');
		out_title.innerText = title;
		out_body.innerText = lines_sorted.join('\n');
		document.body.style.border = '2px solid black';
		document.querySelector('input').value = '';


} catch (err) {
		console.error(err);
	}
}

generate_summary = (e)=>{
	document.querySelector('.out-body').innerText = "Please wait, generating summary...";
	fetch_article(document.querySelector('input').value)
};
