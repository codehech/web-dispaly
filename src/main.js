import $ from 'jquery'
import "./css/index.less"
import eChartsFn from './js/action'

$(function(){
 
})
eChartsFn([document.getElementById('ss_chart'),document.getElementById('r_chart'),
document.getElementById('t-chart-f'),document.getElementById('hs'),document.getElementById('hm'),document.getElementById('tq')
])
//eChartsFn($('#ss_chart'))
if (module.hot) {
  module.hot.accept(['./js/math','./js/action'],function(){
    //更新文件模块后执行操作
  })
}