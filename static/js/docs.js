marked.setOptions({
	gfm: true,
	breaks: true
});
marked.use(window.markedGfmHeadingId.gfmHeadingId());
marked.use(window.markedAlert.default ? window.markedAlert.default() : window.markedAlert());

(async function() {
	try {
		const query = new URLSearchParams(window.location.search).get('q');
		const url = `${window.location.origin}/docs/${query}.md`;
		const response = await fetch(url);
		const md = await response.text();
		document.querySelector('#blog-content').innerHTML = marked.parse(md);
		if (window.Prism) {
			Prism.highlightAll();
		}
	} catch (error) {
		console.error(`${error}`);
	}
})();