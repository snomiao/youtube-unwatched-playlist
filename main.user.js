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

loop();

async function loop() {
  await sleep(300);
  await clickUnwatchedIfNotYet();
  await clearQueueIfAlreadyHaveList();
  await waitForActionMenuButtonsShown();
  console.log("ready");

  // add to playlist queue
  const menuBtns = $$('yt-icon-button button[aria-label="Action menu"]');
  for await (const menuBtn of menuBtns) {
    if (menuBtn.style.backgroundColor === "red") continue;
    menuBtn.focus();
    menuBtn.click();
    menuBtn.style.backgroundColor = "red";

    await sleep(100);
    await waitFor(() =>
      $('tp-yt-paper-item[role="option"]:not([aria-disabled="true"])').click()
    );
  }
  await waitFor(async () =>
    $(".ytp-play-button.ytp-button.ytp-play-button-playlist").click()
  );

  $(".ytp-miniplayer-expand-watch-page-button").click(); // expand player

  // NOW ENJOY your fresh list
}

async function clickUnwatchedIfNotYet() {
  await waitFor(async () => {
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
}

async function clearQueueIfAlreadyHaveList() {
  if ($(".ytp-miniplayer-close-button")) {
    await waitFor(() => $(".ytp-miniplayer-close-button").click());
    await waitFor(() => $('button[aria-label="Close player"]').click());
    await sleep(800);
  }
}

async function waitForActionMenuButtonsShown() {
  await waitFor(() => {
    if (!$$('yt-icon-button button[aria-label="Action menu"]').length)
      throw "again";
  });
}

function DIE(error) {
  throw error;
}

async function waitFor(fn) {
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function $(sel) {
  return document.querySelector(sel);
}
function $$(sel) {
  return [...document.querySelectorAll(sel)];
}
