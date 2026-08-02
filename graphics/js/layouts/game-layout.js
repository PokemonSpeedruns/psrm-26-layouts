'use strict';

$(() => {

	let runData;

	loadFromSpeedControl();

	if ($('.catch-count').length > 0) {
		loadFromLetsGoTracker();
	}

	function loadFromSpeedControl() {
		const speedcontrolBundle = 'nodecg-speedcontrol';

		let gameTitle = $('#game-name');
		let gameCategory = $('#category');
		let gameSystem = $('#platform');
		let gameYear = $('#year');
		let gameEstimate = $('#estimate');

		let runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
		runDataActiveRun.on('change', (newVal) => {
			if (newVal)
				runData = newVal;
				updateSceneFields(newVal);
		});

		function updateSceneFields(runData) {
			let currentTeamsData = runData.teams;
			let customData = runData.customData;

			gameSystem.html(runData.system);
			gameYear.html(runData.release);
			gameEstimate.html(runData.estimate);

			fadeHtml('#game-name', runData.game.toUpperCase(), true);
			fadeHtml('#category', runData.category, true);

			// Reset all runner data.
			$('.runner-name').add('.pronouns').text('');
			$('.runner-details').data('teamID', '');

			let i = 0;

			for (let team of currentTeamsData) {
				for (let player of team.players) {
					// Update runner name.
					fadeText('#runner-name' + (i + 1), player.name, true);

					// Update pronouns.
					let pronouns = player.pronouns;
					if (pronouns === undefined) {
						$('#pronouns' + (i + 1)).hide();
					} else {
						$('#pronouns' + (i + 1)).show();
						fadeText('#pronouns' + (i + 1), `[${pronouns}]`, true);
					}

					i += 1;
				}
			}

			// Reset all comms data.
			$('.comms-name').add('.comms-pronouns').text('');

			// Update comms names and pronouns.
			Object.entries(customData).map(([key, val] = entry) => {
				if(key.includes("Pronouns")) {
					val = '[' + val + ']'; // Pronouns are bracketed.
				}
				// The key here maps to the HTML element ID.
				fadeText('#' + key, val, true);
			});
		}
	}

	function loadFromLetsGoTracker() {
		setTimeout(updateCatchCounts, 500);
		setInterval(updateCatchCounts, 5000);
	}

	function updateCatchCounts() {
		// If we have data stored from Speedcontrol
		if (runData) {
			let trackerKeysMap = {};
			const teams = runData.teams;

			let i = 1;

			// Collect the runner keys and their corresponding runner index.
			for (let team of teams) {
				for (let player of team.players) {
					const trackerKey = player.customData.trackerKey;

					if (trackerKey) {
						trackerKeysMap[player.customData.trackerKey] = i;
					}

					i++;
				}
			}

			const trackerKeys = Object.keys(trackerKeysMap);

			if (trackerKeys && trackerKeys.length > 0) {
				// Execute the request to fetch the tracker data.
				const url = "https://us-central1-lets-go-tracker.cloudfunctions.net/app/get?names=" + Object.keys(trackerKeysMap).join(",");

				fetch(url).then(function(response) {
					return response.json();
				}).then(function(trackerData) {
					// For each runner in the tracker data response.
					trackerData.forEach(runnerTrackerData => {
						const trackerKey = runnerTrackerData.name;
						const numberOfPokes = runnerTrackerData.pokes.filter(poke => poke.status === "marked").length;

						// Get the runner ID from the tracker key. This will be used to update the HTML.
						const runnerId = trackerKeysMap[trackerKey];

						// If there is a runner ID.
						if (runnerId) {
							// Update the catch count on the layout.
							$('#catch-count' + runnerId).text(numberOfPokes + "/135");

							// If the runner is not done, we can show the catch count. Otherwise, it stays hidden so we can show the timer instead.
							const finished = $('#finalTime' + runnerId).text().length > 0;
							if (!finished) {
								$('#finalTime' + runnerId).hide();
								$('#catch-count' + runnerId).show();
							}
						}
					});
				}).catch(function(err) {
					console.log('Fetch Error: ', err);
				});
			}
		}
	}
});
