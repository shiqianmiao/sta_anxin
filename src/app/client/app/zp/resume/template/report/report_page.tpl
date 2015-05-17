<section class="section">

  <!-- form start -->
  <form id="form"
        data-widget="app/client/app/zp/resume/view/report_page.js#form"
        data-content-length="200"
    action="">
    <%if(userId){%>
      <input type="hidden" name="user_id" value="<%= userId %>">
    <%}%>
    <input type="hidden" name="puid" value="<%= puid %>">
    <div class="form-widget">
      <div class="form-group">
        <div class="form-field">
          <div class="form-item">
            <label class="form-label">举报类型</label>
            <div class="form-control">
              <div data-widget="app/client/app/zp/resume/view/report_page.js#picker" data-role="selecter" class="filter-group">
                <div data-role="title" class="filter-tips active">请选择举报类型</div>
                <div data-role="value" class="filter-value"></div>

                <input type="hidden" value="" data-role="reasonId" name="reasonId">
                <div data-widget="app/client/app/zp/resume/view/report_page.js#popPicker" data-role="options" class="filter-cont">
                  <div class="filter-head">
                    <h2 class="filter-title">举报类型</h2>
                    <button data-role="cancel" class="filter-opt">取消</button>
                  </div>
                  <div class="filter-wrap" data-role="wraper">
                    <ul class="filter-menu">
                      <li data-value="1" data-role="option" class="js-touch-state">
                        广告简历(以买卖东西或宣传位目的的简历)
                      </li>
                      <li data-value="2" data-role="option" class="js-touch-state">
                        垃圾简历（内容乱填、乱写等）
                      </li>
                      <% if (isMy) { %>
                      <li data-value="3" data-role="option" class="js-touch-state">
                          空号
                      </li>
                      <li data-value="4" data-role="option" class="js-touch-state">
                          错号（手机号不是本人）
                      </li>
                      <li data-value="5" data-role="option" class="js-touch-state">
                          关机/停机（停关机属正常现象，请多试几次）
                      </li>
                      <li data-value="6" data-role="option" class="js-touch-state">
                          已找到工作（建议下载后尽快联系，以免过期）
                      </li>
                      <% } %>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-field">
          <div class="form-item vertical">
            <label class="form-label">情况说明</label>
            <div class="form-control">
              <div class="textarea-group">
                <textarea name="content" id="" cols="" rows="" placeholder="请描述您遇到的问题"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="form-field">
          <div class="form-item">
            <label class="form-label">联系电话</label>
            <div class="form-control">
              <label class="input-group">
                <input type="number" name="phone" class="input-text" placeholder="方便我们联系到您" value=""></label>
            </div>
          </div>
        </div>
      </div>
      <div class="form-opt">
          <button type="submit" class="btn btn-primary btn-large js-touch-state">提交</button>
      </div>
    </div>
  </form>
  <!-- form end -->
  <!-- summary start -->
  <div class="summary">
    <ol class="text-list text-list2">
      <li>1.请尽量详细反映实际情况，以便我们及时的处理您的举报</li>
      <li>2.留下您的电话，方便我们的客服与您联系</li>
    </ol>
  </div>
  <!-- summary end -->
</section>
<div id="mask" class="mask"></div>