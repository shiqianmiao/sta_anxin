<div id="list-filter-letter-bar">
    <% _.each(letterArr, function(letter, index) { %>
        <div data-index="<%= index %>" class="js-letter-index letter" style="height: <%= ((1 / letterArr.length) * 100).toFixed(1) %>%;">
            <%= letter.toUpperCase() %>
        </div>
    <% }) %>
</div>