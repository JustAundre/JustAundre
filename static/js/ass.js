for (const project of document.querySelectorAll('.project-card')) {
	project.addEventListener('mouseenter', () => {
		root.setAttribute('style', project.getAttribute('style'))
	})
	project.addEventListener('mouseleave', () => {
		root.setAttribute('style', '')
	})
}