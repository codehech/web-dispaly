import * as echarts from 'echarts/core';
import { TitleComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TitleComponent, PieChart, CanvasRenderer, LabelLayout]);

function fontSize(res) {
    let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (!clientWidth) return;
    let fontSize = 100 * (clientWidth / 1920);
    return res * fontSize;
}



let labelLineFConfig = (...arry) => {
    let option;
    option = {
        /* title: {
          text: 'Referer of a Website',
          subtext: 'Fake Data',
          left: 'center'
        }, */
        tooltip: {
            trigger: 'item',
            textStyle: {
                "fontSize": fontSize(0.08)
            },
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['55%', '85%'],
                data: arry[0],
                left: 'center',
                bottom:'10%',
                width: '70%',
                height: '90%',
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                labelLine: {
                    length: 15,
                    length2: 0,
                    maxSurfaceAngle: 80
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                },
                label: {
                    alignTo: 'edge',
                    formatter: '{name|{b}}\n{time|{c}}',
                    // formatter: '{name|{b}}\n{time|{c} ({d}%)}',
                    //minMargin: 5,
                    edgeDistance: '5%',
                    lineHeight: fontSize(0.15),
                    fontFamily: '微软雅黑',
                    fontSize: fontSize(0.1),
                    fontWeight: 300,
                    color: "#fff",
                    rich: {
                        time: {
                            fontSize: fontSize(0.08),
                            color: '#8EACE2'
                        }
                    }
                },
            }
        ]
    };
    return option
}

export default function labelLineF(objArray) {
    let hsChart = echarts.init(objArray[0])
    let option = labelLineFConfig(objArray[1])
    option && hsChart.setOption(option)
}