<template>
  <div class="container">
    <div class="add-new">
      <h2 class="add-header">{{ language.appHeader }}</h2>
      <button class="button-add button" @click="addButton" :class="{ active: addArea }">{{ language.addButton }}</button>
      <div class="add-area" v-if="addArea">
        <input class="add-input" :placeholder="language.namePlaceholder" type="text" v-model="addName">
        <input class="add-input" :placeholder="language.urlPlaceholder" type="text" v-model="addUrl">
      </div>
      <ul class="bookmarks" v-if="items.serials.length">
        <serial v-for="(item, index) in items.serials" :key="item.id" :item="item" @update="updateItem(index)" @delete="deleteItem(index)"></serial>
      </ul>
      <span v-else class="add-first-serial" v-html="language.addDesc"></span>
    </div>
  </div>
</template>

<script>
import Serial from './components/Serial.vue'

export default {
  name: 'app',
  components: {
    Serial
  },
  data: function() {
    return {
      items: {
        lastID: 0,
        lastUpdate: 0,
        serials: []
      },
      addArea: false,
      addName: '',
      addUrl: '',
      language: {
        appHeader: chrome.i18n.getMessage('appHeader'),
        addButton: chrome.i18n.getMessage('addButton'),
        namePlaceholder: chrome.i18n.getMessage('namePlaceholder'),
        urlPlaceholder: chrome.i18n.getMessage('urlPlaceholder'),
        addDesc: chrome.i18n.getMessage('addDesc')
      }
    }
  },
  methods: {
    loadItems () {
      chrome.storage.sync.get('serials', ({ serials }) => {
        if (!serials && localStorage.getItem('serials')) { // old versions migrate
          let local = JSON.parse(localStorage.getItem('serials'))
          this.items = local

          chrome.storage.sync.set({ 'serials': local }, () => {
            localStorage.removeItem('serials')
            this.saveItems()
          })
        } else {
          if (serials) this.items = serials
        }
      })
    },
    saveItems () {
      console.log('save:', this.items)
      chrome.storage.sync.set({ 'serials': this.items })
    },
    deleteItem (i) {
      this.items.serials.splice(i, 1)
    },
    updateItem (i) {
      this.items.serials[i].number = this.items.lastUpdate++
      this.items.serials.sort(function (a, b) {
        if (a.number > b.number) return -1
        if (a.number < b.number) return 1
        return 0
      })
    },
    addItem (name, url) {
      this.items.serials.unshift({
        id: this.items.lastID++,
        name: name,
        url: url,
        number: this.items.lastUpdate++,
        season: 1,
        episode: 1
      })
    },
    addButton () {
      if(!this.addArea) {
        this.addArea = true
        return false
      }
      if(!this.addName || !this.addUrl) {
        this.addArea = false
        return false
      }
      this.addItem(this.addName, this.addUrl)
      this.addArea = false
      this.addName = ''
      this.addUrl = ''
    }
  },
  watch: {
    items: {
      handler: function() {
        this.saveItems()
      },
      deep: true
    }
  },
  created: function() {
    this.loadItems()
  }
}
</script>

<style>
body {
  width: 500px;
  margin: 10px;
  position: relative;
  font-family: 'Roboto', sans-serif;
  transition: all 0.1s;
}

body::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

body::-webkit-scrollbar-thumb {
  background: rgba(50, 50, 50, 0.6);
  border-radius: 10px;
}

body::-webkit-scrollbar-thumb:hover {
  background: rgba(50, 50, 50, 0.7);
}

.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

.add-header {
  margin: 10px 0 15px 0;
  padding-top: 5px;
}

.button-add {
  position: absolute;
  top: 0;
  right: 0;
}

.button-add:hover {
  background-color: #BBBBBB;
}

.button-add.active {
  background-color: rgb(100, 215, 97);
}

.button-add.active:hover {
  background-color: rgb(79, 182, 77);
}

.button {
  background-color: #DDDDDD;
  box-shadow: 1px 1px 3px 0px rgb(80, 80, 80);
  padding: 10px 20px;
  text-transform: uppercase;
  border-radius: 1px;
  cursor: pointer;
  outline: none;
  border: none;
  transition: 0.2s;
  font-weight: bold;
  color: #222222;
}

.button-delete {
  margin-left: 20px;
}

.button-delete:hover {
  background-color: #BBBBBB;
}

.button:active {
  box-shadow: none;
}

.confirm-delete {
  text-align: center;
  padding-bottom: 10px;
}

.add-input {
  padding: 5px 10px;
  margin: 5px 0;
  outline: none;
  border: none;
  height: 50px;
  width: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 20px;
  font-family: 'Roboto', sans-serif;
  box-shadow: 1px 1px 3px 0px rgb(80, 80, 80);
}


.bookmarks {
  list-style: none;
  margin: 0;
  padding: 0;
}

.bookmarks li {
  box-shadow: none;
  position: relative;
}

.bookmarks a {
  text-decoration: none;
  color: #363636;
  font-size: 20px;
  display: inline-block;
  width: 275px;
  padding: 10px 10px;
}

.control-buttons {
  position: absolute;
  /*position: relative;*/
  display: inline-block;
  right: 140px;
}

.edit, .delete {
  transition: 0.1s;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: inline-block;
  margin-top: 5px;
  background: url("../img/edit.svg") 4px 4px no-repeat;
  transform: scale(0);
}

.delete {
  background: url("../img/delete.svg") 4px 4px no-repeat;
  margin-left: 5px;
}

.bookmarks li:hover .edit,
.bookmarks li:hover .delete {
  transform: scale(1);
}

.delete:hover,
.edit:hover {
  background-color: #DDDDDD;
}

.bookmarks li:hover {
  box-shadow: 1px 1px 3px 0px rgb(80, 80, 80);
}

.edit.active,
.delete.active {
  border-radius: 1px;
  background-color: #BBBBBB;
}

.input-edit {
  width: 96%;
  margin: 0 10px 10px 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.confirm-delete span {
  font-size: 18px;
}

.season-and-episode {
  position: absolute;
  right: 0;
  padding: 5px;
  transition: .1s;
  cursor: default;
  user-select: none;
  display: inline-block;
}

.episode, .prev, .number-and-next, .next {
  display: inline-block;
  font-size: 26px;
}

.episode .prev {
  transition: .1s;
  transform: scale(0);
  border-radius: 1px;
  cursor: pointer;
  padding: 0 3px;
  font-weight: bold;
}

.episode:hover .prev {
  transform: scale(1);
}

.episode .number-and-next span.season-number::before {
  content: 's';
  color: #333333;
}
.episode .number-and-next span.episode-number::before {
  content: 'e';
  color: #333333;
}

.episode .prev:hover {
  background-color: #DDDDDD;
}

.episode .number-and-next {
  position: relative;
}

.episode .number-and-next span {
  display: inline-block;
}

.episode .number-and-next:hover .next {
  opacity: 0.85;
}

.episode .next {
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border-radius: 1px;
  background-color: #DDDDDD;
  cursor: pointer;
  opacity: 0;
  font-weight: bold;
}

.add-first-serial {
  font-size: 18px;
}
.add-first-serial.hide {
  display: none;
}
</style>