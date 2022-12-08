import $ from 'jquery'
import "./css/index.less"
import eChartsFn from './js/action'
import eChartsDetail from './js/detail'
let pageValue = {}
$(function () {

  $.ajax({
    url: 'http://172.18.70.45:81/dev-api/largeScreen',
    type: 'GET',
    data: {},
    dataType: 'json',
    async: true,
    cache: false,
    success: function (e) {
      console.log(e)
    },
    error: function () {
      alert('error')
    }
  })



  $('#center_content').off().on('click', function () {
    let title = $(this).data('title');
    pageValue.ti = title;
    $('#box-alert').css('visibility', 'visible')
    eChartsDetail([document.getElementById('linchar_a')])
  })
  $('#close').off().on('click', function () {
    $('#box-alert').css('visibility', 'hidden')
  })
})
eChartsFn([document.getElementById('ss_chart'), document.getElementById('r_chart'),
document.getElementById('t-chart-f'), document.getElementById('hs'), document.getElementById('hm'), document.getElementById('tq')])
//eChartsFn($('#ss_chart'))
if (module.hot) {
  module.hot.accept(['./js/math', './js/action'], function () {
    //更新文件模块后执行操作
  })
}

function changeToPercent(num) {
  if (!/\d+\.?\d+/.test(num)) {
    alert("必须为数字");
  }
  let result = (num * 100).toString(),
    index = result.indexOf(".");
  if (index == -1 || result.substr(index + 1).length <= 4) {
    return result + "%";
  }
  return result.substr(0, index + 5) + "%";
}
console.log(changeToPercent(200 / 400))

export default function pageValueS() {
  return pageValue
}