<!-- nav start -->
<nav id="tab" class="nav" data-widget="app/client/app/zp/resume/view/icenter_page.js#tab" data-active="#receiveList">
    <a href="javascript: void(0);" data-role="tabTitle" data-for="#receiveList">我收到的简历</a>
    <a href="javascript: void(0);" data-role="tabTitle" data-for="#downloadList">我下载的简历</a>
</nav>
<!-- nav end -->
<!-- section start -->
<section class="section" id="receiveList"
    data-widget="app/client/app/zp/resume/view/icenter_page.js#list"
    data-type="recieve"
>
<!-- list start -->
    <div class="list list2">
        <ul class="list-items" data-role="list">
        </ul>
        <div class="more" data-role="more">加载中...</div>
    </div>
    <section class="section loading-section">
        <div class="page-status status-loading">
            <div class="status-tips js-loading-tip">努力加载中...</div>
        </div>
    </section>
    <section class="section nothing-section">
        <div class="page-status status-nothing">
            <div class="status-tips js-nothing-tip">您还没有收到过简历</div>
        </div>
    </section>
    <section class="section offline-section">
        <div class="page-status status-offline">
            <div class="status-tips js-offline-tip">当前无法访问网络，请稍后重试！</div>
        </div>
    </section>
<!-- list end -->
</section>
<!-- section end -->
<!-- section start -->
<section class="section" id="downloadList"
    data-widget="app/client/app/zp/resume/view/icenter_page.js#list"
    data-type="download"
>
<!-- list start -->
    <div class="list list2">
        <ul class="list-items" data-role="list">
        </ul>
        <div class="more" data-role="more">加载中...</div>
    </div>
    <section class="section loading-section">
        <div class="page-status status-loading">
            <div class="status-tips js-loading-tip">努力加载中...</div>
        </div>
    </section>
    <section class="section nothing-section">
        <div class="page-status status-nothing">
            <div class="status-tips js-nothing-tip">您还没有简历，请到简历库中下载想要的简历</div>
        </div>
    </section>
    <section class="section offline-section">
        <div class="page-status status-offline">
            <div class="status-tips js-offline-tip">当前无法访问网络，请稍后重试！</div>
        </div>
    </section>

</section>