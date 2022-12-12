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

let eLineConfig_a = (...arr) =>{
    let optionL
    optionL = {
      grid: {
        left: '5%',
        right: '5%',
        top: '20%',
        bottom: '10%',
        containLabel: true
      },
      tooltip: {
        padding: [50, 50],
        trigger: 'axis',
        extraCssText: 'width:4vw;height:4vh;background:#053E6E;border:none;border-radius:1rem;',
        textStyle: {
          "fontSize": fontSize(0.10),
          "color": '#fff'
        },
        // axisPointer: {
        //   type: 'shadow'
        // }
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
        data: arr[0].name
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
      legend: {
        itemWidth: 50,
        orient: 'horizontal',
        icon:'rect',
        data:[{
          name:'投诉声量',
          textStyle: {fontWeight: 'normal', color: '#22FFE2'}
        },{
          name: '舆情声量',
          textStyle: {fontWeight: 'normal', color: '#A68BFF'}
          }],
        x:'center',      //可设定图例在左、右、居中
        y:'bottom',     //可设定图例在上、下、居中
        padding:[1,0,0,0],   //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
        itemGap: 200,
        itemHeight: 20,
        textStyle: {
          "fontSize": fontSize(0.10),
          "padding": 20
        },
      },
      series: [
        {
          name: '舆情声量',
          data: arr[1].value,
          type: 'line',
          lineStyle:{
            width:5,
            color:'#A68BFF'
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
        },
        {
          name: '投诉声量',
          data: arr[0].value,
          type: 'line',
          lineStyle:{
            width:5,
            color:'#22FFE2'
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
        },
      ]
    }
    return optionL
  }
  

export default function eChartsDetail(...objArray) {
    let lintFt_a =  echarts.init(objArray[0]);
    let optionLa = eLineConfig_a(objArray[1][0],objArray[1][1]);
    optionLa && lintFt_a.setOption(optionLa); 
}