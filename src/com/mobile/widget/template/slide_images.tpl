<div class="big-images-slider" data-init-index="<%= index %>" data-widget="com/mobile/widget/slideshow.js">
    <div class="caption">
        <span class="big-index" data-role="index"><%= index %></span>/<%= srcList.length %>张<i class="close" data-role="close"></i>
    </div>
    <div class="big-img-body">
        <ul class="slide-area clear" data-role="list">
            <% _.each(srcList, function(item) { %>
                <li data-role="item" style="width: <%= fixWidth %>px;">
                    <img src="<%= item %>" style="width: <%= fixWidth %>px;">
                </li>
            <% }) %>
        </ul>
    </div>
</div>