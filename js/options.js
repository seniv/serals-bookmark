const resultBlock = document.getElementById('result')

chrome.storage.sync.get('serials', ({ serials }) => {
  if (!serials) {
    document.getElementById('link').classList.add('disabled')
    document.getElementById('clear').classList.add('disabled')
    return false
  }
  let data = JSON.stringify(serials, null, 2)
  let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(data)
  document.getElementById('link').href = dataUri
})

document.getElementById('import').addEventListener('click', function() {
	resultBlock.classList.remove('show')
	let files = document.getElementById('selectFiles').files
  if (files.length != 1) {
  	resultBlock.classList.add('show')
    resultBlock.innerHTML = chrome.i18n.getMessage('importSelectFile')
    return false
  }
  let fr = new FileReader()
  fr.readAsText(files[0])

  fr.onload = function(e) {
  	console.log(e)
    let result = JSON.parse(e.target.result)
    if(!result.lastID || !result.lastUpdate || !result.serials) {
    	resultBlock.classList.add('show')
    	resultBlock.innerHTML = chrome.i18n.getMessage('importWrongFile')
    	return false
    }
    chrome.storage.sync.set({ 'serials': result }, () => {
      resultBlock.classList.add('show')
      resultBlock.innerHTML = chrome.i18n.getMessage('importSuccess')
    })
  }
})

document.getElementById('clear').addEventListener('click', function() {
	if(!document.getElementById('checkbox').checked) return false

	chrome.storage.sync.clear()
  resultBlock.classList.add('show')
  resultBlock.innerHTML = chrome.i18n.getMessage('successClear')
})

document.getElementById('exportDesc').innerHTML = chrome.i18n.getMessage('exportDesc')
document.getElementById('link').innerHTML = chrome.i18n.getMessage('exportButton')
document.getElementById('importDesc').innerHTML = chrome.i18n.getMessage('importDesc')
document.getElementById('import').innerHTML = chrome.i18n.getMessage('importButton')
document.getElementById('resetDesc').innerHTML = chrome.i18n.getMessage('resetDesc')
document.getElementById('resetCheckbox').innerHTML = chrome.i18n.getMessage('resetCheckbox')
document.getElementById('clear').innerHTML = chrome.i18n.getMessage('resetButton')