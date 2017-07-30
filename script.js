const addButton = document.getElementById('addButton');
const addURL = document.getElementById('url');
const addName = document.getElementById('name');
const bookmarks = document.getElementsByClassName('bookmarks')[0];
const addArea = document.getElementsByClassName('add-area')[0];
const firstSerial = document.getElementsByClassName('add-first-serial')[0];
const urls = document.getElementsByClassName('url');
const deleteDialog = createDeleteDialog();
const editDialog = createEditDialog();

let DB = JSON.parse(localStorage.getItem('serials'));
if(!DB) {
  DB = {
    lastID: 0,
    lastUpdate: 0,
    serials: []
  };
}

if(DB.serials.length) {
  DB.serials.sort(function (a, b) {
    if (a.number > b.number) return 1;
    if (a.number < b.number) return -1;
    return 0;
  }).forEach (serial => {
    add(serial.url, serial.name, serial.id, serial.season, serial.episode);
  })
} else {
  firstSerial.classList.remove('hide');
}

addName.addEventListener('click', () => {
  if (addName.classList.contains('empty')) {
    addName.classList.toggle('empty');
  }
});
addURL.addEventListener('click', () => {
  if (addURL.classList.contains('empty')) {
    addURL.classList.toggle('empty');
  }
});

addButton.addEventListener('click', ev => {
  if (!firstSerial.classList.contains('hide')) firstSerial.classList.add('hide');

  if(addArea.classList.contains('active')) {
    if(!addName.value) {
      if (!addName.classList.contains('empty')) {
        addName.classList.toggle('empty');
      }
      return;
    }
    if(!addURL.value) {
      if (!addURL.classList.contains('empty')) {
        addURL.classList.toggle('empty');
      }
      return;
    }

    add(addURL.value, addName.value, DB.lastID);
    DB.serials.push({
      id: DB.lastID++,
      name: addName.value,
      url: addURL.value,
      number: DB.lastUpdate++,
      season: 1,
      episode: 1
    });
    localStorage.setItem('serials', JSON.stringify(DB));

    addURL.value = '', addName.value = '';
    addArea.classList.toggle('active');
  } else {
    addArea.classList.toggle('active');
  }
});

function add(url, name, id, se = '1', ep = '1') {
  let a = createElement('a', { href: url, className: 'url', target: '_blank' }, name);
  let del = createElement('div', { className: 'delete' });
  let edit = createElement('div', { className: 'edit' });

  let prevSeason = createElement('div', { className: 'prev' }, '-');
  let seasonNumber = createElement('span', { className: 'season-number' }, se+'');
  let nextSeason = createElement('div', { className: 'next' }, '+');
  let seasonNumberAndNext = createElement('div', { className: 'number-and-next' }, seasonNumber, nextSeason);
  let season = createElement('div', { className: 'episode se' }, prevSeason, seasonNumberAndNext);

  let prevEpisode = createElement('div', { className: 'prev' }, '-');
  let episodeNumber = createElement('span', { className: 'episode-number' }, ep+'');
  let nextEpisode = createElement('div', { className: 'next' }, '+');
  let episodeNumberAndNext = createElement('div', { className: 'number-and-next' }, episodeNumber, nextEpisode);
  let episode = createElement('div', { className: 'episode ep' }, prevEpisode, episodeNumberAndNext);

  let seasonAndEpisode = createElement('div', { className: 'season-and-episode' }, season, episode);

  let li = createElement('li', { id: id }, a, del, edit, seasonAndEpisode);
  bookmarks.prepend(li);

  bindEvents(li);
}

function bindEvents(serialElement) {
  let url = serialElement.querySelector('.url');
  let deleteButton = serialElement.querySelector('.delete');
  let editButton = serialElement.querySelector('.edit');

  let prevSeason = serialElement.querySelector('.se .prev');
  let nextSeason = serialElement.querySelector('.se .next');
  let season = serialElement.querySelector('.se .season-number');

  let prevEpisode = serialElement.querySelector('.ep .prev');
  let nextEpisode = serialElement.querySelector('.ep .next');
  let episode = serialElement.querySelector('.ep .episode-number');

  url.addEventListener('click', ({ target }) => {
    DB.serials.forEach((serial, i) => {
      if(serial.id == target.parentNode.id) {
        DB.serials[i].number = DB.lastUpdate++;
        localStorage.setItem('serials', JSON.stringify(DB));
      }
    });
  });

  deleteButton.addEventListener('click', ({ target }) => {
    if(editButton.classList.contains('active')) {
      editButton.classList.toggle('active');
      let dialog = target.parentNode.querySelector('.edit-area');
      target.parentNode.removeChild(dialog);
    }

    if(target.classList.contains('active')) {
      let dialog = target.parentNode.querySelector('.confirm-delete');
      target.parentNode.removeChild(dialog);
    } else {
      let dialog = deleteDialog.cloneNode(true);
      target.parentNode.appendChild(dialog);

      dialog.querySelector('.button-delete').addEventListener ('click', ({ target }) => {
        DB.serials.forEach((serial, i) => {
          if(serial.id == target.parentNode.parentNode.id) {
            DB.serials.splice(i, 1);
            target.parentNode.parentNode.remove();
            localStorage.setItem('serials', JSON.stringify(DB));
          }
        });
      })
    }
    target.classList.toggle('active');
  });

  editButton.addEventListener('click', ({ target }) => {
    if(deleteButton.classList.contains('active')) {
      deleteButton.classList.toggle('active');
      let dialog = target.parentNode.querySelector('.confirm-delete');
      target.parentNode.removeChild(dialog);
    }

    if(target.classList.contains('active')) {
      let dialog = target.parentNode.querySelector('.edit-area');
      let name = dialog.querySelector('input:first-child');
      let newURL = dialog.querySelector('input:last-child');

      if(!name.value || !newURL.value) {
        name.classList.toggle('empty');
        newURL.classList.toggle('empty');
        return;
      }

      url.innerHTML = name.value;
      url.href = newURL.value;

      DB.serials.forEach((serial, i) => {
        if(serial.id == target.parentNode.id) {
          DB.serials[i].url = newURL.value;
          DB.serials[i].name = name.value;
          localStorage.setItem('serials', JSON.stringify(DB));
        }
      });

      target.parentNode.removeChild(dialog);
    } else {
      let dialog = editDialog.cloneNode(true);
      DB.serials.forEach((serial, i) => {
        if(serial.id == target.parentNode.id) {
          dialog.querySelector('input:first-child').value = serial.name;
          dialog.querySelector('input:last-child').value = serial.url;
          target.parentNode.appendChild(dialog);
        }
      });
    }
    target.classList.toggle('active');
  });

  prevSeason.addEventListener('click', ({ target }) => {
    DB.serials.forEach((serial, i) => {
      if(serial.id == target.parentNode.parentNode.parentNode.id) {
        if(!DB.serials[i].season) DB.serials[i].season = 1;
        if(serial.season > 1) {
          season.textContent = --DB.serials[i].season;
          localStorage.setItem('serials', JSON.stringify(DB));
        }
      }
    });
  });

  nextSeason.addEventListener('click', ({ target }) => {
    DB.serials.forEach((serial, i) => {
      if(serial.id == target.parentNode.parentNode.parentNode.parentNode.id) {
        if(!DB.serials[i].season) DB.serials[i].season = 1;
        season.textContent = ++DB.serials[i].season;
        localStorage.setItem('serials', JSON.stringify(DB));
      }
    });
  });

  prevEpisode.addEventListener('click', ({ target }) => {
    DB.serials.forEach((serial, i) => {
      if(serial.id == target.parentNode.parentNode.parentNode.id) {
        if(!DB.serials[i].episode) DB.serials[i].episode = 1;
        if(serial.episode > 1) {
          episode.textContent = --DB.serials[i].episode;
          localStorage.setItem('serials', JSON.stringify(DB));
        }
      }
    });
  });

  nextEpisode.addEventListener('click', ({ target }) => {
    DB.serials.forEach((serial, i) => {
      if(serial.id == target.parentNode.parentNode.parentNode.parentNode.id) {
        if(!DB.serials[i].episode) DB.serials[i].episode = 1;
        episode.textContent = ++DB.serials[i].episode;
        localStorage.setItem('serials', JSON.stringify(DB));
      }
    });
  });
}

function createDeleteDialog() {
  let span = createElement('span', {}, 'Справді видалити?');
  let button = createElement('button', { className: 'button button-delete'}, 'Видалити');

  let div = createElement('div', { className: 'confirm-delete'}, span, button);
  return div;
}

function createEditDialog() {
  let name = createElement('input', {
    className: 'add-input input-edit',
    placeholder: 'Назва',
    type: 'text' });
  let url = createElement('input', {
    className: 'add-input input-edit',
    placeholder: 'Посилання',
    type: 'text' });

  let div = createElement('div', { className: 'edit-area'}, name, url);
  return div;
}

function createElement(tag, props, ...children) {
  const element = document.createElement(tag);

  Object.keys(props).forEach ( key => element[key] = props[key] );
  if (children.length > 0) {
    children.forEach (child => {
      if (typeof child === 'string') {
        child = document.createTextNode (child);
      }

      element.appendChild(child);
    });
  }

  return element;
}
