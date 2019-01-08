<template>
  <li>
    <a :href="item.url" class="url" target="_blank" @click="reorder">{{ item.name }}</a>
    <div class="season-and-episode">
      <div class="episode se">
        <div class="prev" @click="season--">-</div>
        <div class="number-and-next">
          <span class="season-number">{{ season | addNull }}</span>
          <div class="next" @click="season++">+</div>
        </div>
      </div>
      <div class="episode ep">
        <div class="prev" @click="episode--">-</div>
        <div class="number-and-next">
          <span class="episode-number">{{ episode | addNull }}</span>
          <div class="next" @click="episode++">+</div>
        </div>
      </div>
    </div>
    <div class="control-buttons">
      <div class="delete" :class="{ active: showDelete }" @click="showDelete = !showDelete"></div>
      <div class="edit" :class="{ active: showEdit }" @click="showEdit = !showEdit"></div>
    </div>

    <div class="edit-area" v-if="showEdit">
      <input class="add-input input-edit" v-model="item.name" :placeholder="language.namePlaceholder" type="text">
      <input class="add-input input-edit" v-model="item.url" :placeholder="language.urlPlaceholder" type="text">
    </div>
    <div class="confirm-delete" v-if="showDelete">
      <span>{{ language.deleteAsk }}</span>
      <button class="button button-delete" @click="deleteItem">{{ language.deleteConfirm }}</button>
    </div>
  </li>
</template>

<script>

  export default {
    name: 'serial',
    props: ['item'],
    data: function() {
      return {
        showEdit: false,
        showDelete: false,
        language: {
          namePlaceholder: chrome.i18n.getMessage('namePlaceholder'),
          urlPlaceholder: chrome.i18n.getMessage('urlPlaceholder'),
          deleteAsk: chrome.i18n.getMessage('deleteAsk'),
          deleteConfirm: chrome.i18n.getMessage('deleteConfirm'),
        }
      }
    },
    computed: {
      season: {
        get () {
          return this.item.season ? this.item.season : 1
        },
        set (data) {
          if(data < 1) return false
          this.item.season = data
          this.item.episode = 1
        }
      },
      episode: {
        get () {
          return this.item.episode ? this.item.episode : 1
        },
        set (data) {
          this.item.episode = data
        }
      }
    },
    methods: {
      deleteItem () {
        this.$emit('delete')
      },
      reorder () {
        this.$emit('update')
      }
    },
    watch: {
      showEdit (x) {
        if(x) this.showDelete = false
      },
      showDelete (x) {
        if(x) this.showEdit = false
      }
    },
    filters: {
      addNull (number) {
        return (number > 9) ? number : '0' + number
      }
    }
  }

</script>