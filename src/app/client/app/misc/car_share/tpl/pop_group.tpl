<!-- +scroll-box 弹层过长滚动 +active控制隐藏显示弹层-->
    <div class="float-bg active">
        <div class="group-box">
            <p>我们为你找到了能和你一起拼车回家的老乡群，快加入进去聊聊吧，祝君早日回家团圆！</p>
            <ul>
                <% groupList.forEach(function (item) { %>
                <li>
                    <a href="http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/misc/car_share/view/group_join.js?group_id=<%= item.groupId %>&city_id=<%=groupList.cityId %>" data-native-a="1" target="_blank">
                        <div class="head-img">
                            <img src="http://image.ganjistatic1.com/<%= item.avatar.replace(/(\\d*)-(\\d*)_(\\d)-(\\d)/, '28-28c_9-$4') %>" alt="">
                        </div>
                        <div class="con">
                            <p class="con-name"><%= item.name %>
                                <% if(item.type === 1){ %>
                                <i class="hot-chat">热聊</i>
                                <% } %>
                            </p>
                            <p>
                                <i class="level"><%= item.level %></i>
                                <span class="le-data"><%= item.currentCount %>/<%= item.maxCount %></span>
                            </p>
                            <p class="des"><%= item.introduction %></p>
                        </div>
                    </a>
                </li>
                <% }) %>
            </ul>
        </div>
    </div>