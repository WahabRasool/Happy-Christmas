function secondsUntilHoliday(month = 12, day = 25) {
	// Get the current date and time
	const now = new Date();
	// Get the current year
	const currentYear = now.getFullYear();
	// Set the date for Holiday this year
	const holidayDate = new Date(currentYear, month - 1, day, 0, 0, 0, 0);
	// If holiday has already passed this year, set it for next year
	// Calculate the difference in milliseconds between now and holidayDate
	const timeDiff = now.getTime() - holidayDate.getTime();
	// Convert the time difference to hours
	const hoursDifference = timeDiff / (1000 * 60 * 60); // milliseconds to hours
	// Check if more than 24 hours have passed
	if (hoursDifference >= 24) {
		holidayDate.setFullYear(holidayDate.getFullYear() + 1);
	}
	// Calculate the difference in seconds
	const timeDifference = Math.floor((holidayDate - now) / 1000);
	return timeDifference;
}

function initCountdown(elt, opt_properties) {
	if (!elt) {
		console.error("Must have element to populate the clock!");
		return;
	}
	/**
	 * Returns the number of seconds until a given target date.
	 * @param {string} dateString - The target date in string format (e.g., "12-25-2023" or "12/25/2023").
	 * @returns {number} The number of seconds until the target date.
	 */
	const secondsUntil = (dateString) => {
		// Split the dateString based on '-' or '/'
		const [monthStr, dayStr, yearStr] = dateString.split(/[-/]/);
		// Convert the string parts to integers
		const month = parseInt(monthStr, 10) - 1; // Month is zero-based in JavaScript
		const day = parseInt(dayStr, 10);
		const year = parseInt(yearStr, 10);
		// Create a Date object from the parsed components (and assume it's at midnight on said date)
		const targetDate = new Date(year, month, day, 0, 0, 0, 0);
		// Get the current date and time
		const now = new Date();
		// Calculate the difference in seconds
		const timeDifference = Math.floor((targetDate - now) / 1000);
		return timeDifference;
	};
	const getUUID = () => {
		let d = new Date().getTime();
		let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,
			function (c) {
				let r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
			}
		);
		return uuid;
	};
	const defaultProperties = {
		day: 0,
		hour: 0,
		min: 0,
		sec: 0,
		color: "#0ff",
		showMs: false,
		glow: true,
		font: "Roboto, sans-serif",
		fontWeight: 600,
		showAllNumbers: false, // show even the waiting numbers
		freezeTime: false, // set the original positions but don't animate
		onlyShowTime: false, // accepts 'hr', 'min', 'sec', or 'ms'
		holidayText: "Merry Christmas!"
	};

	// properties passed in from user onto the defaults
	const c = Object.assign(defaultProperties, opt_properties);

	// what are the total seconds we dealing with
	c.totalSeconds = Math.floor(c.day * 86400 + c.hour * 3600 + c.min * 60 + c.sec);
	if ((c.date && c.totalSeconds <= 0) || (c.date && c.totalSeconds == undefined)) {
		c.totalSeconds = secondsUntil(c.date);
	}
	if (c.totalSeconds <= 0) {
		// console.error("What are you some kind of wiseguy?");
		c.totalSeconds = 1;
	}
	c.day = Math.floor(c.totalSeconds / 86400);
	// set dotColor equal to color by default
	!c.dotColor ? (c.dotColor = defaultProperties.color) : false;
	// calculate the number of seconds passed for each column
	let td = {};
	let id = getUUID();
	let vxEnd = c.showMs ? 240 : 200;
	let vyEnd = c.showAllNumbers ? 300 : 30;
	let showGlow = c.glow ? `<use href="#fullClock${id}" filter="url(#glow${id})"/>` : "";
	let showGlowBlur = c.glow ? `<filter id="glow${id}" x="-200%" y="-200%" width="1000%" height="1000%">
		<feGaussianBlur in="SourceGraphic" stdDeviation="1.4">
			<animate id="std${id}" attributeName="stdDeviation" values="1.4; 4; 1.4" dur="0.3s" begin="placeholderAnimation${id}.end" repeatCount="indefinite" />
		</feGaussianBlur>
	</filter>` : "";
	let numsOffsets = `0 -270; 0 -240; 0 -210; 0 -180; 0 -150; 0 -120; 0 -90; 0 -60; 0 -30; 0 0`;
	let numsOffsets6 = `0 -150; 0 -120; 0 -90; 0 -60; 0 -30; 0 0`;
	let numsOffsets24 = `0 -150; 0 -120; 0 -90; 0 -60; 0 -30; 0 0`;
	let msDots = c.showMs ? `M 197.5 10 v0 m0 10 v0` : "";
	let milliseconds = c.showMs
		? `<g class="ms10${id}">
		<use href="#nums${id}" transform="translate(200)" />
		<animateTransform id="ms10${id}" attributeName="transform" type="translate" values="${numsOffsets}" dur="1s" begin="0s" repeatCount="${Math.floor(c.totalSeconds)}" calcMode="discrete" />
	</g>
	<g class="ms${id}">
		<use href="#nums${id}" transform="translate(220)" />
		<animateTransform id="ms${id}" attributeName="transform" type="translate" values="${numsOffsets}" dur=".1s" begin="0s" repeatCount="${Math.floor(c.totalSeconds * 10)}" calcMode="discrete" />
	</g>`
		: "";

	c.sec1Passed = Math.floor(c.totalSeconds % 10);
	c.sec10Passed = Math.floor(c.totalSeconds % 60); // Corrected calculation for 10-second column
	c.min1Passed = Math.floor((c.totalSeconds / 60) % 10); // Corrected calculation for 1-minute column
	c.min10Passed = Math.floor((((c.totalSeconds / 60) % 60) % 100) / 10); // Corrected calculation for 10-minute column
	c.hr1Passed = Math.floor((c.totalSeconds / 3600) % 10); // Calculating for 1-hour column
	c.hr10Passed = Math.floor(((c.totalSeconds / 3600) % 24) / 10); // Calculating for 10-hour column
	c.day1Passed = Math.floor((c.totalSeconds / 86400) % 10); // Calculating for 1-day column
	c.day10Passed = Math.floor((((c.totalSeconds / 86400) % 100) % 100) / 10); // Calculating for 1-day column
	c.day100Passed = Math.floor((((c.totalSeconds / 86400) % 1000) % 1000) / 100); // Calculating for 1-day column

	let animateDay100 = c.totalSeconds >= 8640000 ? `<animateTransform id="day100${id}" attributeName="transform" type="translate" values="${numsOffsets}" dur="86400000s" begin="-${86400000 - (c.day100Passed * 8640000 + c.day10Passed * 864000 + (c.totalSeconds % 86400) + c.day1Passed * 86400)}s" repeatCount="${Math.ceil(c.totalSeconds / 86400000)}" calcMode="discrete" />` : "";
	let animateDay10 = c.totalSeconds >= 864000 ? `<animateTransform id="day10${id}" attributeName="transform" type="translate" values="${numsOffsets}" dur="8640000s" begin="-${8640000 - (c.day10Passed * 864000 + (c.totalSeconds % 86400) + c.day1Passed * 86400)}s" repeatCount="${Math.ceil(c.totalSeconds / 8640000)}" calcMode="discrete" />` : "";
	let animateDay1 = c.totalSeconds >= 86400 ? `<animateTransform id="day1${id}" attributeName="transform" type="translate" values="${numsOffsets}" dur="864000s" begin="-${864000 - ((c.totalSeconds % 86400) + c.day1Passed * 86400)}s" repeatCount="${Math.ceil(c.totalSeconds / 864000)}" calcMode="discrete" />` : "";
	let animateHr10 = c.totalSeconds >= 36000 ? `<animateTransform id="hr10${id}" attributeName="transform" type="translate" values="${numsOffsets}" dur="360000s" begin="-${360000 - (c.hr10Passed * 36000 + c.hr1Passed * 3600 + c.min10Passed * 600 + c.min1Passed * 60 + c.sec10Passed)}s" repeatCount="${Math.ceil(c.totalSeconds / 360000)}" calcMode="discrete" />` : "";
	let animateHr1 = c.totalSeconds >= 3600 ? `<animateTransform id="hr${id}" attributeName="transform" type="translate" values="${numsOffsets}" dur="36000s" begin="-${ 36000 - (c.hr1Passed * 3600 + c.min10Passed * 600 + c.min1Passed * 60 + c.sec10Passed)}s" repeatCount="${Math.ceil(c.totalSeconds / 36000)}" calcMode="discrete" />` : "";
	let animateMin10 = c.totalSeconds >= 600 ? `<animateTransform id="min10${id}" attributeName="transform" type="translate" values="${numsOffsets6}" dur="3600s" begin="-${3600 - (c.min10Passed * 600 + c.min1Passed * 60 + c.sec10Passed)}s" repeatCount="${Math.ceil(c.totalSeconds / 3600)}" calcMode="discrete" />` : "";
	let animateMin1 = c.totalSeconds >= 60 ? `<animateTransform id="min${id}" attributeName="transform" type="translate" values="${numsOffsets}" dur="600s" begin="-${600 - (c.min1Passed * 60 + c.sec10Passed)}s" repeatCount="${Math.ceil(c.totalSeconds / 600)}" calcMode="discrete" />` : "";
	let animateSec10 = c.totalSeconds >= 10 ? `<animateTransform id="sec10${id}" attributeName="transform" type="translate" values="${numsOffsets6}" dur="60s" begin="-${60 - c.sec10Passed}s" repeatCount="${Math.ceil(c.totalSeconds / 100)}" calcMode="discrete" />` : "";

	// make svg
	let svg = `<svg id="clockItToMe${id}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vxEnd} ${vyEnd}">
	<defs>
		<linearGradient id="grad" grradientTransform="rotate(90)">
			<stop offset="0%" stop-color="lime" />
			<stop offset="100%" stop-color="red" />
		</linearGradient>
		<pattern id="pattern"
             width="10" height="10"
             patternUnits="userSpaceOnUse"
             patternTransform="rotate(30 50 50) scale(0.5)">
			<rect height="10" width="10" fill="red"/>
      <line stroke="lime" stroke-width="7px" y2="10"/>
    </pattern>
		${showGlowBlur}
		<g id="nums${id}" fill="${c.color}" font-weight="${
		c.fontWeight
	}" font-size="25" font-family="${c.font}">
			<text transform="translate(3 24)">0</text>
			<text transform="translate(3 54)">1</text>
			<text transform="translate(3 84)">2</text>
			<text transform="translate(3 114)">3</text>
			<text transform="translate(3 144)">4</text>
			<text transform="translate(3 174)">5</text>
			<text transform="translate(3 204)">6</text>
			<text transform="translate(3 234)">7</text>
			<text transform="translate(3 264)">8</text>
			<text transform="translate(3 294)">9</text>
		</g>
	</defs>
	${showGlow}
	<g id="fullClock${id}">
		<g class="day100${id}">
			<use href="#nums${id}" />
			${animateDay100}
		</g>
		<g class="day10${id}">
			<use href="#nums${id}" transform="translate(20)" />
			${animateDay10}
		</g>
		<g class="day${id}">
			<use href="#nums${id}" transform="translate(40)" />
			${animateDay1}
		</g>
		<g class="hr10${id}">
			<use href="#nums${id}" transform="translate(65)" />
			${animateHr10}
		</g>
		<g class="hr${id}">
			<use href="#nums${id}" transform="translate(85)" />
			${animateHr1}
		</g>
		<g class="min10${id}">
			<use href="#nums${id}" transform="translate(110)" />
			${animateMin10}
		</g>
		<g class="min${id}">
			<use href="#nums${id}" transform="translate(130)" />
			${animateMin1}
		</g>
		<g class="sec10${id}">
			<use href="#nums${id}" transform="translate(155)" />
			${animateSec10}
		</g>
		<g class="sec${id}">
			<use href="#nums${id}" transform="translate(175)" />
			<animateTransform id="sec${id}" attributeName="transform" type="translate" values="${numsOffsets}" dur="10s" begin="-${(10 - c.sec1Passed) % 10}s" repeatCount="${Math.ceil(c.totalSeconds / 10)}" calcMode="discrete" />
		</g>
		${milliseconds}
		<path d="M62.5 10 v0 m0 10 v0 M 107.5 10 v0 m0 10 v0 M 152.5 10 v0 m0 10 v0${msDots}" stroke="${c.dotColor}" stroke-width="3" stroke-linecap="square" />
	</g>
	<g class="endTriggers">
		<animate id="placeholderAnimation${id}" attributeName="opacity" values="0; 0" dur="${c.totalSeconds}s" begin="0s" />
	</g>
	<g id="holiday${id}" opacity="0" style="transition: 1s">
		<rect height="100%" width="100%" fill="rgba(0,0,0,0.7)" />
		<text x="50%" y="50%" font-size="20" text-anchor="middle" dominant-baseline="middle" font-weight="600" font-family="Roboto, sans-serif" fill="#fff" stroke="#fff" stroke-width="2">${c.holidayText}</text>
		<text x="50%" y="50%" font-size="20" text-anchor="middle" dominant-baseline="middle" font-weight="600" font-family="Roboto, sans-serif" fill="#000" stroke="#000" stroke-width="1.5">${c.holidayText}</text>
		<text x="50%" y="50%" font-size="20" text-anchor="middle" dominant-baseline="middle" font-weight="600" font-family="Roboto, sans-serif" fill="url(#pattern)">${c.holidayText}</text>
		<animate attributeName="opacity" from="0" to="1" begin="placeholderAnimation1${id}.end" dur="1s" fill="freeze" />
	</g>
</svg>`;
	const wrapper = document.createElement("div");
	wrapper.innerHTML = svg;
	const doc = wrapper.firstChild;
	elt.appendChild(doc);
	// give us back the id
	return id;
}

let clock = document.querySelector("#clock");

let seconds2Christmas = secondsUntilHoliday(12, 25);
let clockId = initCountdown(clock, {
	color: "#55bf13",
	dotColor: "#b01b2e",
	showMs: false,
	// date: "12-25-2023"
	sec: seconds2Christmas
});

const randInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

function addListener(clockId) {
	const placeholder = document.querySelector(`#placeholderAnimation${clockId}`);
	// Check if the listener is already added
	if (!placeholder._hasListener) {
		placeholder._hasListener = true;
		// Add the animationend event listener
		placeholder.addEventListener("endEvent", (event) => {
			// console.log('SVG animation ended!', event);
			// document.querySelector(`#holiday${clockId}`).setAttribute("opacity", 1);
			confetti(document.querySelector(`#clockItToMe${clockId}`), {
				speed: 6000,
				type: ["🎅", "🤶", "🦌", "🌟", "⛄", "☃", "🎄", "🎁", "✝", "❄", "👼"],
				spread: 400,
				drop: 600,
				addBlur: false
			});
			setInterval(() => {
				confetti(document.querySelector(`#clockItToMe${clockId}`), {
					speed: 6000,
					type: ["🎅", "🤶", "🦌", "🌟", "⛄", "☃", "🎄", "🎁", "✝", "❄", "👼"],
					spread: 400,
					drop: 600,
					addBlur: false
				});
			}, 3000);
		});
	}
}

addListener(clockId);

function snowfetti(el = document.body, opt_properties) {
	if (!el) {
		console.error("Must have element to populate the confetti!");
		return;
	}
	const defaultProperties = {
		addBlur: true,
		angle: 0,
		beginStart: false,
		drop: 400,
		fadeout: true,
		fixedSize: false,
		flakes: 100,
		scale: 0.5,
		speed: 5000,
		spread: 400,
		spin: true,
		zSpin: true
	};
	const c = {...defaultProperties, ...opt_properties};
	const randInt = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	const baseEncode = (vall = document.querySelector("#usrInput").value) => {
	let usrVal = vall.replace(/\s\s+/g, ` `);
	let btoa = window.btoa(usrVal);
	let res = encodeURI(vall);
	if (res.indexOf("xmlns=") == -1) res = res.replace(`%3Csvg`, `%3Csvg xmlns=%22http://www.w3.org/2000/svg%22`);
	res = res.replaceAll(`#`, `%23`).replaceAll(`%22`, `'`).replaceAll(`%0A`, ``).replaceAll(`%09`, ``).replaceAll(`%20`, ` `).replace(/\s\s+/g, ` `);
	let baseEncodedSVG = `data:image/svg+xml,${res}`;
	let bgIm = `background-image: url("${baseEncodedSVG}");`;
	return [`data:image/svg+xml;base64,${btoa}`, baseEncodedSVG];
}
	const hh = c.drop;
	const ww = c.spread;
	const randomBlur = () => {
		if (c.addBlur) return randInt(1, 2);
		else return 1;
	};
	const overlayId = `conf${randInt(0, 1000)}etti${randInt(0, 1000)}ver${randInt(0, 1000)}lay`;
	let animatedConfetti = ``;
	// make sure number of flakes is a number
	if (!c.flakes || Number.isNaN(c.flakes * 1)) {
		c.flakes = 100;
	}
	for (let i = 0; i < c.flakes; i++) {
		const conId = `con${randInt(0, 1000)}fet${randInt(0, 1000)}ti${randInt(0, 1000)}`;
		const confettiDur = `${randInt(c.speed / 2, c.speed)}`;
		let confettiSpin = ``;
		let confettiType = ``;
		if (c.spin) {
			confettiSpin = `<animateTransform attributeName="transform" type="rotate" values="0 0 0; ${(Math.random() < 0.5 ? -1 : 1) * 360} 0 0" dur="${randInt(c.speed / 6, c.speed / 2)}ms" begin="-${randInt(100, 5000)}ms" repeatCount="indefinite" additive="sum" />`;
		}
		if (c.zSpin) {
			let xySpin = `-1 1`;
			if (randInt(0, 1) == 0) xySpin = `1 -1`;
			confettiSpin += `<animateTransform attributeName="transform" type="scale" values="1 1; ${xySpin}; 1 1" dur="${randInt(c.speed / 10, c.speed / 2)}ms" repeatCount="indefinite" additive="sum" />`;
		}
		let confettiColor = ``;
		let fixedScale = 1;
		if (!c.fixedSize) {
			fixedScale = randInt(5, 20) / 10;
		}
		let midpoints = randInt(3, 12);
		let snowFlakePath = `M 50 50 v-35`;
		for (let i = 0; i < midpoints; i++) {
			let linelength = randInt(20, 120) / 10;
			let yPos = 50 - randInt(50, 350) / 10;
			let path = `M50 ${yPos}l-${linelength} -${linelength}M50 ${yPos}l${linelength} -${linelength}`;
			snowFlakePath += path;
		}
		let arms = randInt(6, 12);
		let angle = 360 / arms;
		let armCopies = ``;
		let sw = randInt(10, 40) / 10;
		for (let i = 1; i < arms; i++) {
			armCopies += `<g transform="rotate(${angle * i} 50 50)"><path id="${conId + i}" fill="none" stroke="#fff" stroke-width="${sw}" d="${snowFlakePath}" /></g>`;
		}
		let snowflake = `<svg viewBox="0 0 100 100"><g><path id="arm" d="${snowFlakePath}" fill="none" stroke="#fff" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" />${armCopies}</g></svg>`;
		confettiType = `<g transform="scale(${c.scale})" id="${conId}"><image href="${baseEncode(snowflake)[1]}" height="${fixedScale * 20}" width="${fixedScale * 20}" x="${fixedScale * -10}" y="${fixedScale * -10}">${confettiSpin}</image></g>`;
		let topY = (hh * randInt(5, 25)) / 100;
		let startX = (ww * randInt(0, 100)) / 100;
		animatedConfetti += `<g>${confettiType}<animateMotion xlink:href="#${conId}" dur="${confettiDur}ms" begin="${c.beginStart ? 0 : -randInt(0, c.speed)}ms" fill="freeze" repeatCount="indefinite" keyTimes="0;1" keySplines="${randInt(0, 1) / 10} ${randInt(0, 1) / 10} ${randInt(0, 10) / 10} ${randInt(0, 1) / 10}" calcMode="spline" path="M ${startX} ${hh * -0.1} q ${((ww * randInt(10, 40)) / 100) * (Math.random() < 0.5 ? -1 : 1)} ${(hh * randInt(20, 40)) / 100} 0 ${(hh * randInt(40, 60)) / 100} T ${startX} ${hh * 1.1}"></animateMotion></g>`;
	}
	const elemRect = el.getBoundingClientRect();
	const centerY = elemRect.top + (elemRect.bottom - elemRect.top) / 2;
	const centerX = elemRect.left - (elemRect.left - elemRect.right) / 2;
	let fadeAnim = ``;
	if (c.fadeout) fadeAnim = `<animate attributeName="opacity" values="1; 0" dur="${c.speed / 4}ms" begin="${c.speed / 4}ms" repeatCount="none" fill="freeze"/>`;
	const svg = `<svg id="${overlayId}" viewBox="0 0 ${ww} ${hh}" height="${hh}px" width="${ww}px" preserveAspectRatio="none" style="left:${centerX}px; top:${centerY}px; pointer-events: none; position: fixed; transform: translate(-50%,-50%) rotate(${c.angle}deg); user-select: none"><filter id="blur1" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur in="SourceGraphic" stdDeviation="0" /></filter><filter id="blur2" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur in="SourceGraphic" stdDeviation="1" /></filter><g>${animatedConfetti}${fadeAnim}</g></svg>`;
	const wrapper = document.createElement("div");
	wrapper.innerHTML = svg;
	const svgChild = wrapper.firstChild;
	el.appendChild(svgChild);
}

function letItSnow(beginStart=false) {
	const randInt = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	snowfetti(document.querySelector('#backgroundSnow'), {
		spread: window.innerWidth,
		flakes: randInt(20, 40),
		speed: randInt(25000, 40000),
		fadeout: false,
		drop: window.innerHeight,
		spin: true,
		beginStart: beginStart
	});
	snowfetti(document.querySelector('#foregroundSnow'), {
		spread: window.innerWidth,
		flakes: randInt(20, 40),
		speed: randInt(25000, 40000),
		fadeout: false,
		drop: window.innerHeight,
		spin: true,
		beginStart: beginStart
	});
}

document.querySelector("#foregroundSnow").addEventListener("click", (el) => {
	snowfetti(el.target, {
		spread: window.innerWidth,
		beginStart: true,
		flakes: 40,
		speed: 20000,
		fadeout: false,
		drop: window.innerHeight,
		spin: true
	});
});

letItSnow();

// refresh it if we leave the page
window.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
		document.getElementById('clock').replaceChildren();
    let seconds2Christmas = secondsUntilHoliday(12, 25);
		let clockId = initCountdown(clock, {
			color: "#55bf13",
			dotColor: "#b01b2e",
			showMs: false,
			// date: "12-25-2023"
			sec: seconds2Christmas
		});
		addListener(clockId);
  }
});

// refresh it if we resize
window.addEventListener("resize", () => {
	document.getElementById('clock').replaceChildren();
	document.getElementById('backgroundSnow').replaceChildren();
	document.getElementById('foregroundSnow').replaceChildren();
	letItSnow();
	let seconds2Christmas = secondsUntilHoliday(12, 25);
	let clockId = initCountdown(clock, {
		color: "#55bf13",
		dotColor: "#b01b2e",
		showMs: false,
		// date: "12-25-2023"
		sec: seconds2Christmas
	});
	addListener(clockId);
});
