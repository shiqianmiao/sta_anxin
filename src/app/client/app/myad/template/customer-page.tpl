<tr>
  <th>编号</th>
  <th>点击时间</th>
  <th>用户名</th>
  <th>操作</th>
</tr>
<%_.each(data.click_record, function(item, index){%>
  <tr>
    <td><%= item.index %></td>
    <td><%= item.date %> <br><%= item.time %></td>
    <td><%= item.user_name %></td>
    <td  <%if(hideLink || !item.user_id){%>style="display:none;"<%}%>><a href="javascript:void(0)" class="bt-extend-chat" data-role="chat" data-id="<%= item.user_id %>">留言</a></td>
  </tr>
<%});%>