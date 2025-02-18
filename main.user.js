// ==UserScript==
// @name        Youtube Auto Play Unwatched Videos in search results.
// @namespace   snomiao@gmail.com
// @match       https://www.youtube.com/results*
// @grant       none
// @version     1.0.0
// @author      snomiao@gmail.com
// @supportURL  https://github.com/snomiao/youtube-unwatched-playlist
// @supportURL  https://gist.github.com/snomiao/e01612efad527a08c5aec327889c0d2f
// @description Automately Play all unwatched search results in a queue, useful to learn language from randomly videos by your everyday.
// ==/UserScript==

(async function loop() {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  await sleep(300);
  // click Unwatched if not yet
  await ensure(async () => {
    const noOptions =
      $$('[chip-style="STYLE_HOME_FILTER"]').length === 0 &&
      $$('yt-icon-button button[aria-label="Action menu"]').length;
    const alreadyUnwatched = $(
      '[chip-style="STYLE_HOME_FILTER"][selected] [title="Unwatched"]'
    );
    if (noOptions || alreadyUnwatched) return;

    $('[chip-style="STYLE_HOME_FILTER"] [title="Unwatched"]').click();
    await sleep(1500);
  });

  // clear queue if already have list
  if ($(".ytp-miniplayer-close-button")) {
    await ensure(() => $(".ytp-miniplayer-close-button").click());
    await ensure(() => $('button[aria-label="Close player"]').click());
    await sleep(800);
  }

  // wait for action menu buttons
  await ensure(() => {
    if (!$$('yt-icon-button button[aria-label="Action menu"]').length)
      throw "again";
  });
  console.log("ready");

  // add to playlist queue
  let i = 0;
  for (const e of $$('yt-icon-button button[aria-label="Action menu"]')) {
    if (e.style.backgroundColor === "red") continue;

    e.focus();
    e.click();
    e.style.backgroundColor = "red";

    await sleep(100);

    await ensure(async () =>
      $('tp-yt-paper-item[role="option"]:not([aria-disabled="true"])').click()
    );

    // click play button after first video queued
    const isFirst = i++ === 0;
    if (isFirst)
      await ensure(async () =>
        $(".ytp-play-button.ytp-button.ytp-play-button-playlist").click()
      );
  }

  // expand player
  $(".ytp-miniplayer-expand-watch-page-button").click();

  // NOW ENJOY your fresh list
})();

function DIE(error) {
  throw error;
}
async function ensure(fn) {
  const st = +new Date();
  while (+new Date() - st < 5e3) {
    try {
      return await fn();
    } catch (e) {
      // pass
      await sleep(100);
    }
  }
  throw new Error("timeout");
}
async function waitFor(conditionFunction) {
  while (!conditionFunction()) {
    await sleep(100);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
