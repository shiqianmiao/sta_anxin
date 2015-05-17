<div class="js-widget-init" data-widget="app/client/app/myad/view/extension-customer.js#pageManage">
<%if(!hideTitle){%>
<div data-role="selectBox" class="js-box">
    <div class="green_t1 clear"><a data-role="back" href="javascript:void(0)" class="iconLeft"><i></i></a>有意向的在线客户</div>
</div>
<%}%>
<% for (var i = 1; i <= data.page_count; i ++) {%>
  <table width="100%" border="0" cellspacing="0" style="display:none;" cellpadding="0" class="extend-customer-tab page<%= i %>" data-role="pagebody" data-page="<%= i %>">
  </table>
<%}%>
<div class="extend-customer-space"></div>
<div class="extend-customer-page">
 <a class="bt-extend-next" data-role="prev">上一页</a>
 <span class="extend-page-tip"><i data-role="pageId"><%= data.page_id + 1 %></i>/<%= data.page_count %></span>
 <a class="bt-extend-next" data-role="next">下一页</a>
</div>
</div>