import $ from 'jquery'
import "./css/index.less"
import eChartsFn from './js/action'
import echartRight from './js/rightcharts'
import eChartsDetail from './js/detail'
let pageValue = {}
const domain = /* document.domain || */ "//172.18.70.45:81"

$(function () {

  // 补零函数
  function JoinZero(num) {
    return num < 10 ? '0' + num : num;
  }
  // 获取时间
  function getTime(date) {
    let time = (date == null ? new Date() : new Date(date));
    let y = time.getFullYear();
    let m = JoinZero(time.getMonth() + 1);
    let d = JoinZero(time.getDate());
    let h = JoinZero(time.getHours());
    let mi = JoinZero(time.getMinutes());
    let s = JoinZero(time.getSeconds());
    /* 	return `${y}-${m}-${d}-${h}-${mi}-${s}`; */
    return { date: `${y}-${m}-${d}`, time: `${y}-${m}-${d} ${h}:${mi}:${s}` };
  }

  function Percentage(num, total) {
    if (num == 0 || total == 0) {
      return 0;
    }
    return (Math.round(num / total * 10000) / 100.00);// 小数点后两位百分比
  }

  const dataSourceObj = {
    information: 'zixun',
    social: 'shejiao',
    bbs: 'luntan',
    search: 'sousuo',
    msg: 'xinxiliu',
    tieba: 'tieba',
    phone: 'rexian',
    app: 'l_app',
    hswz: 'hanshan',
    xinfang: 'xinfang'
  }
  const citySourceObj = [{
    id: 1, name: '姑苏区', css: 'gs'
  },
  {
    id: 2, name: '吴中区', css: 'wz'
  }, {
    id: 3, name: '太仓', css: 'tc'
  }, {
    id: 4, name: '常熟', css: 'cs'
  }, {
    id: 5, name: '张家港', css: 'zjg'
  }, {
    id: 6, name: '相城区', css: 'xc'
  }, {
    id: 7, name: '吴江区', css: 'wj'
  }, {
    id: 8, name: '高新区', css: 'gx'
  }, {
    id: 9, name: '工业园区', css: 'yq'
  }, {
    id: 10, name: '昆山市', css: 'ks'
  }]

  let now = new Date()
  $('#todaySource').text('今日数据 ' + getTime(now).date)
  $('#center_title').text('最新预警时间： ' + getTime(now).time)

  let ss_chart = document.getElementById('ss_chart')
  let r_chart = document.getElementById('r_chart')
  let t_chart_f = document.getElementById('t-chart-f')
  $.ajax({
    url: domain + '/dev-api/largeScreen',
    type: 'GET',
    data: {},
    dataType: 'json',
    async: true,
    cache: false,
    success: function () {

    },
    error: function () {
      alert('error')
    }
  }).then((d) => {
    if (d.code == 200) {
      let v = d.data || null

      let warningSource = new Array()
      $.each(v.warning, function (i, v) {
        let html = [
          `<a href="javascript:void(0)" data-title="${v.type}" data-id='${v.id}'>
                        <div class="${v.level == '高' ? 'hot' : v.level == '中' ? 'middle' : 'low'}">
                            <dl>
                                <dt><span>${v.type}</span><span class="s_r_fx">预警级别：${v.level}</span></dt>
                                <dd>
                                    <h4>${v.title}</h4>
                                    <ol>
                                        <li class="_s"><em></em>民声诉求：${v.appealCount}</li>
                                        <li class="_s"><em></em>网络舆情：${v.sentimentCount}</li>
                                        <li><em></em>涉事主体：${v.company}</li>
                                        <li><em></em>推送指令状态：${v.status}</li>
                                    </ol>
                                </dd>
                            </dl>
                        </div>
                    </a>`
        ].join('')
        warningSource.push(html)
      })
      $('#center_content').html(warningSource)

      //数据来源统计内容
      let dataSource = new Array()
      $.each(v.dataSource, function (i, v) {
        let html = [
          '<li class="' + dataSourceObj[v.type] + '">',
          '<span class="ti">' + v.value + '</span>',
          '<span>' + v.name + '</span>',
          '</li>',
        ].join('')
        dataSource.push(html)
      })
      $('#t_j_list').html(dataSource)
      //首页其余图表数据
      let areaCharName = new Array()
      let areaCharValue = new Array()
      let companiesCharName = new Array()
      let companiesCharValue = new Array()
      let governmentCharName = new Array()
      let governmentCharValue = new Array()
      let areaSource = new Array() //左下角区域地图数据专用
      let newAreaCharArray = new Array()

      let soundsCount = 0;
      $.each(v.sounds, function (i, v) {
        newAreaCharArray.push(v.value)
        newAreaCharArray.sort(function (a, b) {
          return b - a
        });
        soundsCount += v.value
      })

      $.each(v.sounds, function (i, v) {
        areaCharName.push(v.name)
        areaCharValue.push(v.value)
        let idName = citySourceObj[i].id == v.id ? citySourceObj[i].css : ''
        let charHeight = 0;
        soundsCount && !isNaN(soundsCount) ? charHeight = Percentage((v.value),soundsCount) : 0
        charHeight = charHeight + '%'
        let showName = parseFloat(v.value)>=newAreaCharArray[2]?'display:block':'display:none'
        let html = [
          `<div class="l1" id="${idName}">
                        <div>
                            <div style="height: ${charHeight};">
                                <div class="flag" style="${showName}">
                                    <p class="text">${v.name}</p>
                                    <p class="text_1">${v.value}</p>
                                </div>
                                <div class="flex-col"></div>
                            </div>
                        </div>
                    </div>`
        ].join('')
        areaSource.push(html)
      })
      $('#map').html(areaSource)

      $.each(v.companies, function (i, v) {
        companiesCharName.push(v.name)
        companiesCharValue.push(v.value)
      })
      $.each(v.government, function (i, v) {
        governmentCharName.push(v.name)
        governmentCharValue.push(v.value)
      })
      //图表程序入口
      eChartsFn([
        { obj: ss_chart, data: { name: companiesCharName, value: companiesCharValue } },
        { obj: r_chart, data: { name: governmentCharName, value: governmentCharValue } },
        { obj: t_chart_f, data: { name: areaCharName, value: areaCharValue } }
      ])

      //右侧图表专用数据
      let rightCharStr = new Array();
      let rightCharObjD = new Array();
      $.each(v.words, function (i, v) {
        let html = [
          '<div class="' + (i == 0 ? 'r-li-f' : i == 1 ? 'r-li-s' : 'r-li-t') + '">',
          '<span class="r-l">' + v.word + '</span><span class="r-r">声量：' + (v.count.slice(-1) || 0) + '</span>',
          '<div class="linbox" id="hs_' + i + '"></div>',
          '</div>',
        ].join('');
        if (i < 3) {
          rightCharStr.push(html)
          rightCharObjD.push({ idkey: 'hs_' + i, value: v })
        }
      })
      $('#rightCharts').html(rightCharStr)
      echartRight(rightCharObjD)
    } else {
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