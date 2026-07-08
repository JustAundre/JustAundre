const root = document.documentElement;
let toggleTheme, toggleMotion, toggleDyslexic;
configMenu = document.createElement('dialog');
configMenu.setAttribute('id', 'config-menu');
configMenu.setAttribute('data-theme', 'dark');
configMenu.innerHTML = `
<form method="dialog">
	<h1>Which do you prefer?</h1>
	<label class="option" aria-label="Enable light mode">
		<i class="icon-sun-moon"></i>
		<span>Enable light mode</span>
		<div class="switch">
			<input type="checkbox" id="toggle-theme">
			<div class="slider">
			<i class="icon-check state-text"></i>
			<i class="icon-x state-text"></i>
			</div>
		</div>
	</label>
	<label class="option" aria-label="Enable motion" aria-describedby="motion-performance-warning">
		<i class="icon-move"></i>
		<span>Enable motion</span>
		<div class="switch">
			<input type="checkbox" id="toggle-motion">
			<div class="slider">
			<i class="icon-check state-text"></i>
			<i class="icon-x state-text"></i>
			</div>
		</div>
	</label>
	<span class="subtext" id="motion-performance-warning">* May impact old devices.</span>
	<label class="option" aria-label="Use a dyslexic-friendly font">
		<i class="icon-type-outline"></i>
		<span data-dyslexic="true">Enable dyslexic font</span>
		<div class="switch">
			<input type="checkbox" id="toggle-dyslexic">
			<div class="slider">
			<i class="icon-check state-text"></i>
			<i class="icon-x state-text"></i>
			</div>
		</div>
	</label>
	<button type="submit" id="enter-site" onclick="commitConfig()">Continue</button>
</form>
`;

function openConfig() {
	if (!configMenu.isConnected) {
		document.body.prepend(configMenu);
	}
	configMenu.showModal();
	configMenu.setAttribute('open', '');
}

function commitConfig() {
	const theme = toggleTheme.checked ? 'light' : 'dark';
	const motion = toggleMotion.checked ? 'true' : 'false';
	const dyslexic = toggleDyslexic.checked ? 'true' : 'false';
	
	root.setAttribute('data-theme', theme);
	root.setAttribute('data-motion', motion);
	document.body.setAttribute('data-dyslexic', dyslexic);
	
	const config = { theme, motion, dyslexic };
	localStorage.setItem('userConfig', JSON.stringify(config));
}

document.addEventListener('DOMContentLoaded', () => {
	document.body.prepend(configMenu);
	toggleTheme = document.querySelector('#toggle-theme');
	toggleMotion = document.querySelector('#toggle-motion');
	toggleDyslexic = document.querySelector('#toggle-dyslexic');
	const savedConfig = JSON.parse(localStorage.getItem('userConfig'));
	if (savedConfig) {
		root.setAttribute('data-theme', savedConfig.theme);
		root.setAttribute('data-motion', savedConfig.motion);
		document.body.setAttribute('data-dyslexic', savedConfig.dyslexic);

		toggleTheme.checked = (savedConfig.theme === 'light');
		toggleMotion.checked = (savedConfig.motion === 'true');
		toggleDyslexic.checked = (savedConfig.dyslexic === 'true');
	} else {
		if (window.matchMedia("(prefers-color-scheme: light)").matches) {
			toggleTheme.checked = true;
			root.setAttribute('data-theme', 'light');
		} else {
			root.setAttribute('data-theme', 'dark');
		}
		if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			toggleMotion.checked = true;
			root.setAttribute('data-motion', 'true');
		} else {
			root.setAttribute('data-motion', 'false');
		}
		document.body.setAttribute('data-dyslexic', 'false');
		openConfig();
	}
});