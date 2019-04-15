<template>
  <div id="main">
    <LoginForm v-if="!token"></LoginForm>
    <ChooseForm v-if="token && !schedule"></ChooseForm>
    <ScheduleForm v-if="schedule" v-bind:schedule='schedule' v-bind:group='group'></ScheduleForm>
  </div>
</template>

<script>
import LoginForm from './LoginForm'
import ChooseForm from './ChooseForm'
import ScheduleForm from './ScheduleForm'

export default {
  name: 'landing-page',
  components: { LoginForm, ChooseForm, ScheduleForm },
  data () {
    return {
      token: '',
      schedule: '',
      group: ''
    }
  },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    }
  },
  created: function () {
    var self = this
    this.$db.find({ 'access_token': { $ne: '' } }, function (err, docs) {
      if (err) {
        console.log(err)
      }
      if (docs.length === 0) {
        console.log('notFound')
        self.$electron.ipcRenderer.send('authDevice')
        self.$db.find({ 'access_token': '' }, function (err, docs) {
          if (err) {
            console.log(err)
          }
          if (docs.length === 0) {
            self.$db.insert([{'access_token': ''}], function (err, docs) {
              if (err) {
                console.log(err)
              }
              console.log(docs)
            })
          }
        })
      } else {
        self.token = docs[0].access_token
        self.$electron.ipcRenderer.send('setToken', docs[0].access_token)
      }
    })
    this.$electron.ipcRenderer.on('setToken', (e, token) => {
      self.token = token
      self.$db.update({ 'access_token': '' }, { 'access_token': token }, {})
      self.$electron.ipcRenderer.send('setToken', token)
    })
    this.$electron.ipcRenderer.on('setSchedule', (e, schedule, group) => {
      self.schedule = schedule
      self.group = group
      console.log(self.schedule)
    })
  }
}
</script>

<style lang="scss">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .dropdown {
  width: 100%;
  text-overflow: ellipsis;
    .dropdown-trigger {
      width: 100%
    }

    .button {
      display: flex;
      width: 100%;
      justify-content: space-between;

      span {
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    
    .dropdown-menu{
      width: 100%;
      max-height: 200px;
      overflow: scroll;
      border-radius: 4px;
      .dropdown-item{
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }    
  }

  .button, .input{
    background: linear-gradient(102deg, #262626 0%, #1A1A1A 100%);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15) !important;
    border-radius: 6px !important;
    height: 40px !important;
  }
</style>
