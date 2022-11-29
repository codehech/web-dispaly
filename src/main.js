import sum from './js/sum'
import "./css/index.css"
import "./css/index.less"
import eChartsFn from './js/action'


console.log(sum(1,2,3,4,5,6))
eChartsFn(document.getElementById('main'))
if (module.hot) {
  module.hot.accept(['./js/sum','./js/action'],function(){
    //更新文件模块后执行操作
  })
}