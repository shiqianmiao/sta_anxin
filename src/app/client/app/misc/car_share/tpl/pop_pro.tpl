<!-- 区域选择弹层 -->
        <!-- +scroll-box 弹层过长滚动 +active控制隐藏显示弹层-->
        <div class="float-bg" data-role="addrMask">
            <div class="area-pop popup">
                <a href="javascript:;" class="close-btn" data-role="close"></a>
                <div class="tit2">区域选择</div>
                <!-- start filter-group-->
                <div class="filter-group">
                    <div class="filter-cont">
                        <div class="filter-body" id="proList">
                            <div class="filter-wrap active" id="proInfo">
                                <ul class="filter-menu" id="proInfoDetail">
                                    <% provinceList.forEach(function (item) { %>
                                    <li data-ajax="<%= item.id %>"><%= item.name %></li>
                                    <% }) %>
                                </ul>
                            </div>
                            <div id="cityInfo" class="filter-wrap" data-role="cityInfo"></div>
                        </div>
                    </div>
                </div>
                <!-- /end filter-group-->
            </div>
        </div>