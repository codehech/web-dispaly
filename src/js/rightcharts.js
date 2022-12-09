// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import {LineChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
} from 'echarts/components';
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent,
  LineChart,
]);

function fontSize(res) {
    let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (!clientWidth) return;
    let fontSize = 100 * (clientWidth / 1920);
    return res * fontSize;
  }

let eLineConfig = (...arr) =>{
    let optionL
    optionL = {
      grid: {
        left: '10%',
        right: '10%',
        top: '20%',
        bottom: '30%'
      },
      tooltip: {
        trigger: 'axis',
        extraCssText: 'width:4vw;height:3vh;background:white;',
        textStyle: {
          "fontSize": fontSize(0.10)
        },
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          show: true,
          fontFamily: '微软雅黑',
          color: "#8EACE2",
          margin:fontSize(0.10),
          fontSize: fontSize(0.10)//28px就写0.28
        },
        grid: {
            x: 10,
            y: 1,
            x2: 0,
            y2: 0,
        },
        splitLine: { show: true, lineStyle: { color: ['#0079D2'], opacity: .2, width: 1, type: 'solid' } },
        data: arr[0].date
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          show: true,
          fontFamily: '微软雅黑',
          color: "#8EACE2",
          fontSize: fontSize(0.10)//28px就写0.28
        },
        splitLine: { show: false },
      },
      series: [
        {
          data: arr[0].count,
          type: 'line',
          lineStyle:{
            width:5,
            color:'#52CBF0'
          },
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 1,
              x2: 0,
              y2: 0,
              colorStops: [
                {
                  offset: .1,
                  color: '#011941' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#52CBF0' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        }
      ]
    }
    return optionL
  }
  

export default function echartRight(objArray){
    let optionL = new Array()
    let line = new Array()
    for (let index in objArray) {
        optionL[index] = eLineConfig(objArray[index].value);
        line[index] = echarts.init(document.getElementById(objArray[index]['idkey']));
        optionL[index] && line[index].setOption(optionL[index]);
    }
}