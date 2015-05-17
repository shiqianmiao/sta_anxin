<section class="choose_position"
    data-widget="app/client/app/xiche/pub_page/view/choose_position.js#form"
    data-city-id="12"
    data-city-name="<%= cityInfo.cityName %>"
    data-params='<%= JSON.stringify(params).replace(/\'/g, "`") %>'
    data-is-latlng-avaliable='<%= isLatlngAvaliable %>'
>
    <header class="yxc-brand boder-bottom">
        <a class="arrow-wrapper">
            <i data-role="back" class="bt-brand-back"></i>
        </a>
        <span>设置车辆停放位置</span>
    </header>
    <form action="" method="post" class="fm-pos"
        onsubmit="javascript: return false;"
    >
        <div class="content">
            <input type="text" placeholder="请输入车辆停放地址" value="" class="ipt-position" data-role="input">
            <div data-role="comment">
                <p class="service-range"><%= serviceArea.tips %></p>
                <p class="remarks-tip">备注（选填，如新龙城13号楼下白色高尔夫）</p>
                <textarea name="" cols="" rows="" class="remarks-area" data-role="commentText"></textarea>
                <input data-role="confirm" name="" type="button" class="bt-sub-eveal disable" value="确定">
            </div>
            <div data-role="userAddressList">
                <% userAddress.forEach(function (item) { %>
                <div class="posi-list"
                    data-role="item"
                    data-latlng="<%= item.latlng %>"
                    data-name="<%= item.address_name %>"
                    data-address="<%= item.address_remark %>"
                >
                    <h3><%= item.address %></h3>
                    <%= item.address_name %>
                    <span><%= item.address_remark %></span>
                </div>
                <% }) %>
                <% addressHistoryList.forEach(function (item) { %>
                <div class="posi-list"
                    data-role="item"
                    data-latlng="<%= item.latlng %>"
                    data-name="<%= item.addressName %>"
                    data-address="<%= item.addressComment %>"
                >
                    <%= item.addressName %>
                    <span><%= item.addressComment %></span>
                </div>
                <% }) %>
            </div>
            <div data-role="list"></div>
            <script type="text/template" data-role="listTemplate">
                <%= '<' + '% list.forEach(function (item) { %' + '>' %>
                <div class="posi-list posi2-list"
                    data-role="item"
                    data-latlng="<%= '<' + '%= item.location.lat + "," + item.location.lng %' + '>' %>"
                    data-name="<%= '<' + '%= item.name %' + '>' %>"
                    data-address="<%= '<' + '%= item.address %' + '>' %>"
                >
                    <h3><%= '<' + '%= item.name %' + '>' %></h3>
                    <%= '<' + '%= item.address %' + '>' %>
                </div>
                <%= '<' + '% }) %' + '>' %>
            </script>
        </div>
    </form>
</section>
