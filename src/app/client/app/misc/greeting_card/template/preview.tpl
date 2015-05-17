<section class="wrap preview" data-widget="app/client/app/misc/greeting_card/view/card/preview_card.js#preCard">
    <div class="card card-<%= cardId %>" data-role="cardBody">
        <div class="card-head">
            <% if (['01', '03'].indexOf(cardId) !== -1) { %>
            <img src="http://sta.ganji.com/att/project/app/greetingcard/images/card_<%= cardId %>/bg_head.jpg" alt="">
            <% } %>
            <% if (['05'].indexOf(cardId) !== -1) { %>
            <img src="http://sta.ganji.com/att/project/app/greetingcard/images/card_<%= cardId %>/bg_head.png" alt="">
            <% } %>
        </div>
        <div class="card-body">
            <% if(data.hasMusic !== false) {%>
            <div class="player" data-role="bgPlayBtn">
                <audio data-role="bgMusic" preload="auto" loop>
                    <source src="http://sta.ganji.com/att/project/app/greetingcard/images/<%= MUSIC[cardId] %>.mp3" type="audio/mpeg">
                </audio>
                <div class="play rotate"></div>
            </div>
            <% } %>
            <div class="post">
                <div class="post-title"><%= typeof data.toWho === 'undefined' ? '阿童木叔叔' : (data.toWho || '') %>：</div>
                <div class="post-cont"><%= typeof data.greetingArea === 'undefined' ? GREETING_TEXTS[cardId] : (data.greetingArea || '') %></div>
                <div class="post-author"><%= typeof data.fromWho === 'undefined' ? '小季' : (data.fromWho || '') %></div>
                <% if(data.hasRecord !== false) { %>
                <div class="post-record active" data-role="playBtn">
                    <i class="icon-record"></i>
                    <button type="button" class="btn-play">播放</button>
                    <span class="time" data-role="recordLength"><%= data.recordLength || 2 %>'</span>
                    <audio data-role="recordAudio" preload="auto">
                        <source src="<%= data.recordUrl ? data.recordUrl + '.mp3' : 'http://sta.ganji.com/att/project/app/greetingcard/images/default.mp3'%>" type="audio/mpeg">
                    </audio>
                </div>
                <% } %>
            </div>
        </div>
        <div class="card-foot">
            <small class="copyright">农历乙未羊年</small>
        </div>
    </div>
    <div class="footbar active">
        <div class="nav-group" data-widget="app/client/app/misc/greeting_card/widget/footer.js">
            <nav class="nav-list" data-role="wrapper">
                <% '一二三四五六七八九十'.split('').forEach(function (word, i) { %>
                <a class="nav-item nav-card-<%= i < 9 ? ('0' + (i+1)) : (i+1) %><% if (cardId === i+1) {%> active<%}%>"
                    data-url="app/client/app/misc/greeting_card/view/card/preview_card.js?template_id=<%= i+1 %>&isShow=<%= isShow %>"
                    data-role="card"
                >贺卡<%= word %></a>
                <% }) %>
            </nav>
        </div>
        <div class="btn-group" >
            <a data-js-a="app/client/app/misc/greeting_card/view/card/edit_card.js?template_id=<%= parseInt(cardId) %>" class="btn btn-default btn-large" data-role="editCard">编辑</a>
            <a href="javascript:;" class="btn btn-default btn-large <%= data.isSend %>" data-role="sendCard">发送</a>
        </div>
    </div>
</section>