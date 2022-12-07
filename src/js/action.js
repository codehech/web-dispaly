// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart,LineChart } from 'echarts/charts';
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
  BarChart,
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


let echartConfig = (...array) => {
  let option;
  let style = array[3] || {
    left: '8%',
    right: '8%',
    top: '26%',
    bottom: '15%',
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
      extraCssText: 'width:4vw;height:3vh;background:white;',
      textStyle: {
        "fontSize": fontSize(0.10)
      },
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: style,
    xAxis: {
      axisLabel: {
        show: true,
        fontFamily: '微软雅黑',
        color: "#8EACE2",
        fontSize: fontSize(0.10)//28px就写0.28
      },
      type: 'value',
      boundaryGap: [0, 0.01],
      splitLine: { show: true, lineStyle: { color: ['#0079D2'], opacity: .2, width: 1, type: 'solid' } },
    },
    yAxis: {
      axisLabel: {
        show: true,
        fontFamily: '微软雅黑',
        color: "#8EACE2",
        fontSize: fontSize(0.10)//28px就写0.28
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
  };
  return option;
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
    series: [
      {
        data: arr[0].value,
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
      itemHeight: 10,
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

export default function eChartsFn(objArray) {
  let ssChart = echarts.init(objArray[0]);
  let option = echartConfig({ name: ['光明乳业', '金鑫物业', '中一建集团', '华莱士餐饮', '万和物业'], value: [40, 60, 80, 75, 90] }, '#0A1C37', '#4ECFF6');
  option && ssChart.setOption(option);

  let rrChart = echarts.init(objArray[1]);
  let option2 = echartConfig({ name: ['市司法局', '市中级法院', '市公安局', '市发改委', '市发改委'], value: [10, 60, 30, 40, 70] }, '#0A1C37', '#4ECFF6');
  option2 && rrChart.setOption(option2);

  let lfChart = echarts.init(objArray[2]);
  let option3 = echartConfig({ name: ['昆山市', '太仓市', '张家港市', '吴中区', '工业园区', '高新区', '常熟市', '姑苏区', '吴江区', '相城区'], value: [10, 20, 30, 40, 50, 60, 70, 80, 90, 99] }, '#0A1C37', '#1CDE7D', {
    left: '8%',
    right: '8%',
    top: '16%',
    bottom: '5%',
    containLabel: true
  });
  option3 && lfChart.setOption(option3);


  let optionLf = eLineConfig({name:[
    '12.11',
    '12.12',
    '12.13',
    '12.14',
    '12.15'
  ],value:[
    80, 20, 40, 30, 10
  ]});
  let lineF = echarts.init(objArray[3]);

  optionLf && lineF.setOption(optionLf);

  let optionLs = eLineConfig({name:[
    '12.11',
    '12.12',
    '12.13',
    '12.14',
    '12.15'
  ],value:[
    10, 20, 40, 80, 10
  ]});
  let lineFs = echarts.init(objArray[4]);

  optionLs && lineFs.setOption(optionLs); 

  let optionLt = eLineConfig({name:[
    '12.11',
    '12.12',
    '12.13',
    '12.14',
    '12.15'
  ],value:[
    10, 30, 80, 20, 10
  ]});
  let lineFt = echarts.init(objArray[5]);

  optionLt && lineFt.setOption(optionLt); 


  let lintFt_a =  echarts.init(objArray[6]);
  let optionLa = eLineConfig_a({name:[
    '12.9',
    '12.10',
    '12.11',
    '12.12',
    '12.13'
  ],value:[
    10, 30, 80, 20, 10
  ]},{value:[
    5,20,15,80,20
  ]});
  optionLa && lintFt_a.setOption(optionLa); 
}