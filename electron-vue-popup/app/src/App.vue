<template lang="pug">
  div
    button(@click="openNewPopup()") 새 팝업 열기
    button(@click="getAllPopup()") 모든 팝업 열기
    button(@click="closeAllPopup()") 모든 팝업 닫기
    button(@click="showAllPopup()") 모든 팝업 보기
    button(@click="hideAllPopup()") 모든 팝업 숨기기


</template>

<script>
  import { ipcRenderer } from 'electron'
  import uuid from 'uuid'

  ipcRenderer.on('response-all-popups', (event, args) => {
    console.log('after response all popup')
    console.log(args)
  })

  export default {
    created () {
      console.log('created')
    },
    data: function () {
      return {
        popupIds: []
      }
    },
    methods: {
      openNewPopup: function () {
        const id = uuid()
        this.popupIds.push(id)
        ipcRenderer.send('open-new-popup', {
          id: id
        })
      },
      getAllPopup: function () {
        ipcRenderer.send('request-all-popups')
      },
      showAllPopup: function () {
        ipcRenderer.send('show-all-popups')
      },
      hideAllPopup: function () {
        ipcRenderer.send('hide-all-popups')
      },
      closeAllPopup: function () {
        ipcRenderer.send('close-all-popups')
      }
    }
  }
</script>
