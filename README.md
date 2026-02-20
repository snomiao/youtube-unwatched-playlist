# Youtube Auto Play Unwatched Videos in Search Results

This userscript automatically plays all unwatched videos in YouTube search results. It's particularly useful for learning languages by watching random videos daily.

## Features

- Automatically applies the "Unwatched" filter to your search results.
- Clears the video queue if there are already videos in it.
- Queues all unwatched videos in the search result.
- Plays the queued videos automatically.
- Expands the mini-player to large view.

## Installation

To use this script, you'll need a userscript manager extension like [Tampermonkey](https://www.tampermonkey.net/) or [Greasemonkey](https://www.greasespot.net/).

**[Click here to install the userscript](https://update.greasyfork.org/scripts/529565/Youtube%20Auto%20Play%20Unwatched%20Videos%20in%20search%20results.user.js)**

Or install manually:

1. Install a userscript manager on your browser.
2. Create a new script and copy the content of the script above into it.
3. Save the script.

## Usage

1. Navigate to YouTube and perform a search.
2. The script will automatically filter for unwatched videos and add them to a playlist.
3. The playlist will start playing automatically.

## How It Works

- The script uses JavaScript to interact with the YouTube DOM elements.
- It ensures the "Unwatched" filter is applied if available.
- It interacts with the YouTube player to clear existing queues and add new videos.
- The script is designed to handle interruptions and retries actions for a defined period if they initially fail.

## Troubleshooting

- **Timeouts:** The script will try actions for up to 5 seconds. If an action continuously fails, it throws an error. Ensure your internet connection is stable.
- **Button Changes:** YouTube frequently updates its UI. If the script stops working, check for updated button or element selectors and update the script accordingly.
- **Permissions:** Ensure your userscript manager is allowed to run scripts on YouTube's domain.

## Support

For support or to contribute to this script, visit the [GitHub repository](https://github.com/snomiao/youtube-unwatched-playlist) or the [support Gist](https://gist.github.com/snomiao/e01612efad527a08c5aec327889c0d2f).
