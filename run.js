'use strict';
const args = process.argv.slice(2);
const path = './'+args[0];
let input = require(path);
const fs = require('fs');

const schedule = () => {
  if(!input) return [];
  let data = input.map(i => {
    i.start = new Date(i.start);
    i.finish = new Date(i.finish);
    return i;
  }).sort((a, b) => b.priority - a.priority);
  let result = [{
    band : data[0].band,
    start : data[0].start,
    finish : data[0].finish
  }];
  for (let i = 1; i < data.length; i++) {
    result = rebase_result(result, data[i]);
  }
  console.log(result);
  return result;
}

const rebase_result = (result,event) => {
  const temp_start = getStartDate(result);
  const temp_finish = getFinishDate(result);
  const temp_event = {
    band : event.band,
    start : event.start,
    finish : event.finish
  };
  if(event.finish < temp_start) return result.concat(temp_event);
  if(event.start > temp_finish) return result.concat(temp_event);
  if(event.start < temp_start) {
    result = result.concat({
      band : event.band,
      start : event.start,
      finish : temp_start
    })
  }
  if(event.finish > temp_finish) {
    result = result.concat({
      band : event.band,
      start : temp_finish,
      finish : event.finish
    })
  }
  return result.sort((a, b) => a.start - b.start);
}

const getStartDate = (array) => {
  return array[0].start;
}
const getFinishDate = (array) => {
  return array.sort((a, b) => b.finish - a.finish)[0].finish;
}
const nameArray = args[0].split(".");
const newFile = nameArray[0] + '.optimal.json.expected';
fs.writeFileSync(newFile, JSON.stringify(schedule()));;