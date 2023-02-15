// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart, LineChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
} from 'echarts/components'
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent,
  LineChart,
])

function fontSize (res) {
  let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (!clientWidth) return
  let fontSize = 100 * (clientWidth / 1920)
  return res * fontSize
}


let echartConfig = (...array) => {
  let option
  // let style = array[3] || {
  //   left: '-20%',
  //   right: '5%',
  //   top: '0',
  //   bottom: '1%',
  //   containLabel: true
  // }
  let style = array[3] || {
    left: '5%',
    right: '5%',
    top: '0',
    bottom: '3%',
    containLabel: true
  }
  option = {
    title: {
      text: ''
    },
    textStyle: {
      fontWeight: 300,
      fontSize: 26,    //文字的字体大小
      color: '#8EACE2'//文字的字体颜色
    },
    tooltip: {
      trigger: 'axis',
      extraCssText: 'width:auto;height:5.5vh;background:white;',
      textStyle: {
        "fontSize": fontSize(0.08)
      },
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        return `<div style="display:block;word-break: break-all;word-wrap: break-word;white-space:pre-wrap;color:#000">${params[0].name} <p style="padding-top:.1vh">${params[0].value}</p></div>`
      }
    },
    grid: style,
    xAxis: {
      axisLabel: {
        show: true,
        fontFamily: '微软雅黑',
        color: "#8EACE2",
        opacity: array[4],
        fontSize: fontSize(0.08)//28px就写0.28
      },
      axisLine: {
        show: true
      },
      type: 'value',
      boundaryGap: [0, 0.01],
      splitLine: { show: true, lineStyle: { color: ['#0079D2'], opacity: .4, width: 1, type: 'solid' } },
    },
    yAxis: {
      axisLabel: {
        show: true,
        fontFamily: '微软雅黑',
        color: "#fff",
        // margin: 180,//刻度标签与轴线之间的距离。
        // left: -8,//整个echart位置
        // textStyle: {
        //   align: 'left' 
        //   baseline:"top",
        // },
        // lineHeight: fontSize(0.2),    // 行高 ）
        fontSize: fontSize(0.08)//28px就写0.28
      },
      type: 'category',
      data: array[0].name
    },
    barWidth: fontSize(0.05),
    series: [
      {
        type: 'bar',
        data: array[0].value,
        itemStyle: {
          //barBorderRadius: [10, 10, 0, 0],
          color: new echarts.graphic.LinearGradient(
            0, 0, 1, 0,
            [
              { offset: 0, color: array[1] },
              { offset: 1, color: array[2] }
            ]
          )
        },
      }
    ]
  }
  return option
}


export default function eChartsFn (objArray) {
  let ssChart = echarts.init(objArray[0].obj)
  let option = echartConfig(objArray[0].data, '#0A1C37', '#4ECFF6', '', "1")
  option && ssChart.setOption(option)

  let rrChart = echarts.init(objArray[1].obj)
  let option2 = echartConfig(objArray[1].data, '#0A1C37', '#4ECFF6', {
    left: '5%',
    right: '5%',
    top: '0',
    bottom: '3%',
    containLabel: true
  }, "0")
  option2 && rrChart.setOption(option2)

  let lfChart = echarts.init(objArray[2].obj)
  let option3 = echartConfig(objArray[2].data, '#0A1C37', '#1CDE7D', {
    left: '8%',
    right: '8%',
    top: '2%',
    bottom: '0',
    containLabel: true
  }, "0")
  option3 && lfChart.setOption(option3)

}