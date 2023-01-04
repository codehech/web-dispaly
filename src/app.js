import $ from 'jquery'
import "./css/list.less"

const domain = /* document.domain || */ "//172.18.70.45:8080"
//const domain = /* document.domain || */ "//2.46.210.180:8443/service"
$(function () {


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
        }
    })
})