for (const button of document.querySelectorAll('button')) {
	button.addEventListener('click', () => {
		button.classList.add('active');
	});
	button.addEventListener('animationend', () => {
		button.classList.remove('active');
	});
}

for (const project of document.querySelectorAll('.project-card')) {
	project.addEventListener('mouseenter', () => {
		root.setAttribute('style', project.getAttribute('style'))
	})
	project.addEventListener('mouseleave', () => {
		root.setAttribute('style', '')
	})
}