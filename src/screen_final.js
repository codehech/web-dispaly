import $ from 'jquery'
import "./css/screen_final.less"
import tab_cloud from "./js/public/cloud"
import eChartsFn from './js/action_s'
import echartRight from './js/rightcharts_s'
import eChartsDetail from './js/detail_32k'
// import labelLineF from './js/public/labelLine'
let pageValue = {}

const domain = /* document.domain || */ "//172.18.70.45:8080"
// const domain = /* document.domain || */ "//2.46.210.180:8443/service"
$(function () {
    function Percentage (num, total) {
        if (num == 0 || total == 0) {
            return 0
        }
        return (Math.round(num / total * 10000) / 100.00)// 小数点后两位百分比
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
        xinfang: 'xinfang',
        wind: 'listen',
        baidu: 'baiduai'
    }

    const citySourceObj = {
        a_1: { name: '姑苏区', css: 'gs' }
        ,
        a_2: { name: '吴中区', css: 'wz' }
        ,
        a_3: { name: '太仓', css: 'tc' }
        ,
        a_4: { name: '常熟', css: 'cs' }
        ,
        a_5: { name: '张家港', css: 'zjg' }
        ,
        a_6: { name: '相城区', css: 'xc' }
        ,
        a_7: { name: '吴江区', css: 'wj' }
        ,
        a_8: { name: '高新区', css: 'gx' }
        ,
        a_9: { name: '工业园区', css: 'yq' }
        ,
        a_10: { name: '昆山市', css: 'ks' }
    }

    let ss_chart = document.getElementById('ss_chart')
    let r_chart = document.getElementById('r_chart')
    let t_chart_f = document.getElementById('t-chart-f')
    let hs_chart = document.getElementById('hs_chart') || null
    $.ajax({
        url: domain + '/screen',
        type: 'GET',
        data: {},
        dataType: 'json',
        async: true,
        cache: false,
        success: function () {

        },
        error: function () {
            alert('请求超时')
        }
    }).then((d) => {
        if (d.code == 200) {
            let v = d.data || null


            //新增分析研判总数统计
            let warningJsonArray = []
            $.each(v.alertCount, function (i, v) {
                let warningJson = {}
                warningJson.key = v.name
                warningJson.count = v.value
                warningJsonArray.push(warningJson)
            })
            let warningConut = new Array()
            /*  let sortId_w = (a, b) => {
                 return b.count - a.count ;
             }
             let warningConut_d = warningJsonArray.sort(sortId_w) */
            let warningConut_d = warningJsonArray


            //重新按类别封装分析研判json数据
            let f_warningConut_d = new Array()
            $.each(warningConut_d, function (i, t) {
                let f_w_json = {}
                f_w_json.type = t.key
                let f_w_s_array = []
                $.each(v.alert, function (i, d) {
                    if (d.alertTypeOrigin == t.key) {
                        f_w_s_array.push(d)
                    }
                })
                f_w_json.content = f_w_s_array
                f_warningConut_d.push(f_w_json)
            })
            //--end

            $.each(warningConut_d, function (i, v) {
                let html = [
                    ` <div>
                        <h2>${v.count}</h2>
                        <span>${v.key == '200000' ? '一事多人投诉' : v.key == '300000' ? '一事长期未处理' : v.key == '400000' ? '一事近期热诉' : '一事多渠道投诉'}</span>
                        <a href="javascript:void(0)"></a>
                    </div>
                    `
                ].join('')

                warningConut.push(html)
            })
            $('#center_title').html(warningConut)

            let warningSource = new Array()
            $.each(f_warningConut_d, function (i, v) {

                let contentArray = new Array()
                $.each(v.content, function (i, d) {
                    let html = [
                        `<a href="javascript:void(0)" data-title="${d.alertType}" data-id='${d.id}'>
                                  <div class="${d.alertLevel == '1' ? 'hot' : d.alertLevel == '2' ? 'middle' : 'low'}">
                                      <dl>
                                          <dt><span>${d.alertType}</span><span class="s_r_fx">预警级别：${d.alertLevel == '1' ? '高' : d.alertLevel == '2' ? '中' : '低'}</span></dt>
                                          <dd>
                                              <h4>${d.title.length > 25 ? d.title.substring(0, 26) + '...' : d.title}</h4>
                                              <ol>
                                                  <li><em></em>涉事主体：${d.subject}</li>
                                                  <li><em></em>预警时间${d.alertTime}</li>
                                              </ol>
                                          </dd>
                                      </dl>
                                  </div>
                              </a>`
                    ].join('')
                    contentArray.push(html)
                })
                let outhtml = [
                    `<div class="center_content" id="${v.type}">
                    ${contentArray}
                    </div>`
                ].join('')

                warningSource.push(outhtml)

            })
            $('#center_content_c').html(warningSource)

            $('.center_content').off().on('click', 'a', function () {
                let title = $(this).data('title')
                let id = $(this).data('id')
                //$(window.parent.document).find("#a_b_c").show()
                pageValue.ti = title

                getDetailChar(id)
                $('#box-alert').css('visibility', 'visible')
            })


            let div = document.querySelectorAll(".center_content")
            $.each(div, function (i, v) {
                v.addEventListener("wheel", function (e) {
                    //这里使用的是 chrom浏览器测试的,有一些Api不太准确 ,请大家注意!!!!
                    let left = -e.wheelDelta || e.deltaY / 2
                    //console.log('wheelDelta:', -e.wheelDelta, "deltaY :", e.deltaY)
                    v.scrollLeft = v.scrollLeft + left
                })
            })

            $.each($('#ckr').find('a'), function (i, v) {
                $(v).off().on('click', function () {
                    let width = $(div[i]).find('a').outerWidth(true)
                    $(div[i]).animate({ 'scrollLeft': '+=' + width })
                })
            })
            $.each($('#center_title').find('a'), function (i, v) {
                $(v).off().on('click', function () {
                    let width = $(div[i]).find('a').outerWidth(true)
                    $(div[i]).animate({ 'scrollLeft': '-=' + width })
                })
            })

            //数据来源统计内容
            let areaCharName = new Array()
            let areaCharValue = new Array()
            let companiesCharName = new Array()
            let companiesCharValue = new Array()
            let governmentCharName = new Array()
            let governmentCharValue = new Array()
            let areaSource = new Array() //左下角区域地图数据专用
            let newAreaCharArray = new Array()
            let dataSource = new Array()
            $.each(v.dataSource, function (i, v) {
                let html = [
                    '<li class="' + dataSourceObj[v.type] + '">',
                    '<span class="ti">' + v.value + (v.type != 'phone' ? ' +' : '') + '</span>',
                    '<span>' + v.name + '</span>',
                    '</li>',
                ].join('')
                dataSource.push(html)
            })
            $('#t_j_list').html(dataSource)

            let sortId = (a, b) => {
                return a.value - b.value
            }
            let companies_d = v.companies ? v.companies.sort(sortId) : {}
            $.each(companies_d, function (i, v) {
                companiesCharName.push(v.name)
                companiesCharValue.push(v.value)
            })


            let government_d = v.government ? v.government.sort(sortId) : {}
            $.each(government_d, function (i, v) {
                let name = v.name

                // v.name.length>7?name = v.name.substring(0,7)+'\n'+v.name.substring(8,v.name.length):name = v.name
                governmentCharName.push(name)
                governmentCharValue.push(v.value)
            })

            let soundsCount = 0
            $.each(v.sounds, function (i, v) {
                let numvalue = v.value * 1
                newAreaCharArray.push(numvalue)
                newAreaCharArray.sort(function (a, b) {
                    return b - a
                })
                soundsCount += numvalue
            })

            $.each(v.sounds, function (i, v) {
                let idName = citySourceObj['a_' + v.id].css || ''
                let charHeight = 0
                soundsCount && !isNaN(soundsCount) ? charHeight = Percentage((v.value), soundsCount) : 0
                charHeight = charHeight + '%'
                let showName = parseFloat(v.value) >= newAreaCharArray[2] ? 'display:block' : 'display:none'
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

            let sounds_d = v.sounds ? v.sounds.sort(sortId) : {}
            $.each(sounds_d, function (i, v) {
                areaCharName.push(v.name)
                areaCharValue.push(v.value)
            })
            //图表程序入口
            eChartsFn([
                { obj: ss_chart, data: { name: companiesCharName, value: companiesCharValue } },
                { obj: r_chart, data: { name: governmentCharName, value: governmentCharValue } },
                { obj: t_chart_f, data: { name: areaCharName, value: areaCharValue } }
            ])

            //右侧图表专用数据
            let rightCharObjD = new Array()
            let rightCharName = new Array()
            let sortId_c = (a, b) => {
                return a.value - b.value
            }
            let words_d = v.words ? v.words.sort(sortId_c) : {}
            $.each(words_d, function (i, v) {
                rightCharName.push(v.name)
                rightCharObjD.push(v.value)
            })
            echartRight({ obj: hs_chart, data: { name: rightCharName, value: rightCharObjD } })
            //标签云

            let wordCloud_d = v.wordcloud ? v.wordcloud.sort(sortId_c) : {}
            let cloudArray = new Array()
            $.each(wordCloud_d, function (i, v) {
                let html = [
                    `<a href="#">${v.name}</a> `
                ].join('')
                cloudArray.push(html)
            })
            $('#tagbox').html(cloudArray)

            tab_cloud()
        }
    })


    let ms_list = (...arr) => {
        let v = arr[0] || null
        let willLineArray = new Array()
        $.each(v, function (i, v) {
            let html = [`
                <a href="javascript:void(0)">
                    <div class="_al_r_co_l">${v.customizedSubject}</div>
                    <div class="_al_r_co_r">
                        <em class="_s"></em>
                        <h6>${v.title}</h6>
                        <p>${v.content}</p>
                        <p><span>时间： ${v.publishTime}</span><span>事件类型：${v.eventType}</span></p>
                    </div>
                </a>
                `].join('')
            willLineArray.push(html)
        })
        $('#news').html(willLineArray)
    }


    let ms_list_net = (...arr) => {
        let v = arr[0] || null
        let willLineArray = new Array()
        $.each(v, function (i, v) {
            let html = [`
                <a href="javascript:void(0)">
                    <div class="_al_r_co_l">网络舆情${v.customizedSubject}</div>
                    <div class="_al_r_co_r">
                        <em class="_s"></em>
                        <h6>网络舆情${v.title}</h6>
                        <p>${v.content}</p>
                        <p><span>时间： ${v.publishTime}</span><span>网络舆情事件类型：${v.eventType}</span></p>
                    </div>
                </a>
                `].join('')
            willLineArray.push(html)
        })
        $('#news').html(willLineArray)
    }



    /*
    $('#m_chose').find('a').off().on('click', function () {
        let idname = $(this).attr('id')
        $(this).addClass('check').siblings().removeClass("check");
        $('.n-list-chk').hide()
        $('#' + idname.replace('m_', '')).show()
    })

     let w_sList = () => {
        $.ajax({
            url: domain + '/sentiment',
            type: 'GET',
            data: { _v: Math.random() },
            dataType: 'json',
            async: true,
            cache: false,
            success: function (d) {
                if (d.code == 200) {
                    let v = d.rows || null
                    let sentimentArray = new Array()
                    $('#m_sentiment').text('互联网舆情 （' + d.total + '）')
                    $.each(v, function (i, v) {
                        let html = [`
                <a href="javascript:void(0)">
                    <div class="icon_nl">
                        <img src="//${v.imgUrl}" alt="">
                    </div>
                    <div class="content_nl">
                        <h6>${v.title}</h6>
                        <p>${v.content}</p>
                        <p><span>时间：${v.dateTime}</span><span>来源：${v.source}</span><span>事件类型：${v.type}</span></p>
                    </div>
                </a>
                `].join('')
                        sentimentArray.push(html)
                    })
                    $('#sentiment').html(sentimentArray)
                }
            }
        })
        $.ajax({
            url: domain + '/will',
            type: 'GET',
            data: { _v: Math.random() },
            dataType: 'json',
            async: true,
            cache: false,
            success: function (d) {
                if (d.code == 200) {
                    let v = d.rows || null
                    let willArray = new Array()
                    $('#m_will').text('12345 （' + d.total + '）')
                    $.each(v, function (i, v) {
                        let html = [`
                <a href="javascript:void(0)">
                    <div class="icon_nl">
                        <img src="//${v.imgUrl}" alt="">
                    </div>
                    <div class="content_nl">
                        <h6>${v.title}</h6>
                        <p>${v.content}</p>
                        <p><span>时间：${v.dateTime}</span><span>来源：${v.source}</span><span>事件类型：${v.type}</span></p>
                    </div>
                </a>
                `].join('')
                        willArray.push(html)
                    })
                    $('#will').html(willArray)
                }
            }
        })
    } */

    let list_ms = []
    let list_net = []
    let getDetailChar = (...arr) => {
        let id = arr[0]
        // w_sList()
        $.ajax({
            url: domain + '/screen/alert/' + id,
            type: 'GET',
            data: { _v: Math.random() },
            dataType: 'json',
            async: true,
            cache: false,
            success: function () {

            }
        }).then((d) => {
            if (d.code == 200 && d.data) {
                let v = d.data || null
                ms_list(v.orderList)
                list_ms = v.orderList
                list_net = v.orderList

                let info = v.alert || null
                let html_ti = `
            <h5>${info.alertType} <span>预警级别：${info.alertLevel == '1' ? '高' : info.alertLevel == '2' ? '中' : '低'}</span>
                
                <p class="_ll">最新预警时间：${info.alertTime}</p>
            </h5>
            <h4>${info.title}</h4>
            <h6>涉事主体：${info.subject}</h6>`
                $('#tiContent').html(html_ti)
                info.alertLevel == '1' ? $('#tiContent').parent().removeClass().addClass('al_hot') : info.alertLevel == '2' ? $('#tiContent').parent().removeClass().addClass('al_middle') : $('#tiContent').parent().removeClass().addClass('al_normal')

                let dateArray = v.appealDate
                let appealCount = v.appealCount
                let sentimentCount = v.sentimentCount
                let dataObj = [{ name: dateArray, value: appealCount }, { name: dateArray, value: sentimentCount }] //第一个数据是上诉
                eChartsDetail(document.getElementById('linchar_a'), dataObj)

                /* 原饼图功能
                let datas = new Array()
                $.each(v.sourceCount, function (i, item) {
                    let j = { name: item.source, value: item.num }
                    datas.push(j)
                })
                 let datas = [
                    { name: '今日头条', value: 10 },
                    { name: '便民服务中心', value: 30 },
                    { name: '抖音', value: 5 },
                    { name: '快手', value: 5 },
                    { name: '微博', value: 20 }
                ] 
                labelLineF([document.getElementById('will'), datas]) 
                */
            } else {
                $('#tiContent').html('')
            }
        })
    }

    $('._al_right').find('h5').off().on('click', function () {
        $(this).addClass('active').siblings().removeClass('active')
        $('#scollist').animate({ scrollTop: 0 }, 500)
        if ($(this).data('type') == 'o') {
            ms_list(list_ms)
        } else {
            ms_list_net(list_net)
        }
    })

    $('#close').off().on('click', function () {
        //$(window.parent.document).find("#a_b_c").hide()
        $('#box-alert').css('visibility', 'hidden')
    })

    /*     let c = () => {
            let bigBox = document.querySelector('#_s_box')
            let primary = document.querySelector('#r_chart')
            let copy = document.querySelector('#copy')
            scroll(bigBox, primary, copy, 30)
        }
        c() */


})

/* function scroll(bigBox, primary, copy, time) {
    if (bigBox.clientHeight >= primary.scrollHeight) {
        // 不需要滚动
        return;
    }
    let num = 0;
    copy.innerHTML = primary.innerHTML; // 滚动到内容结束时不会留白
    bigBox.scrollTop = 0;
    // 初始化自动滚动
    let timer = setInterval(function () {
        // if (bigBox.scrollTop >= (primary.scrollHeight/2)) {
        if (bigBox.scrollTop >= primary.scrollHeight) {
            // 滚动到内容结束时，又重头开始
            bigBox.scrollTop = 0;
            num = 0;
        } else {
            num++;
            bigBox.scrollTop = num;
        }
    }, time);
    // 鼠标移入停止滚动
    bigBox.onmouseover = function () {
        clearInterval(timer);
    };
    // 鼠标移出继续滚动
    bigBox.onmouseout = function () {
        // 接着鼠标移出的地方
        num = bigBox.scrollTop >= primary.scrollHeight ? bigBox.scrollTop - primary.scrollHeight : bigBox.scrollTop;
        bigBox.scrollTop = num;
        timer = setInterval(function () {
            if (bigBox.scrollTop >= primary.scrollHeight) {
                bigBox.scrollTop = 0;
                num = 0;
            } else {
                num++;
                bigBox.scrollTop = num;
            }
        }, time);
    };
} */

if (module.hot) {
    module.hot.accept(['./js/math', './js/action_32k', './js/detail_32k', './js/rightcharts_32k'], function () {
        //更新文件模块后执行操作
    })
}


export default function pageValueS () {
    return pageValue
}