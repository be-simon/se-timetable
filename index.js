import { majors, tags } from "./major.js"

const width = 90
const height = 70
const dayList = ['mon', 'tue', 'wed', 'thu', 'fri']
const url = 'http://ec2-54-234-194-108.compute-1.amazonaws.com:8000/'
const colors = ['#ED8975', '#8FB9AA', '#F2D096', '#6FC7E1', '#9ec2e6', '#b8e6bf', '#ffa4b4']


const timetable = document.getElementById('timetable')
dayList.forEach(d => {
  timetable.appendChild(getDayColumn(d))
})

const timebar = document.getElementById('timebar')
for (var i = 0; i < 10; i++) {
  const timediv = document.createElement('div')
  timediv.classList.add('timebar_element')
  
  timediv.textContent = i + 9
  timediv.style.textAlign = 'right'
  timebar.appendChild(timediv)
}

const dayIndex = {
  '월': 0,
  '화': 1,
  '수': 2,
  '목': 3,
  '금': 4
}


const selectMajorDOM = document.querySelector('.select_major')
majors.forEach(m => {
  const option = document.createElement('option')
  option.text = m
  option.value = m
  selectMajorDOM.appendChild(option)
})

const selectTagDOM = document.querySelector('.select_tag')
tags.forEach(t => {
  const option = document.createElement('option')
  option.text = t
  option.value = t
  selectTagDOM.appendChild(option)
})

const gradeDOM = document.getElementById('input_grade')
const minCreditDOM = document.getElementById('min_credit')
const maxCreditDOM = document.getElementById('max_credit')
const minMajorCreditDOM = document.getElementById('min_major_credit')
const submitBtn = document.getElementById('submit_btn')
submitBtn.addEventListener('click', () => {
  const params = {
    major: selectMajorDOM.value,
    grade: parseInt(gradeDOM.value),
    max_credit: parseInt(maxCreditDOM.value),
    min_credit: parseInt(minCreditDOM.value),
    min_major_credit: parseInt(minMajorCreditDOM.value),
    major_list: [],
    ge_list: [],
  }

  console.log(params)
  fetch(url + 'timeline/recommend/', {
    method: "POST",
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
  .then(res => res.json())
  .then(data => {
    console.log(data)
    Array.from(data)[1].forEach((d, i) => {
      const c = {...d, 'color': colors[i]}
      addBlock(c)
    })
  })
  .catch(e => console.log(e))
})


function getDayColumn (day) {
  const column = document.createElement('div')
  column.classList.add(day)
  for (var i = 0; i < 10; i++) {
    const hourDiv = document.createElement('div')
    hourDiv.classList.add('hour')
    column.appendChild(hourDiv)
  }
  
  return column
}

function addBlock(classInfo) {
  classInfo.session.forEach(session => {
    const block = getBlockFromSession(session)
    addClassInfo(block, classInfo)
    const parent = document.getElementById('timetable').children[(dayIndex[session[0]])]
    parent.appendChild(block)
  })
}

function addClassInfo(block, classInfo) {
  const className = document.createElement('h5')
  const classPlace = document.createElement('h6')

  className.textContent = classInfo.name
  if (classInfo.place.split(',').length) 
    classPlace.textContent = classInfo.place.split(',')[0]
  else
    classPlace.textContent = classInfo.place

  block.appendChild(className)
  block.appendChild(classPlace)

  block.style.backgroundColor = classInfo.color
}

function getBlockFromSession(session) {
  const timecodeArray = session[1]
  const interval = getTimeInterval(timecodeArray)
  const startHour = parseInt(timecodeArray[0].split('T')[1].split(':')[0], 10)
  const startMin = parseInt(timecodeArray[0].split('T')[1].split(':')[1], 10)
  
  const block = document.createElement('div')
  block.style.width = width.toString() + 'px'
  block.style.height = ((interval / 60) * height).toString() + 'px'
  block.classList.add('timeblock')
  
  block.style.top = ((startHour - 9) * height + startMin / 60 * height).toString() + 'px'
  
  return block
}

function getTimeInterval(timecodeArray) {
  const start = timecodeArray[0].split('T')[1].split(':').map(t => parseInt(t, 10))
  const end = timecodeArray[1].split('T')[1].split(':').map(t => parseInt(t, 10))
  const interval = (end[0] * 60 + end[1]) - (start[0] * 60 + start[1])
  
  return interval
}