    `
    .pricehide {
      white-space: pre;
      display: inline-block;
      visibility: hidden;
    }

    function hasClass(elem, className) {
      return elem.className.split(' ').indexOf(className) > -1;
    }

    document.querySelector('.fresh-table').addEventListener('input', function(e) {
      if(hasClass(e.target, 'pricetxt')) {
        e.target.parentNode.firstChild.innerText = e.target.value;
        e.target.style.width = String(e.target.parentNode.firstChild.offsetWidth + 16) + "px";
        e.target.parentNode.firstChild.innerText = "";
      }
    });

    <td><span class="pricehide"></span><input class="pricetxt" type="text" value="1" style="width:25.5px"></td>
    <th scope="col">제작개수</th>
    `

    function isEmptyValue(value){
      if(isNaN(value)) return 0;
      return value;
    }

    function createqtyperset(event,ele){
      event.preventDefault();
      event.stopPropagation();
      if(event.deltaY<0){
        if(ele.value == ""){
          ele.value = 0;
        }
        ele.value = parseInt(ele.value) + 1;
      }else if(event.deltaY>0){
        ele.value = parseInt(ele.value) - 1;
      } 
      if(parseInt(ele.value) <= -1) ele.value = 0;

      ele.parentElement.parentElement.querySelectorAll('.dynamic-calc').forEach((e)=>{
        if(e.getAttribute('origin-value').includes('.')){
          if(Number.isInteger((parseFloat(e.getAttribute('origin-value')) * parseInt(ele.value)))){
            e.textContent = (parseFloat(e.getAttribute('origin-value')) * parseInt(ele.value));
          }else{
            e.textContent = (parseFloat(e.getAttribute('origin-value')) * parseInt(ele.value)).toFixed((e.getAttribute('origin-value').substr(e.getAttribute('origin-value').indexOf('.')+1)).length);
          }
        }else{
          e.textContent = parseInt(e.getAttribute('origin-value')) * parseInt(ele.value);
        }
      });
    }

    tippy('.bi', {
      allowHTML: true, 
      onShow(instance) {
        instance.setContent(instance.reference.getAttribute('tooltipcontent'));
      },
      theme: 'light', 
      placement: 'right',
    });

    function reloadPriceTXT(){
      document.querySelectorAll('.pricetxt').forEach((e)=>{
        e.previousSibling.textContent = e.value;

        e.previousSibling.style.display = 'unset';
        e.style.width = `${e.previousSibling.offsetWidth + 16}px`;
        e.previousSibling.style.display = 'none';
    
        if(e.value == ''){
          e.value = 0;
          e.previousSibling.textContent = 0;
        }
        if(e.value.indexOf('0') == 0 && e.value.length >= 2){
          e.value = e.value.substr(1);
        }


        e.addEventListener('click', ()=>{
          $table.bootstrapTable('toggleDetailView', e.parentElement.parentElement.getAttribute('data-index'));
        })

        e.addEventListener('change', ()=>{
          e.previousSibling.textContent = e.value;

          e.previousSibling.style.display = 'unset';
          e.style.width = `${e.previousSibling.offsetWidth + 16}px`;
          e.previousSibling.style.display = 'none';
      
          if(e.value == ''){
            e.value = 0;
            e.previousSibling.textContent = 0;
          }
          if(e.value.indexOf('0') == 0 && e.value.length >= 2){
            e.value = e.value.substr(1);
          }

          temprowitemname = e.parentElement.parentElement.childNodes[1].textContent;
          if(temprowitemname.indexOf('(') != -1){
            temprowitemname = temprowitemname.substr(0, temprowitemname.indexOf('('))
          }

          jsonsave[temprowitemname] = parseInt(e.value);
          recipecalc();
        })
      });
    }

    function newRow(index, row, $detail){
      tippy($detail[0].querySelectorAll('.hasTooltip'), {
        allowHTML: true, 
        onShow(instance) {
          instance.setContent(instance.reference.getAttribute('tooltipcontent'));
        },
        theme: 'light', 
        placement: 'top',
      });
      
      $detail[0].querySelectorAll('.pricetxt').forEach((e)=>{
        e.previousSibling.textContent = e.value;

        e.previousSibling.style.display = 'unset';
        e.style.width = `${e.previousSibling.offsetWidth + 16}px`;
        e.previousSibling.style.display = 'none';
    
        if(e.value == ''){
          e.value = 0;
          e.previousSibling.textContent = 0;
        }
        if(e.value.indexOf('0') == 0 && e.value.length >= 2){
          e.value = e.value.substr(1);
        }
        
        e.addEventListener('change', ()=>{
          e.previousSibling.textContent = e.value;

          e.previousSibling.style.display = 'unset';
          e.style.width = `${e.previousSibling.offsetWidth + 16}px`;
          e.previousSibling.style.display = 'none';
      
          if(e.value == ''){
            e.value = 0;
            e.previousSibling.textContent = 0;
          }
          if(e.value.indexOf('0') == 0 && e.value.length >= 2){
            e.value = e.value.substr(1);
          }
        })
      })
      
      $detail[0].querySelectorAll('.ableEditPrice').forEach((e)=>{
        e.addEventListener('change', (ele)=>{
          jsonsave[e.getAttribute('item')] = parseInt(e.value);

          var detailElement = e;
          while(true){
            if(detailElement.className == "detail-view") break;
            detailElement = detailElement.parentElement;
          }
          var targetitemname = detailElement.previousSibling.childNodes[1].textContent;

          recipecalc();
          $table.bootstrapTable('selectPage', 1)
          var pagewhilestopsign = false;
          while(true){
            document.querySelectorAll("#fresh-table > tbody > tr > td.text-start").forEach((e)=>{
              if(e.textContent == targetitemname){
                $table.bootstrapTable('toggleDetailView', parseInt(e.parentElement.getAttribute('data-index')));
                pagewhilestopsign = true;
              }
            })
            if(pagewhilestopsign) break;
            $table.bootstrapTable('nextPage');
          }
        })
      })
    }

    document.querySelector('#helpbtn').addEventListener('click', function(){
      var helpimage = document.createElement('img');
      helpimage.src = "img/wisdom.png";
      document.querySelector('#modalimg1').appendChild(helpimage);
      
      helpimage = document.createElement('img');
      helpimage.src = "img/wisdomeffect.png";
      document.querySelector('#modalimg2').appendChild(helpimage);

      document.querySelector('#helpbtn').removeEventListener('click', arguments.callee);
    }, false);

    var jsonsave;
    var $table = $('#fresh-table');

    function recipecalc(){
      tabledata = [];
      temp = [];
      Object.keys(recipedata).forEach(function(item){
        itemname = item;
        if(itemname.lastIndexOf('(') != -1){
          temp.push(itemname.substr(0, itemname.lastIndexOf('(')));
        }else{
          temp.push(itemname);
        }
        recipe = recipedata[item];

        type = recipe['분류'];
        if(type == '배틀아이템'){
          type = "b";
        }else if(type == "요리"){
          type = "c";
        }else if(type == "특수"){
          type = "s";
        }else if(type == "생활도구"){
          type = "lt";
        }
        qty = recipe['수량'];
        e = recipe['활동력'];
        
        craftprice = 0;
        for (var i = 4; i < Object.keys(recipe).length; i++) {
          thisitemname = Object.keys(recipe)[i];
          if(thisitemname.lastIndexOf('(') != -1){
            thisitemname = thisitemname.substr(0, thisitemname.lastIndexOf('('));
          }
          thisitmeqty = recipe[Object.keys(recipe)[i]];

          if(thisitemname == '실링'){
            calcprice = 0;
          }else if(thisitemname == "골드"){
            thissale = isEmptyValue(parseFloat($('#cc_' + type).val())) + isEmptyValue(parseFloat($('#cc_all').val()));
            if(thissale == 0){
              calcprice = thisitmeqty;
            }else{
              calcprice = Math.floor(thisitmeqty - (thisitmeqty * (thissale / 100)));
            }
          }else{
            try{
              thisunit = itemunit[Object.keys(recipe)[i]];
              if(thisunit == undefined){
                thisunit = 1;
              }
            }catch{}
            marketprice = jsonsave[thisitemname];
            if(Object.keys(recipe)[i].lastIndexOf('제작)') != -1){
              for (var j = 0; j < tabledata.length; j++) {
                if(tabledata[j]['item'] == thisitemname){
                  marketprice = (tabledata[j]['craftprice'] / recipe[Object.keys(recipe)[i]]).toFixed(2);
                  break;
                }
              }
            }
            temp.push(thisitemname)
            calcprice = marketprice * (thisitmeqty / thisunit);
          }
          craftprice += calcprice;
        }

        thisbuyprice = jsonsave[itemname]
        if(itemname.lastIndexOf('(') != -1){
          thisbuyprice = jsonsave[itemname.substr(0, itemname.lastIndexOf('('))];
        }

        thisgs = isEmptyValue(parseFloat($('#gs_' + type).val())) + isEmptyValue(parseFloat($('#gs_all').val())) + 5;
        if(thisgs <= 5){
          gsqty = qty;
        }else{
          gsqty = ((((((isEmptyValue(parseFloat($('#gs_' + type).val())) + isEmptyValue(parseFloat($('#gs_all').val()))) / 10) / 2) + 5) * qty) / 100) + qty;
        }
        thisprofit = ((thisbuyprice - Math.ceil(thisbuyprice * 0.05)) * gsqty - craftprice);

        this_e = isEmptyValue(parseFloat($('#e_' + type).val())) + isEmptyValue(parseFloat($('#e_all').val()));
        if(this_e == 0){
          es = e;
        }else{
          es = parseInt(e - (e * (this_e / 100)));
          if(es == 0){
            es = 1;
          }
        }

        if(thisbuyprice > (craftprice / qty)){
          thisrecommend =  "제작";
        }else{
          thisrecommend =  "구매";
        }
        
        tabledata.push({item: itemname,
                recommend: thisrecommend,
                buyprice: thisbuyprice,
                craftprice: craftprice.toFixed(2),
                profit: thisprofit.toFixed(2),
                profitperenergy: parseInt((Math.floor(10000 / es)) * thisprofit),
                dict: recipe,
                es: es,
                gsqty: gsqty
        });
      });

      $table.bootstrapTable('load', tabledata);
    }
    
    $('#accordionitemprice').on('click', function(){
      $accord = $('#accordionitemprice').find('.row');

      ([...new Set(temp)].sort()).forEach(function(e){
        originE = e;
        try{
          grade = iteminfo[e][1];
          image = iteminfo[e][0];
        }catch{
          if(e.indexOf('빛나는 ') != -1){
            behindE = e.substr(4);
            try{behindE = behindE.replace("정령의 회복약", "정가");}catch{}
            grade = recipedata[e + '('+behindE+' 구매)'].key.Element_001.value.slotData.iconGrade;
            image = recipedata[e + '('+behindE+' 구매)'].key.Element_001.value.slotData.iconPath;
          }else{
            try{e = e.replace("융화 재료", "융화 재료(고고학)");}catch{}
            grade = recipedata[e].key.Element_001.value.slotData.iconGrade;
            image = recipedata[e].key.Element_001.value.slotData.iconPath;
          }
        }
        $accord.append(`<div class="col-3 px-0"><div class="float-start"><img class="item-image" data-grade="${grade}" style="width:32px; height:32px;" src="https://cdn-lostark.game.onstove.com/${image}" alt=""> <span id='itemname' origin="${originE}">${originE.substr(0,14)}</span> : <span class="pricehide"></span><input class="pricetxt" type="text" value="${jsonsave[originE]}"></div>`);
      });

      $(this).off('click');
      $('.pricetxt').filter(function(){
        $(this).parent().find('.pricehide').text($(this).val());
        $(this).width($(this).parent().find('.pricehide').width() + 16);

        $(this).on("mousewheel",function(event,delta){
          event.preventDefault();
          event.stopPropagation();
          if(delta>0){
            $(this).val(parseInt($(this).val()) + 1);
            $(this).parent().find('.pricehide').text($(this).val());
          }else if(delta<0){
            if($(this).val() == 0){return;}
            $(this).val(parseInt($(this).val()) - 1);
            $(this).parent().find('.pricehide').text($(this).val());
          } 
          
          jsonsave[$(this).parent().find('#itemname').attr('origin')] = parseInt($(this).val());
          recipecalc();
        });

        $(this).on('input', function(){
          $(this).parent().find('.pricehide').text($(this).val());
          $(this).width($(this).parent().find('.pricehide').width() + 16);

          if($(this).val() == ''){
            $(this).val(0);
            $(this).parent().find('.pricehide').text(0);
          }
          if($(this).val().indexOf('0') == 0 && $(this).val().length >= 2){
            $(this).val($(this).val().substr(1));
          }
          jsonsave[$(this).parent().find('#itemname').attr('origin')] = parseInt($(this).val());
          recipecalc();
        })

      });
    });

    function detailFormatter(index, row) {
      html = "";
      html += `<table class="table" style="cursor:auto;">
  <thead>
    <tr>
      <th scope="col">시세</th>
      <th scope="col">수수료</th>
      <th scope="col">제작비용<br>(개당)</th>
      <th scope="col">재료</th>
      <th scope="col">시세</th>
      <th scope="col">구매<br>단위</th>
      <th scope="col">필요<br>개수</th>
      <th scope="col">합계</th>
      <th scope="col">제작비용</th>
      <th scope="col">활동력<br>[영지효과]</th>
      <th scope="col">제작 수량<br>[영지효과]</th>
      <th scope="col">이익<br>(세트당)</th>
    </tr>
  </thead>
  <tbody>`;

    rowitemname = row['item'];
    if(rowitemname.lastIndexOf('(') != -1){
      rowitemname = rowitemname.substr(0, rowitemname.lastIndexOf('('));
    }

    html += `
    <tr>
      <td><span class="pricehide"></span><input class="pricetxt ableEditPrice" item="${rowitemname}" type="text" value="${row['buyprice']}"></td>
      <td id="detail-tax">${Math.ceil(row['buyprice'] * 0.05)}</td>
      <td id="detail-craftprice">${(row['craftprice'] / row['dict']['수량']).toFixed(2)}</td>
      <td>`;
      // 재료
      for (var i = 4; i < Object.keys(row['dict']).length; i++) {
        thisitemname = Object.keys(row['dict'])[i];
        if(thisitemname.lastIndexOf('(') != -1){
          thisitemname = thisitemname.substr(0, thisitemname.lastIndexOf('('));
        }
        try{
          grade = iteminfo[thisitemname][1];
          image = iteminfo[thisitemname][0];
        }catch{
          if(thisitemname.indexOf('빛나는 ') != -1){
            behindE = thisitemname.substr(4);
            try{behindE = behindE.replace("정령의 회복약", "정가");}catch{}
            grade = recipedata[thisitemname + '('+behindE+' 구매)'].key.Element_001.value.slotData.iconGrade;
            image = recipedata[thisitemname + '('+behindE+' 구매)'].key.Element_001.value.slotData.iconPath;
          }else{
            try{thisitemname = thisitemname.replace("융화 재료", "융화 재료(고고학)");}catch{}
            grade = recipedata[thisitemname].key.Element_001.value.slotData.iconGrade;
            image = recipedata[thisitemname].key.Element_001.value.slotData.iconPath;
          }
        }
        html += `<p><img class="item-image" data-grade="${grade}" style="width:24px; height:24px;" src="https://cdn-lostark.game.onstove.com/${image}" alt=""> ${Object.keys(row['dict'])[i]}</p>`;
      }

      html += `</td>
      <td>`;

      // 재료시세
      for (var i = 4; i < Object.keys(row['dict']).length; i++) {
        thisitemname = Object.keys(row['dict'])[i];
        if(thisitemname.lastIndexOf('(') != -1){
          thisitemname = thisitemname.substr(0, thisitemname.lastIndexOf('('));
        }

        if(thisitemname == "실링"){
          html += `<p>0</p>`;
        }else if(thisitemname == "골드"){
          html += `<p>${row['dict'][Object.keys(row['dict'])[i]]}</p>`;
        }else{
          if(Object.keys(row['dict'])[i].lastIndexOf('제작)') != -1){
            for (var j = 0; j < tabledata.length; j++) {
              if(tabledata[j]['item'] == thisitemname){
                price = ((tabledata[j]['craftprice'] * row['dict'][Object.keys(row['dict'])[i]]) / tabledata[j]['dict']['수량']) / row['dict'][Object.keys(row['dict'])[i]];
                price = price.toFixed(2);
                html += `<p>${price}</p>`;
                break;
              }
            }
          }else{
            html += `<p><span class="pricehide"></span><input class="pricetxt ableEditPrice" type="text" item="${thisitemname}" value="${jsonsave[thisitemname]}"></p>`;
          }
        }
      }

      html += `</td>
      <td>`;

      // 구매 단위
      for (var i = 4; i < Object.keys(row['dict']).length; i++) {
        thisitemname = Object.keys(row['dict'])[i];
        if(thisitemname.lastIndexOf('(') != -1){
          thisitemname = thisitemname.substr(0, thisitemname.lastIndexOf('('));
        }
        unit = itemunit[thisitemname];
        if(unit == undefined){
          unit = 1;
        }

        html += `<p>${unit}</p>`;
      }

      html += `</td>
      <td>`;

      // 재료 개수
      for (var i = 4; i < Object.keys(row['dict']).length; i++) {
        thisitemname = Object.keys(row['dict'])[i];
        if(thisitemname.lastIndexOf('(') != -1){
          thisitemname = thisitemname.substr(0, thisitemname.lastIndexOf('('));
        }
        if(thisitemname == "실링" || thisitemname == "골드"){
          qty = 1;
        }else{
         qty = row['dict'][Object.keys(row['dict'])[i]]; 
        }

        html += `<p class="dynamic-calc" origin-value="${qty}">${qty}</p>`;
      }

      html += `</td>
      <td>`;

      // 재료 총 가격
      type = row['dict']['분류'];
      if(type == '배틀아이템'){
        type = "b";
      }else if(type == "요리"){
        type = "c";
      }else if(type == "특수"){
        type = "s";
      }else if(type == "생활도구"){
        type = "lt";
      }
      for (var i = 4; i < Object.keys(row['dict']).length; i++) {
        thisitemname = Object.keys(row['dict'])[i];
        if(thisitemname.lastIndexOf('(') != -1){
          thisitemname = thisitemname.substr(0, thisitemname.lastIndexOf('('));
        }
        if(thisitemname == "실링"){
          calcprice = 0;
        }else if(thisitemname == "골드"){
          thissale = isEmptyValue(parseFloat($('#cc_' + type).val())) + isEmptyValue(parseFloat($('#cc_all').val()));
          if(thissale == 0){
            calcprice = row['dict'][Object.keys(row['dict'])[i]];
          }else{
            calcprice = Math.floor(row['dict'][Object.keys(row['dict'])[i]] - (row['dict'][Object.keys(row['dict'])[i]] * (thissale / 100)));
          }
        }else{
          try{
            thisunit = itemunit[Object.keys(row['dict'])[i]];
            if(thisunit == undefined){
              thisunit = 1;
            }
          }catch{}
          marketprice = jsonsave[thisitemname];
          calcprice = ((marketprice / thisunit) * row['dict'][Object.keys(row['dict'])[i]]).toFixed(2)
          if(Object.keys(row['dict'])[i].lastIndexOf('제작)') != -1){
            for (var j = 0; j < tabledata.length; j++) {
              if(tabledata[j]['item'] == thisitemname){
                calcprice = ((tabledata[j]['craftprice'] / tabledata[j]['dict']['수량']).toFixed(2) * row['dict'][Object.keys(row['dict'])[i]]).toFixed(2);
                break;
              }
            }
          }
        }
        html += `<p class="dynamic-calc" origin-value="${calcprice}">${calcprice}</p>`;
      }
      html +=`<td class="dynamic-calc" origin-value="${row['craftprice']}">${row['craftprice']}</td>
      <td>
        <span class="dynamic-calc" origin-value="${row['dict']['활동력']}">${row['dict']['활동력']}</span>
        <br>[<span class="dynamic-calc" origin-value="${row['es']}">${row['es']}</span>]
      </td>
      <td onmousewheel="createqtyperset(event,this.querySelector('.pricetxt'))">
        <span class="dynamic-calc" origin-value="${row['dict']['수량']}">${row['dict']['수량']}</span>
        <br>[<span class="dynamic-calc" origin-value="${row['gsqty']}">${row['gsqty']}</span> <i class="bi bi-question-circle-fill hasTooltip" tooltipcontent="기본 대성공 5%에서 영지효과 곱연산"></i>]
        <br><span class="pricehide"></span><input class="pricetxt" style="width:31px;" onclick="javascript:if(this.value=='0') this.value='';" oninput="createqtyperset(event,this)" type="text" value="1">세트
      </td>
      <td>
        <span class="dynamic-calc" origin-value="${row['profit']}">${row['profit']}</span> <i class="bi bi-question-circle-fill hasTooltip" tooltipcontent="((${row['buyprice']} - ${Math.ceil(row['buyprice'] * 0.05)}) X ${row['gsqty']}) - ${row['craftprice']}<br>((개당 시세 - 개당 수수료) X 제작 수량) - 제작 비용"></i></td>
    </tr>
  </tbody>
</table>`;
      return html;
    }

    function imageFormatter(index, row) {
      if(row['item'].lastIndexOf('(') != -1){
        thisname = row['item'].substr(0, row['item'].lastIndexOf('('));
      }else{
        thisname = row['item'];
      }

      image = row.dict.key.Element_001.value.slotData.iconPath;
      grade = row.dict.key.Element_001.value.slotData.iconGrade;

      return '<img data-key="' + JSON.stringify(row.dict.key).replace(/"/gi, "&quot;") + '" class="item-image mt-1 mb-1" data-grade="' + grade + '" src="https://cdn-lostark.game.onstove.com/' + image + '" onmouseover="tooltip_item_show(this);" onmouseout="tooltip_item_hide(this);" style="width: 64px;">'
    }

    function buypriceFormatter(value, row) {
      return `<span class="pricehide"></span><input class="pricetxt" type="text" value="${value}">`;
    }

    function tooltip_item_show(e){
      offtop = $(e).offset().top;
      offleft = $(e).offset().left + 75;
      keydata = JSON.parse($(e).attr('data-key'));

      tooltiphtml = `<div class="itemdic-item game-tooltip game-tooltip-item" style="position: absolute; left: ${offleft}px; top: ${offtop}px;">`;

      Object.keys(keydata).forEach(function(e){
        tooltiphtml += `<div class="${keydata[e]['type']}">`;
        if(keydata[e]['type'] == "ItemTitle"){
          tooltiphtml += `<span class="slotData" data-grade="${keydata[e]['value']['slotData']['iconGrade']}"><img src="https://cdn-lostark.game.onstove.com/${keydata[e]['value']['slotData']['iconPath']}" alt="" data-grade="${keydata[e]['value']['slotData']['iconGrade']}" class="item-image"}></span>`;
          try{
            delete keydata[e]['value']['slotData'];
          }catch{}
          Object.keys(keydata[e]['value']).forEach(function(f){
            tooltiphtml += `<span class="${f}">${keydata[e]['value'][f]}</span>`;
          });
        }else if(keydata[e]['type'] == "MultiTextBox"){
          keyvaluearr = keydata[e]['value'].split('|');
          keyvaluearr.forEach(function(g){
            tooltiphtml += `<span>${g}</span>`;
          });
        }else{
          tooltiphtml += `${keydata[e]['value']}`;
        }
        tooltiphtml += `</div>`;
      });

      $('body').append(tooltiphtml);
    }
    function tooltip_item_hide(e){
      $('body').find('.game-tooltip-item').remove()
    }

    waringitemarr = ['신호탄','회복약'];
    function profitperenergyFormatter(value, row){
      
      if(waringitemarr.indexOf(row['item']) != -1){
        return value + ` <i class="bi bi-exclamation-circle-fill" style="color:red;" onmouseover="tippy($(this)[0], { content: '제작 활동력이 1이라서 비상식적인 이득이 나온 것입니다. 실제론 활동력 1만 못 녹입니다.',theme: 'light', placement: 'bottom', });"></i>`;
      }else{
        return value;
      }
    }

    function recomcellStyle(value, row, index) {
      if (row['recommend'] == '구매') {
        return {
          css: {
            color: 'red'
          }
        }
      }else{
        return {
          css: {
            color: '#00ff00'
          }
        }
      }
    }

    function profcellStyle(value, row, index) {
      if (row['profit'] <= 0) {
        return {
          css: {
            color: 'red'
          }
        }
      }else{
        return {
          css: {
            color: '#00ff00'
          }
        }
      }
    }

    $(function(){
      $table.bootstrapTable({
        classes: 'table table-hover table-striped',
        toolbar: '.toolbar',
        search: true,
        pagination: true,
        striped: true,
        pageSize: 10,
        pageList: [10, 25, 50, 100],
        onExpandRow: newRow,
        onPostBody: reloadPriceTXT,

        formatShowingRows: function(pageFrom, pageTo, totalRows){
          return ''
        },
        formatRecordsPerPage: function (pageNumber) {
          return pageNumber + ' rows visible'
        },
      })

      $('#wisdomeffectclear').on('click', function(){
        $('#wisdomeffect').find('input').filter(function(){
          $(this).val('');
          setCookie($(this).attr('id'), '', 365);
          recipecalc();
        });
      });

      $('#wisdomeffect').find('input').filter(function(){
        givemeid = $(this).attr('id');
        if(getCookie(givemeid) == undefined || getCookie(givemeid) == ''){
          $(this).val('');
        }else {
          $(this).val(getCookie(givemeid));
        }

        $(this).hover(()=>{
          $(this).focus();
        })

        $(this).on('input', function(){
          thiseffectname = $(this).attr('id');
          thiseffectval = $(this).val();

          if(parseFloat(thiseffectval) <= 0){
            $(this).val('');
            thiseffectval = '';
          }

          setCookie(thiseffectname, thiseffectval, 365);
          recipecalc();
        });
      });

      $.ajax({
        type: 'POST',
        url: url + '/craftcalc',
        success: function(json) {
          jsonsave = json;

          jsondate = String(jsonsave['date']);
          db_year = jsondate.slice(0,4);
          db_mon = jsondate.slice(4,6);
          db_day = jsondate.slice(6,8);
          db_hour = jsondate.slice(8,10);
          db_min = jsondate.slice(10,12);

          $('#markettime').text('[' + db_year + "-" + db_mon + "-" + db_day + " " + db_hour + ":" + db_min + " 기준]");

          recipecalc();
        }
      });
    });