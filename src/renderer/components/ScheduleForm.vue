<template>
  <div id="wrapper">
    <span class="pagetitle">Расписание</span>
    <span class="group">{{group.name}}</span>
    <div class="add">
      <b-icon pack="fas" icon="plus" size="is-small"></b-icon>
    </div>
    <div class="field has-addons">
      <p class="control">
        <a class="button week first" :class="{ active: week == 1 }" @click="week = 1">
          <span>I неделя</span>
        </a>
      </p>
      <p class="control">
        <a class="button week second" :class="{ active: week == 2 }" @click="week = 2">
          <span>II неделя</span>
        </a>
      </p>
    </div>
    <div v-for="i in 6">
      <b-collapse :open="false" class="weekday">
      <button class="button" slot="trigger">
        {{weekday[i-1]}}
      </button>
        <div class="notification">
          <div class="content">              
              <div class="lesson" v-for="day in orderBy(schedule, 'pair_number')" v-if="day.week_day == i && day.term_part == 1 && (day.week_number == week || day.week_number == 0)">
                <span class="timeStart">08<span class="little">00</span></span>
                <span class="timeEnd">09:45</span>
                <span class="subjectName">{{day.subject_name}}</span>
                <span class="tutorName">{{day.lastname}} {{day.firstname}} {{day.middlename}}</span>
                <span class="type">{{day.event_type}}</span>
                <span class="place">{{day.room}}/{{day.building}}</span>
              </div>
          </div>
        </div>
      </b-collapse>
    </div>
  </div>
</template> 

<script>
export default {
  props: ['schedule', 'group'],
  data () {
    return {
      weekday: [
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
        'Воскресенье'
      ],
      week: 1
    }
  },
  filters: {
    myFilter: function (val) {
      return val.week_day === 1
    }
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    enter: function (el, done) {
      el.style.opacity = 1
    },
    leave: function (el, done) {
    }
  }
}
</script>

<style type="text/css">
  #wrapper {
    height: 100vh;
    width: 100vw;
    padding: 10px 20px;
  }

  .button, .input{
    transition: all .2s ease-in;
    box-shadow: none !important;
  }

  .input:hover, .input:focus, .input:active{
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15) !important;
    transform: scale(1.02);
    transition: all .2s ease-in;
  }

  span.group{
    font-size: 42px;
    font-weight: bold;
  }
  
  .button{
    width: 100%;
  }

  .field{
    max-width: inherit;
    margin: 0;
  }

  .field .control{
    width: 50%;
  }

  .subjectName{
    font-size: 18px;
    font-weight: 500;
    grid-column-start: 2;
    text-align: left;
  }

  .place{
    grid-column-start: 3;
    grid-row-start: 1;
    text-align: center;
    font-weight: 500;
    font-size: 18px;
  }

  .tutorName{
    font-size: 13px;
    grid-column-start: 2;
    text-align: left;
  }

  .type{
    font-size: 13px;
    grid-column-start: 2;
    grid-column-end: 4;
    background: #141414;
    border-radius: 4px;
    padding: 0px 6px;
    margin-right: auto;
    margin-bottom: auto;
  }

  .notification .content .lesson{
    display: grid;
    grid-template-columns: 80px 1fr 80px;
    grid-template-rows: 1fr 20px 25px;
  }

  .timeStart, .timeEnd{
    grid-column-start: 1;
    grid-row-start: 1;
    text-align: center;
    font-weight: 500;
  }

  .timeStart{
    font-size: 22px;
  }

  .timeEnd{
    font-size: 18px;
    font-weight: 300;
    margin-top: 22px;
  }

  .little{
    font-size: 16px;
  }

  .lesson{
  }

  .week.first{
    border-radius: 6px 0px 0px 6px !important;
  }

  .week.second{
    border-radius: 0px 6px 6px 0px !important;
  }
  
  .week:hover{
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15) !important;
    transform: scale(1.02);
    transition: all .2s ease-in;
  }
  
  .pagetitle{
    font-size: 18px;
  }

  .group{
    font-weight: 500 !important;
    line-height: 54px;
    margin-bottom: 30px;
  }
  
  .pagetitle, .group{
    display: block;
    text-align: left;
  }

  .field{
    margin-bottom: 4px !important;
  }

  .add{
    background: #FFFFFF;
    color: #B2B2B2;
    border-radius: 30px;
    width: 30px;
    height: 30px;
    position: absolute;
    top: 30px;
    right: 30px;
    transition: all .2s ease-in;
    cursor: pointer;
  }

  .add:hover{
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.8) !important;
    transform: scale(1.1);
    transition: all 0.3s ease-in;
  }

  .add i{
    padding-top: 14px;
  }
</style>