(function () {
  'use strict';

  var grid = document.getElementById('grid');
  var empty = document.getElementById('empty');
  var searchInput = document.getElementById('search');
  var filtersEl = document.getElementById('filters');
  var countEl = document.getElementById('count');

  var resources = [];

  function render(resourcesToRender) {
    grid.innerHTML = '';

    if (resourcesToRender.length === 0) {
      empty.hidden = false;
      countEl.textContent = '';
      return;
    }

    empty.hidden = true;

    resourcesToRender.forEach(function (resource) {
      var card = document.createElement('article');
      card.className = 'card';

      var header = document.createElement('div');
      header.className = 'card-header';

      var title = document.createElement('h2');
      title.textContent = resource.title;

      var badge = document.createElement('span');
      badge.className = 'source-badge';
      badge.textContent = resource.source;

      header.appendChild(title);
      header.appendChild(badge);

      var desc = document.createElement('p');
      desc.textContent = resource.description;

      var tags = document.createElement('div');
      tags.className = 'tags';
      resource.tags.forEach(function (tag) {
        var t = document.createElement('span');
        t.className = 'tag';
        t.textContent = tag;
        tags.appendChild(t);
      });

      var footer = document.createElement('div');
      footer.className = 'card-footer';

      var cost = document.createElement('span');
      cost.style.marginLeft = 'auto';
      cost.style.fontSize = '0.8rem';
      cost.style.color = '#6b7280';
      cost.textContent = resource.cost;

      var link = document.createElement('a');
      link.className = 'btn open';
      link.href = resource.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Open official page &rarr;';

      footer.appendChild(cost);
      footer.appendChild(link);

      card.appendChild(header);
      card.appendChild(desc);
      card.appendChild(tags);
      card.appendChild(footer);

      grid.appendChild(card);
    });

    countEl.textContent = resourcesToRender.length + ' resource' + (resourcesToRender.length !== 1 ? 's' : '') + ' shown';
  }

  function buildFilters() {
    var categories = [];
    resources.forEach(function (r) {
      if (categories.indexOf(r.category) === -1) {
        categories.push(r.category);
      }
    });

    categories.forEach(function (category) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter-btn';
      btn.textContent = category;
      btn.addEventListener('click', function () {
        var isActive = btn.classList.contains('active');

        document.querySelectorAll('.filter-btn').forEach(function (b) {
          b.classList.remove('active');
        });

        if (!isActive) {
          btn.classList.add('active');
        }

        applyFilters();
      });
      filtersEl.appendChild(btn);
    });
  }

  function matchesSearch(resource, term) {
    var haystack = (
      resource.title + ' ' +
      resource.category + ' ' +
      resource.description + ' ' +
      resource.tags.join(' ') +
      ' ' + resource.source
    ).toLowerCase();
    return haystack.indexOf(term.toLowerCase()) !== -1;
  }

  function applyFilters() {
    var term = searchInput.value;
    var activeBtn = document.querySelector('.filter-btn.active');
    var category = activeBtn ? activeBtn.textContent : null;

    var filtered = resources.filter(function (r) {
      var searchOk = term.length === 0 || matchesSearch(r, term);
      var catOk = !category || r.category === category;
      return searchOk && catOk;
    });

    render(filtered);
  }

  searchInput.addEventListener('input', applyFilters);

  fetch('resources.json')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Failed to load resources.json');
      }
      return response.json();
    })
    .then(function (data) {
      resources = data;
      buildFilters();
      applyFilters();
    })
    .catch(function (err) {
      grid.innerHTML = '<div class="empty">Failed to load resource data.</div>';
      console.error(err);
    });
})();
