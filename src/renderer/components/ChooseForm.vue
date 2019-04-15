<template>
  <div id="wrapper">
    <img class="logo" src="https://www.susu.ru/sites/default/files/images/logo_46.png">
    <h1 class="pagetitle">Добавление расписания</h1>
    <b-dropdown v-model="selectedFaculty">
      <button class="button is-fullwidth" slot="trigger">
        <span v-if="selectedFaculty">{{selectedFaculty.name}}</span>
        <span v-else>Выберите факультет</span>
        <b-icon pack="fas" icon="caret-down" size="is-small"></b-icon>
      </button>
      <b-dropdown-item v-for="faculty in arrayOfFaculties" :value="faculty" @click="showFaculty()" :title="faculty.name">
        {{faculty.name}}
      </b-dropdown-item>
    </b-dropdown>
    <b-dropdown v-model="selectedCourse">
      <button class="button is-fullwidth" slot="trigger">
        <span v-if="selectedCourse">{{selectedCourse.course_number}} курс</span>
        <span v-else>Выберите курс</span>
        <b-icon pack="fas" icon="caret-down" size="is-small"></b-icon>
      </button>
      <b-dropdown-item v-for="group in unique(arrayOfGroups, 'course_number')" :value="group" @click="showFaculty()">
        {{group.course_number}} курс
      </b-dropdown-item>
    </b-dropdown>
    <b-dropdown v-model="selectedGroup">
      <button class="button is-fullwidth" slot="trigger">
        <span v-if="selectedGroup">{{selectedGroup.name}}</span>
        <span v-else>Выберите группу</span>
        <b-icon pack="fas" icon="caret-down" size="is-small"></b-icon>
      </button>
      <b-dropdown-item v-for="group in arrayOfGroups" v-if="group.course_number == selectedCourse.course_number" :value="group" @click="buttonHidden = false">
        {{group.name}}
      </b-dropdown-item>
    </b-dropdown>
    <button class="button is-fullwidth" :class='{ "is-hidden": buttonHidden }' @click= "loadSchedule()">
        <span>Готово</span>
      </button>
    <div class="field error">
      {{error}}
    </div>
  </div>
</template> 

<script>
export default {
  data () {
    return {
      error: '',
      loading: false,
      arrayOfFaculties: [],
      arrayOfGroups: [],
      selectedFaculty: '',
      selectedCourse: '',
      selectedGroup: '',
      buttonHidden: true
    }
  },
  methods: {
    makeRequest () {
      this.loading = true
      this.$electron.ipcRenderer.send('auth', this.login, this.password)
    },
    showFaculty () {
      this.$electron.ipcRenderer.send('getGroups', this.selectedFaculty.id)
    },
    loadSchedule () {
      this.$electron.ipcRenderer.send('getSchedule', this.selectedGroup)
    }
  },
  created: function () {
    this.$electron.ipcRenderer.on('showError', (e, error) => {
      this.loading = false
      this.error = error
    })
    this.$electron.ipcRenderer.send('getFaculties')
    this.$electron.ipcRenderer.on('setFaculties', (e, faculties) => {
      this.arrayOfFaculties = faculties
    })
    this.$electron.ipcRenderer.on('setGroups', (e, groups) => {
      this.arrayOfGroups = groups
    })
  },
  computed: {
    unique () {
      return function (arr, key) {
        var output = []
        var usedKeys = {}
        for (var i = 0; i < arr.length; i++) {
          if (!usedKeys[arr[i][key]]) {
            usedKeys[arr[i][key]] = true
            output.push(arr[i])
          }
        }
        return output
      }
    }
  }
}
</script>

<style type="text/css">
  #wrapper {
    padding: 10px 20px;
    height: 100vh;
    width: 100vw;
    text-align: center;
  }

  .field{
    max-width: 300px;
    margin: 0 auto;
  }

  .error{
    text-align: center;
  }

  .button, .input{
    font-weight: 300;
    margin-top: 6px;
  }

  .pagetitle{
    text-align: center;
    font-size: 14px;
    font-weight: 300;
    color: #B2B2B2 !important;
    margin-top: 20px;
    text-align: left;
  }

  .logo{
    margin-top: 50px;
    width: 150px;
    height: 150px;
    filter: invert(1) saturate(100%) brightness(200%);
  }
</style>