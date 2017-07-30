const resultBlock = document.getElementById('result');

let data = JSON.parse(localStorage.getItem('serials'));
data = JSON.stringify(data, null, 2);
let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(data);

document.getElementById('link').href = dataUri;

document.getElementById('import').addEventListener('click', function() {
	resultBlock.classList.remove('show');
	let files = document.getElementById('selectFiles').files;
  if (files.length != 1) {
  	resultBlock.classList.add('show');
    resultBlock.innerHTML = 'Виберіть файл який хочете імпортувати!';
    return false;
  }
  let fr = new FileReader();
  fr.readAsText(files[0]);

  fr.onload = function(e) {
  	console.log(e);
    let result = JSON.parse(e.target.result);
    if(!result.lastID || !result.lastUpdate || !result.serials) {
    	resultBlock.classList.add('show');
    	resultBlock.innerHTML = 'Цей файл не схожий на файл з серіалами, або в ньому немає серіалів';
    	return false;
    }
    let formatted = JSON.stringify(result);
    localStorage.setItem('serials', formatted);
    resultBlock.classList.add('show');
    resultBlock.innerHTML = 'Файл успішно імпортовано!';
  }
});

document.getElementById('clear').addEventListener('click', function() {
	if(!document.getElementById('checkbox').checked) return false;

	localStorage.clear();
  resultBlock.classList.add('show');
  resultBlock.innerHTML = 'Базу даних очищено';
});