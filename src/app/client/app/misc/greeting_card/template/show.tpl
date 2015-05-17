<div data-widget="app/client/app/misc/greeting_card/view/card/show_card.js#showCard">
    <section class="wrap">
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
                <% if(data.hasRecord) { %>
                <div class="post-record" data-role="playRecordBtn">
                    <i class="icon-record"></i>
                    <button type="button" class="btn-play">播放</button>
                    <span class="time" data-role="recordLength"><%= data.recordLength %></span>
                    <audio data-role="recordAudio" preload="auto">
                        <source src="<%= data.recordUrl + '.mp3' %>" type="audio/mpeg">
                    </audio>
                </div>
                <% } %>
                </div>
            </div>
            <div class="card-foot">
                <small class="copyright">农历乙未羊年</small>
            </div>
        </div>
    </section>
    <div class="share" data-role="weixinMask">
        <div class="share-cont">请点击右上角<br>在浏览器中打开</div>
    </div>
    <div class="footbar active">
        <div class="btn-group">
            <% if (isShow) { %>
            <a href="javascript:;" class="btn btn-primary btn-large" data-gjalog="100000000218000100000010" data-role="useClient">使用赶集客户端发贺卡</a>
            <% } else { %>
            <a data-js-a="app/client/app/misc/greeting_card/view/index.js" data-gjalog="100000000217000100000010" class="btn btn-primary btn-large">我也要发贺卡</a>
            <% } %>
        </div>
    </div>
</div>