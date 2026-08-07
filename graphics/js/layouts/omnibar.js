const speedcontrolBundle = 'nodecg-speedcontrol';

let staticIndex;
staticIndex = 0;

$(() => {
	// Please view the Github docs for valid values.
	// Set static text.	
	function staticText(index) {
		if (index === 0)
			setOmnibarHtml(`<p class="is-single-line is-text-centered">Follow us on Twitch: pokemonspeedrunstv</p>`)
		else if (index === 1)
			setOmnibarHtml(`<p class="is-single-line is-text-centered">Follow us on YouTube: @PokemonSpeedRunsPSR</p>`)
		else if (index === 2)
			setOmnibarHtml(`<p class="is-single-line is-text-centered">Follow us on Twitter/X: @PkmnSpeedRuns</p>`)
		else if (index === 3)
			setOmnibarHtml(`<p class="is-single-line is-text-centered">Follow us on Bluesky: @pokemonspeedruns.bsky.social</p>`)
		else if (index === 4)
			setOmnibarHtml(`<p class="is-single-line is-text-centered">Follow us on Instagram: @pkmnspeedruns</p>`)
		else 
			setOmnibarHtml(`<p class="is-single-line is-text-centered">Join the PSR Subreddit: r/pkmnspeedruns</p>`)
	}
	
	setOmnibarHtml(staticText[0])
	runTickerText();

	function setOmnibarHtml(html) {
		$('#omnibar-content').fadeOut(nodecg.bundleConfig.omnibar.fadeOutTime, () => {
			$('#omnibar-content').html(html).fadeIn(nodecg.bundleConfig.omnibar.fadeInTime);
		});
	}

	function runTickerText() {
		setInterval(() => {
			staticText(staticIndex)
			staticIndex++;

			if (staticIndex > staticText.length + 4) { // +4 as quick fix to showing the 6 social platforms in static text, need to figure out why staticText.length only = 1
				rewardIndex = pollIndex = targetIndex = runIndex = staticIndex = 0;
			}
		}, nodecg.bundleConfig.omnibar.dwellTime);
	}
});