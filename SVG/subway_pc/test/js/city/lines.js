import $ from 'jquery';
import createSvg from '../common/createSvg';

let cityLines = $('<div class="subways-city-lines" id="subways-city-lines"></div>');
$('#subways-wrapper-map').append(cityLines);

const gBox = $('#g-box');

let subChild;

// 渲染城市线路
function renderLines(data) {
    cityLines.html('');

    let html = '';
    const { l, sw_xmlattr } = data.subways;
    const { c } = sw_xmlattr;
    const lines = l;
    
    lines.forEach(line => {
        const { l_xmlattr } = line;
        const { lbx, lby, sn, lb, lc } = l_xmlattr;
        let name = c === '北京' ? sn : lb;
        let color = lc.replace(/^0x/, '#');

        html += `<a href="javascript:;" style="color: ${color}" data-subway="subway_${name}" data-x=${lbx} data-y=${lby}>${name}</a>`;
    });

    cityLines.html(html);
}

// 点击线路展现对应路径

function showPath(cb) {

    $('.subways-city-lines').on('click', 'a', function() {
        const curAttr = $(this).attr('data-subway');
        const x = $(this).attr('data-x');
        const y = $(this).attr('data-y');

        $(this).addClass('active').siblings().removeClass('active');

        $('#rect-mask').remove();

        let rect = createSvg('rect').appendTo(gBox);
        rect.attr({
            id: 'rect-mask',
            width: 3000,
            height: 3000,
            x: -1500,
            y: -1500,
            fill: '#fff',
            'fill-opacity': 0.9
        });


        // 展示选中线路
        let children = gBox.find('g');
        
        for (let i = 0; i < children.length; i++) {
            let child = $(children[i]);
            let attr = child.attr('data-subway');

            if (curAttr === attr) {
                // 拷贝DOM，不改变原有children数据显示位置
                subChild = child.clone();
                subChild.attr('class', 'subways-copy-path');
                subChild.appendTo(gBox);
            }
        }

        cb && cb({
            x,
            y
        });
        return false;
    });
}

function hidePath() {
    // 清除矩形背景
    $('#rect-mask').remove();
    // 清除拷贝DOM元素
    $('.subways-copy-path').remove();

    $('#subways-city-lines').find('a').removeClass('active');
}


export {
    renderLines,
    showPath,
    hidePath
};