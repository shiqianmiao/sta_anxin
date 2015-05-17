<section class="index">
    <div class="banner"><img src="http://sta.ganji.com/att/project/app/greetingcard/images/banner.png" alt=""></div>
    <div class="index-ds">当当当~金羊贺岁祝福到！赶集生活<b>2015新春贺卡</b>齐发，送祝福，小驴帮你来传达~</div>
    <ul class="index-list">
        <% _.range(1, 11).forEach(function (i) { %>
        <li class="list-item">
            <a href="javascript:;" data-js-a="app/client/app/misc/greeting_card/view/card/show_card.js?template_id=<%= i %>&isShow=1" target="_blank">
                <img src="http://sta.ganji.com/att/project/app/greetingcard/images/cover_<%= i < 10 ? ('0' + i) : i%>.png" alt="">
            </a>
        </li>
        <% }) %>
    </ul>
</section>
<footer class="footer"><a href="javascript:;" class="logo">赶集网</a></footer>