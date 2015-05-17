<div class="case-item" >
    <a href="###" data-price="<% if(item.isActive == 1){ %><%= item.active_price %><% } else { %><%= item.price %><% } %>" data-role="item" data-case-id="<%= item.case_id %>" class="case-cont <% if(item.isActive == 1){ %>sale<% } %> <% if(item.isRead == 1){ %>visited<% } %> <% if(item.case_status != 1){ %>disabled<% } %>">
        <h2 class="title"><span class="js-name"><%= item.name %></span>(<%= item.loan_money %>万元</span>/<%= item.loan_month %>个月)</h2>
        <div class="info"><span><%= item.loan_type %></span>  <span><%= item.age %>岁</span>  <span><%= item.salary %>万</span></div>
        <div class="info"><span><%= item.has_fang_che %></span>  <span><%= item.card_record %></span></div>
        <% $.each(item.template_name, function(k, v) { %>
        <div class="type"><%= v %></div>
        <% }) %>
        <% if(item.isHot) { %>
        <div class="type"><i class="icon icon-hot"></i>热门推广</div>
        <% } %>
        <div class="time"><i class="icon icon-sandglass"></i><%= item.time_str %></div>
        <% if(item.isActive == 1){ %>
        <div class="price-sale">庆生价:<%= item.active_price %>元</div>
        <% } %>
        <div class="price">(<span class="js-price"><%= item.price %></span>元)</div>
        <button type="button" class="btn js-touch-state" data-case-id="<%= item.case_id %>" data-role="buy" <% if(item.case_status != 1){ %>disabled="disabled"<% } else { %> <% } %>><%= item.btn_text %></button>
    </a>
    <a href="tel:<%= item.contact %>" class="case-contact btn btn-primary js-phone <% if(item.case_status == 2){ %>active<% } %>"><i class="icon icon-tel"></i>电话联系</a>
</div>