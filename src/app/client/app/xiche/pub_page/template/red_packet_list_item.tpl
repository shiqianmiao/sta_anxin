<div class="red-common">
  <div class="red-comm-left">
      <h3><%= redPacket.title %></h3>
      <span><%= redPacket.expires_time_text %></span>
      <em><%= redPacket.record_time_text %></em>
  </div>
  <% if (parseInt(redPacket.price) >= 0) { %>
      <span class="red-comm-right">+<%= redPacket.price %></span>
  <% } else { %>
      <span class="red-comm-right red-minus"><%= redPacket.price %></span>
  <% } %>
</div>