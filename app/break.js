const { ipcRenderer, remote } = require('electron')
const Utils = remote.require('./utils/utils')
const HtmlTranslate = require('./utils/htmlTranslate')

const { getGlobal } = require('electron').remote;
const trackEvent = getGlobal('trackEvent');

const showdown  = require('showdown')

const converter = new showdown.Converter();

document.addEventListener('DOMContentLoaded', event => {
  new HtmlTranslate(document).translate()
})

document.addEventListener('dragover', event => event.preventDefault())
document.addEventListener('drop', event => event.preventDefault())

document.getElementById('close').addEventListener('click', event =>
  ipcRenderer.send('finish-break', false)
)

document.getElementById('postpone').addEventListener('click', event =>
  ipcRenderer.send('postpone-break')
)

ipcRenderer.on('breakIdea', (event, message) => {
  let breakIdea = document.getElementsByClassName('break-idea')[0]
  breakIdea.innerHTML = converter.makeHtml(message[0].trim());
  let breakText = document.getElementsByClassName('break-text')[0]
  breakText.innerHTML = converter.makeHtml(message[1].trim());

  trackEvent('Long Bytes', 'View', message[0]);
})

ipcRenderer.on('progress', (event, started, duration, strictMode, postpone, postponePercent) => {
  let progress = document.getElementById('progress')
  let progressTime = document.getElementById('progress-time')
  let postponeElement = document.getElementById('postpone')
  let closeElement = document.getElementById('close')

  window.setInterval(function () {
    if (Date.now() - started < duration) {
      const passedPercent = (Date.now() - started) / duration * 100
      postponeElement.style.visibility =
        Utils.canPostpone(postpone, passedPercent, postponePercent) ? 'visible' : 'hidden'
      closeElement.style.visibility =
        Utils.canSkip(strictMode, postpone, passedPercent, postponePercent) ? 'visible' : 'hidden'
      progress.value = passedPercent * progress.max / 100
      progressTime.innerHTML = Utils.formatRemaining(Math.trunc((duration - Date.now() + started) / 1000))
    }
  }, 100)
})
