// ==UserScript==
// @name        Youtube Auto Play Unwatched Videos in search results.
// @namespace   snomiao@gmail.com
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.0.10
// @author      snomiao@gmail.com
// @supportURL  https://github.com/snomiao/youtube-unwatched-playlist
// @supportURL  https://gist.github.com/snomiao/e01612efad527a08c5aec327889c0d2f
// @description Automatically Play all unwatched search results in a queue, useful to learn language from randomly videos by your everyday.
// @name:ar     تشغيل تلقائي للفيديوهات غير المشاهدة في نتائج البحث على يوتيوب.
// @description:ar   تشغيل تلقائي لجميع نتائج البحث غير المشاهدة في قائمة انتظار، مفيد لتعلم اللغة من الفيديوهات العشوائية يومياً.
// @name:zh     YouTube 自动播放搜索结果中的未观看视频。
// @description:zh   自动以队列方式播放所有未观看的搜索结果，有助于通过随机视频学习语言。
// @name:fr     Lecture automatique des vidéos non regardées dans les résultats de recherche YouTube.
// @description:fr   Joue automatiquement toutes les vidéos non regardées dans les résultats de recherche en file d'attente, utile pour apprendre une langue à partir de vidéos aléatoires au quotidien.
// @name:ru     Автоматическое воспроизведение непросмотренных видео в результатах поиска YouTube.
// @description:ru   Автоматически воспроизводит все непросмотренные результаты поиска в очереди, полезно для изучения языка из случайных видео каждый день.
// @name:es     Reproducción automática de videos no vistos en los resultados de búsqueda de YouTube.
// @description:es   Reproduce automáticamente todos los resultados de búsqueda no vistos en una cola, útil para aprender idiomas de videos aleatorios todos los días.
// ==/UserScript==

const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const tap =
  (fn, ...rest) =>
    (value) => (fn(value, ...rest), value);
const waitFor = async (fn) =>
  (await fn()) ||
  (await new Promise((r) => setTimeout(() => r(waitFor(fn)), 200)));
const waitForFallingEdge = async (fn) =>
  await waitFor(fn) && await waitFor(async () => !await fn())
const timeLog =
  (fn, name = fn.name ?? String(fn)) =>
    async () => {
      console.log(name + ': start')
      console.time(name);
      await fn().finally(() => console.timeEnd(name));
    };

const clearQueue = async () =>
  $$(".ytp-miniplayer-close-button")
    .filter((e) => e.checkVisibility())
    .map(tap((e) => e.click()))
    .at(0) &&
  (await waitForFallingEdge(() =>
    $$('tp-yt-paper-toast')
      .filter(e => e.textContent.match(/Queue cleared/))
      .filter(e => e.checkVisibility())
      .at(0)
  ))

const clickUnwatched = async () =>
  // wait for filters btn 
  (await waitFor(() =>
    $$("[role=text]")
      .filter((e) => e.textContent.match(/Filters/))
      ?.at(0)
  )) &&
  // return if already unwatched
  $$("button[aria-selected=true]")
    .filter((e) => e.textContent.match(/Unwatched|未視聴/))
    ?.at(0) ||
  // check unwatched btn and click it
  $$("button")
    .filter((e) => e.textContent.match(/Unwatched|未視聴/))
    .map(tap(e => e.click()))
    .at(0) &&
  // if exist, wait for reload and already unwatched
  await waitForFallingEdge(() => $$("ytd-search[continuation-is-reloading]")[0]) &&
  await waitFor(() => $$("button[aria-selected=true]")
    .filter((e) => e.textContent.match(/Unwatched|未視聴/))
    ?.at(0))

const reset = () =>
  $$("ytd-menu-renderer>*>button").map((e) => (e.style.background = ""));
const getNextMenuBtns = async (mark = false) =>
  $$("ytd-menu-renderer>*>button")
    .filter((e) => !mark || e.style.background !== "yellow")
    .slice(0, 1)
    .map(tap(console.log))
    .map(tap((e) => !mark || (e.style.background = "yellow")))
    .map(tap((e) => e.click()))
    .at(0) &&
  (await waitFor(() => $$(".ytd-menu-popup-renderer").at(0))) &&
  $$(".ytd-menu-popup-renderer[role=menuitem]");

const batchClickMenuItem = async (name) =>
  (await getNextMenuBtns(true))
    ?.filter((btn) => btn.textContent.match(name))
    .slice(0, 1)
    .map(tap((e) => e.click()))
    .at(0) && (await batchClickMenuItem(name));
const addAllToQueue = async () =>
  batchClickMenuItem("Add to queue") &&
  (await waitForFallingEdge(() =>
    $$('tp-yt-paper-toast')
      .filter(e => e.textContent.match(/Added to Queue/))
      .filter(e => e.checkVisibility())
      .at(0)
  ))

const playIt = async () =>
  (await waitFor(() =>
    $$(
      "button.ytp-play-button.ytp-button.ytp-play-button-playlist[data-title-no-tooltip=Play]"
    )
      .filter((e) => e.checkVisibility())
      .map(tap((e) => e.click()))
      .at(0)
  )) &&
  (await waitFor(
    () =>
      !$$(
        "button.ytp-play-button.ytp-button.ytp-play-button-playlist[data-title-no-tooltip=Play]"
      )
        .filter((e) => e.checkVisibility())
        .at(0)
  ));

const queueAll = async () => {
  reset();
  await timeLog(clearQueue)();
  await timeLog(clickUnwatched)();
  await timeLog(addAllToQueue)();
  await sleep(1000)
  // ensure its playing
  await timeLog(playIt)();
  await timeLog(playIt)();
  await timeLog(playIt)();
};

const expandIt = async () =>
  waitFor(
    $$(".ytp-miniplayer-expand-watch-page-button").map(tap()).at(0).click()
  );

const onPageFinished = (async () => {
  if (!location.pathname.match(/^\/results/)) return;
  await queueAll();
});

document.addEventListener("yt-page-data-updated", onPageFinished, false);
document.addEventListener("yt-navigate-finish", onPageFinished, false);
document.addEventListener("spfdone", onPageFinished, false);
onPageFinished();