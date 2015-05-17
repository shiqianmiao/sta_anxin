<!-- body class balance fixed-area id extend-manage-bg-->
<div class="js-widget-init" data-widget="app/client/app/myad/view/extension-manage.js#manage">
<%if(!hideTitle){%>
<div data-role="selectBox" class="js-box">
    <div class="green_t1 clear"><a data-role="back" href="javascript:void(0)" class="iconLeft"><i></i></a>智能推广管理</div>
</div>
<%}%>
 <div class="extend-manage-comm">推广信息：<%= data.post_title %></div>
 <div class="extend-manage-comm">推广状态：<%= data.audit_status_name %></div>
 <div class="extend-manage-comm">推广类型：<%= data.majors[0].major_name %><%if(data.majors.length > 1){%>...<%}%></div>
 <div class="extend-manage-comm">推广城市：<%= data.cities[0].city_name %><%if(data.cities.length > 1){%>...<%}%></div>
 <div class="extend-manage-comm">
  预算<b class="extend-amount"><%= data.budget %>元</b>&nbsp;&nbsp;&nbsp;已消费<b class="extend-amount"><%= data.consume %>元</b>&nbsp;&nbsp;&nbsp;点击出价<b class="extend-amount"><%= data.unit_price %>元</b>
  <p class="extend-amount-tip">推广出价越高，展现机会越大，位置越好。</p>
 </div>
 <%if (data.click) {%>
 <div class="extend-manage-comm"><a href="javascript:void(0)" data-role="linkCustomer" class="bt-extend-detail">查看详情</a> 有效点击<%= data.click %>次</div>
 <%}%>
<%if (data.audit_status == 0 || data.audit_status == 2 || data.audit_status == 3 || data.audit_status == 4 || data.audit_status == 5 || data.audit_status == 6){%>
<div class="form-group">
    <div class="form-field">
        <div class="form-item4">
            <div class="text-group"><strong>推广</strong></div>
            <div class="holder">
                <span <%if(data.audit_status != 0 && data.audit_status != 4 && data.audit_status != 6){%>class="active"<%}%> data-audit="<%= data.audit_status %>" data-role="changeStatus" data-status="<%if(data.audit_status != 6 && data.audit_status != 0 && data.audit_status != 4){%>4<%}else{%>1<%}%>"></span>
            </div>
        </div>
    </div>
</div>
<%}%>
 <input class="bt-extend-modify" type="submit" data-role="link" data-status="<%= data.audit_status %>" value="<%if (data.audit_status == 21){%>再次推广<%}else{%>修改推广<%}%>">
</div>