<%if(userInfo){%>
    <div data-user-info='<%= JSON.stringify(userInfo) %>' class="user-avatar">
    <% if (userInfo.user_avatar) { %>
        <img src="<%= userInfo.user_avatar %>" alt="">
    <% } else { %>
        <img src="http://sta.ganjistatic1.com/src/image/mobile/app/LV_Mall/avatar.png" alt="">
    <% } %>
    </div>
    <div class="user-name"><%=userInfo.user_name%></div>
    <div class="user-jifen">积分 <b data-role="credit"><%=userInfo.credit%></b></div>
    <div class="user-detail">明细</div>
<%}else{%>
    <div class="user-avatar">
        <img src="http://sta.ganjistatic1.com/src/image/mobile/app/LV_Mall/avatar.png" alt="">
    </div>
    <div class="user-name">登录</div>
<%}%>