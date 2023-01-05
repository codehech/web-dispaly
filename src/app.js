import $ from 'jquery'
import "./css/list.less"
import eChartsFn from './js/action_32k'
import echartRight from './js/rightcharts_32k'
import eChartsDetail from './js/detail_32k'
let pageValue = {}

// const domain = /* document.domain || */ "//172.18.70.45:8080"
const domain = /* document.domain || */ "//2.46.210.180:8443/service"
$(function () {
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

    let ss_chart = document.getElementById('ss_chart')
    let r_chart = document.getElementById('r_chart')
    let t_chart_f = document.getElementById('t-chart-f')
    $.ajax({
        url: domain + '/largeScreen',
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

            let warningSource = new Array()
            $.each(v.warning, function (i, v) {
                let html = [
                    `<a href="javascript:void(0)" data-title="${v.type}" data-id='${v.id}'>
                              <div class="${v.level == '高' ? 'hot' : v.level == '中' ? 'middle' : 'low'}">
                                  <dl>
                                      <dt><span>${v.type}</span><span class="s_r_fx">预警级别：${v.level}</span></dt>
                                      <dd>
                                          <h4>${v.title.length > 25 ? v.title.substring(0, 26) + '...' : v.title}</h4>
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


            //新增分析研判总数统计
            let warningConut = new Array()
            $.each(v.warningConut, function (i, v) {
                let html = [
                    ` <div>
                        <h2>${v}</h2>
                        <span>${i == 'v20000' ? '突发事件' : i == 'v30000' ? '苗头事件' : '一事多诉'}</span>
                    </div>
                    `
                ].join('')
                warningConut.push(html)
            })
            $('#center_title').html(warningConut)

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
                    '<span class="ti">' + v.value + '</span>',
                    '<span>' + v.name + '</span>',
                    '</li>',
                ].join('')
                dataSource.push(html)
            })
            $('#t_j_list').html(dataSource)

            $.each(v.companies, function (i, v) {
                companiesCharName.push(v.name)
                companiesCharValue.push(v.value)
            })

            $.each(v.government, function (i, v) {
                governmentCharName.push(v.name)
                governmentCharValue.push(v.value)
            })

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
                    '<div class="' + (i == 0 ? 'r-li-f' : i == 1 ? 'r-li-s' : i == 2 ? 'r-li-t' : 'r-li-t-t') + '">',
                    '<span class="r-l">' + v.word + '</span><span class="r-r">声量：' + (v.count.slice(-1) || 0) + '</span>',
                    '<div class="linbox" id="hs_' + i + '"></div>',
                    '</div>',
                ].join('');
                if (i < 4) {
                    rightCharStr.push(html)
                    rightCharObjD.push({ idkey: 'hs_' + i, value: v })
                }
            })
            $('#rightCharts').html(rightCharStr)
            echartRight(rightCharObjD)
        }
    })


    let ms_list = () => {
        $.ajax({
            url: domain + '/willLine',
            type: 'GET',
            data: { _v: Math.random() },
            dataType: 'json',
            async: true,
            cache: false,
            success: function (d) {
                if (d.code == 200) {
                    let v = d.rows || null
                    let willLineArray = new Array()
                    $.each(v, function (i, v) {
                        let html = [`
                <a href="javascript:void(0)">
                    <div class="_al_r_co_l">${v.dateTime.replace(' ', '<br/>')}</div>
                    <div class="_al_r_co_r">
                        <em class="_s"></em>
                        <h6>${v.title}</h6>
                        <p>${v.content}</p>
                        <p><span>来源信息： ${v.source}</span><span>事件类型：${v.type}</span></p>
                    </div>
                </a>
                `].join('')
                        willLineArray.push(html)
                    })
                    $('#news').html(willLineArray)
                }
            }
        })
    }

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
                    $('#m_sentiment').text('网络舆情 （' + d.total + '）')
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
                    $('#m_will').text('民声诉求 （' + d.total + '）')
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
    }

    let getDetailChar = (...arr) => {
        let id = arr[0]
        w_sList()
        ms_list()
        $.ajax({
            url: domain + '/warning/' + id,
            type: 'GET',
            data: { _v: Math.random() },
            dataType: 'json',
            async: true,
            cache: false,
            success: function () {

            }
        }).then((d) => {
            if (d.code == 200) {
                let v = d.data || null
                let html_ti = `
            <h5>${v.type} <span>预警级别：${v.level}</span>
                <p>指令推送状态：${v.status}</p>
                <p class="_ll">最新预警时间：${v.dateTime}</p>
            </h5>
            <h4>${v.title}</h4>
            <h6>涉事主体：${v.company}</h6>`
                $('#tiContent').html(html_ti)
                v.level == '高' ? $('#tiContent').parent().removeClass().addClass('al_hot') : v.level == '中' ? $('#tiContent').parent().removeClass().addClass('al_middle') : $('#tiContent').parent().removeClass().addClass('al_normal')

                let dateArray = v.appealDate
                let appealCount = v.appealCount
                let sentimentCount = v.sentimentCount
                let dataObj = [{ name: dateArray, value: appealCount }, { name: dateArray, value: sentimentCount }] //第一个数据是上诉
                eChartsDetail(document.getElementById('linchar_a'), dataObj)
            }
        })
    }

    $('#center_content').off().on('click', 'a', function () {
        let title = $(this).data('title')
        let id = $(this).data('id')
        $(window.parent.document).find("#a_b_c").show()
        pageValue.ti = title

        getDetailChar(id)
        $('#box-alert').css('visibility', 'visible')
    })
    $('#close').off().on('click', function () {
        $(window.parent.document).find("#a_b_c").hide()
        $('#box-alert').css('visibility', 'hidden')
    })
})

if (module.hot) {
    module.hot.accept(['./js/math', './js/action'], function () {
        //更新文件模块后执行操作
    })
}
export default function pageValueS() {
    return pageValue
}