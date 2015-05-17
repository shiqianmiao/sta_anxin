<div class="coupon-comm<% if (coupon.special_status === '3'){%> active<% } %>">
    <div class="coupon-left">
        <em>¥</em>
        <%= coupon.special_price %>
    </div>
    <div class="coupon-right">
        <h3>优惠券</h3>
        <p><%= coupon.special_summary %></p>
        <p>
            <%= coupon.expires_time_text %>
        </p>
        <p class="coupon-spe">
            <%= coupon.activity_name %>
        </p>
    </div>
</div>
