let runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
let runDataArray = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');
let labelRefreshInterval;

NodeCG.waitForReplicants(runDataActiveRun, runDataArray).then(loadFromSpeedControl);

function getNextRuns(runData, amount) {
	let nextRuns = [];
	let indexOfCurrentRun = findIndexInRunDataArray(runData);

	for (let i = 1; i <= amount; i++) {
		if (!runDataArray.value[indexOfCurrentRun + i]) {
			break;
		}
		nextRuns.push(runDataArray.value[indexOfCurrentRun + i]);
	}

	return nextRuns;
}

function findIndexInRunDataArray(run) {
	let indexOfRun = -1;

	if (run) {
		for (let i = 0; i < runDataArray.value.length; i++) {
			if (run.id === runDataArray.value[i].id) {
				indexOfRun = i; break;
			}
		}
	}

	return indexOfRun;
}

function loadFromSpeedControl() {
	runDataActiveRun.on('change', (newVal, oldVal) => {
		refreshNextRunsData(newVal, true);
	});

	runDataArray.on('change', (newVal, oldVal) => {
		refreshNextRunsData(runDataActiveRun.value, true);
	});

	refreshNextRunsData(runDataActiveRun.value, true);

	if (!labelRefreshInterval) {
		labelRefreshInterval = setInterval(() => {
			refreshNextRunsData(runDataActiveRun.value, false);
		}, 5000);
	}
}

function refreshNextRunsData(currentRun, shouldFade) {
	if (!currentRun || !runDataArray.value) {
		return;
	}

	let nextRuns = getNextRuns(currentRun, 4);

	let upNextLabel = '#up-next-label';
	let upNextGame = '#up-next-game';
	let upNextCategory = '#up-next-category';
	let upNextInfo = '#up-next-info';
	let upNextEstimate = '#up-next-estimate';
    
	updateHtml(upNextLabel, timeUntil(currentRun.customData.startTime), shouldFade);
	updateHtml(upNextGame, currentRun.game, shouldFade);
	updateHtml(upNextCategory, currentRun.category, shouldFade);
	updateHtml(upNextInfo, getNamesForRun(runDataActiveRun.value).join(', '), shouldFade);
	updateHtml(upNextEstimate, currentRun.estimate, shouldFade);

	let i = 0;

	for (let run of nextRuns) {
		if (i >= 4) {
			break;
		}

		let onDeckLabel = '#on-deck-label' + (i + 1);
		let onDeckGame = '#on-deck-game' + (i + 1);
		let onDeckCategory = '#on-deck-category' + (i + 1);
		let onDeckRunner = '#on-deck-info' + (i + 1);
		let onDeckEstimate = '#on-deck-estimate' + (i + 1);

		updateHtml(onDeckLabel, timeUntil(run.customData.startTime), shouldFade);
		updateHtml(onDeckGame, run.game, shouldFade);
		updateHtml(onDeckCategory, run.category, shouldFade);
		updateHtml(onDeckRunner, getNamesForRun(run).join(' & '), shouldFade);
		updateHtml(onDeckEstimate, run.estimate, shouldFade);
        
		i += 1;
	}
}

function updateHtml(selector, value, shouldFade) {
	if (shouldFade) {
		fadeHtml(selector, value, true);
		return;
	}

	$(selector).html(value);
}

function timeUntil(timestamp) {
	const target = new Date(timestamp);
	const now = new Date();

	const diffMs = target - now;

	if (diffMs <= 0) {
		return "Now";
	}

	const minutes = Math.ceil(diffMs / (1000 * 60));

	if (minutes < 60) {
		return `In ${minutes} minute${minutes === 1 ? "" : "s"}`;
	}

	const hours = Math.ceil(minutes / 60);
	return `In ${hours} hour${hours === 1 ? "" : "s"}`;
}
