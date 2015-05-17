<div class="big-images-slider" data-init-index="<%= index %>" data-widget="com/mobile/widget/full_screen_swipe.js">
    <div data-role="swipe" class="swipe">
        <div class="swipe-wrap">
            <% _.each(srcList, function(item) { %>
            <div style="width: <%= fixWidth %>px; height: <%= fixHeight %>px;">
                <img src="<%= item %>" style="width: <%= fixWidth %>px; max-height: <%= fixHeight %>px;">
            </div>
            <% }) %>
        </div>
    </div>
    <div class="swipe-index">
        <% _.each(srcList, function(item, i) { %>
        <i data-role="index" class=<%= i === index ? "active" : "" %>></i>
        <% }) %>
    </div>
</div>