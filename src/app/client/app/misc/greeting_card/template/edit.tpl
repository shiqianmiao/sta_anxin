<section class="wrap edit"
    data-widget="app/client/app/misc/greeting_card/view/card/edit_card.js#editCard"
    data-id="<%= id %>"
>
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
            <% if(data.hasMusic !== false) { %>
            <div class="player" data-role="bgPlayBtn">
                <div class="play rotate"></div>
                <i class="icon-close" data-role="closeBgMusic"></i>
                <audio data-role="bgMusic" preload="auto" loop>
                    <source src="http://sta.ganji.com/att/project/app/greetingcard/images/<%= MUSIC[cardId] %>.mp3" type="audio/mpeg">
                </audio>
            </div>
            <% } %>
            <div class="post">
                <div class="post-title">
                    <input class="input-text" maxlength="5" type="text" type="text" placeholder="朋友" value="<%= data.toWho %>" data-role="toWho">
                    <i class="icon-close" data-role="clearToWho"></i>
                </div>
                <div class="post-cont">
                    <textarea maxlength="80" class="textarea" cols="" rows="" placeholder="" data-role="greetingArea"><%= typeof data.greetingArea === 'undefined' ? GREETING_TEXTS[cardId] : (data.greetingArea || '') %></textarea>
                    <i class="icon-close" data-role="clearGreetingArea"></i>
                </div>
                <div class="post-author">
                    <input maxlength="5" class="input-text" type="text" placeholder="署名" value="<%= data.fromWho %>" data-role="fromWho">
                    <i class="icon-close" data-role="clearFromWho"></i>
                </div>
                <div class="post-record" data-role="recordingArea">
                    <i class="icon-record"></i>
                    <button type="button" class="btn-play" data-role="playRecordingBtn">录音</button>
                    <span class="time" data-role="recordLength">15'</span>
                    <i class="icon-close" data-role="clearRecording"></i>
                </div>
            </div>
        </div>
        <div class="card-foot">
            <small class="copyright">农历乙未羊年</small>
        </div>
    </div>
    <div class="record-wedget" data-role="recordingMask">
        <div class="record-body">
            <h3 class="record-title">你想对TA说些什么</h3>
            <div class="record-box" data-role="recordingEffect"><span><i></i></span></div>
            <div class="record-bar" data-role="recordingActive">
                <button type="button" class="btn-record" data-role="recordingBtn"></button>
            </div>
            <audio data-role="recordAudio" preload="auto">
                <source src="<%= data.recordUrl %>" type="audio/mpeg" data-role="recordingSrc">
            </audio>
            <i class="record-close js-touch-state" data-role="closeRecording"></i>
        </div>
    </div>
    <div class="footbar active" data-role="footer">
        <div class="nav-group" data-widget="app/client/app/misc/greeting_card/widget/footer.js">
            <nav class="nav-list" data-role="wrapper">
                <% '一二三四五六七八九十'.split('').forEach(function (word, i) { %>
                <a class="nav-item nav-card-<%= i < 9 ? ('0' + (i+1)) : (i+1) %><% if (cardId === i+1) {%> active<%}%>"
                    data-url="app/client/app/misc/greeting_card/view/card/edit_card.js?template_id=<%= i+1 %>"
                    data-role="card"
                >贺卡<%= word %></a>
                <% }) %>
            </nav>
        </div>
        <div class="btn-group">
            <a  href="javascript:;" class="btn btn-default btn-large" data-role="toPre">预览</a>
            <a href="javascript:;" class="btn btn-default btn-large" data-role='sendCard'>发送</a>
        </div>
    </div>
</section>