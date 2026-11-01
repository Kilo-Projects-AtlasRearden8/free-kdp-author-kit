'use strict';

var fs = require('fs');
var path = require('path');

var root = process.cwd();
var errors = [];
var checks = 0;

function check(cond, msg) {
  checks += 1;
  if (!cond) {
    errors.push(msg);
    console.log('FAIL: ' + msg);
  } else {
    console.log('ok: ' + msg);
  }
}

function read(name) {
  return fs.readFileSync(path.join(root, name), 'utf8');
}

// 1. Files exist
['README.md', 'LICENSE', 'resources.json', 'index.html', 'style.css', 'app.js'].forEach(function (f) {
  check(fs.existsSync(path.join(root, f)), 'file exists: ' + f);
});

// 2. LICENSE copyright line exactly
var license = read('LICENSE');
check(license.indexOf('Copyright (c) 2026 Asdale Dynamics, LLC') !== -1, 'LICENSE has exact copyright line');
check(!license.match(/Copyright \(c\) [0-9]{4} Asdale Dynamics, LLC,?/g) || license.match(/Copyright \(c\) 2026 Asdale Dynamics, LLC/g).length === 1, 'LICENSE copyright line occurs exactly once');

// 3. README credit
var readme = read('README.md');
check(readme.indexOf('Asdale Dynamics, LLC') !== -1, 'README credits Asdale Dynamics, LLC');

// 4. resources.json valid
var resources = JSON.parse(read('resources.json'));
check(Array.isArray(resources), 'resources.json is a JSON array');
check(resources.length > 0, 'resources.json has at least one resource');

var validCategories = ['Cover templates', 'Blurb writers', 'Category pickers', 'Royalty calculators'];
var seenCategories = {};

resources.forEach(function (r, i) {
  var prefix = 'resource #' + i + ' (' + r.title + ')';
  check(typeof r.id === 'string' && r.id.length > 0, prefix + ' has id');
  check(typeof r.title === 'string' && r.title.length > 0, prefix + ' has title');
  check(typeof r.category === 'string' && validCategories.indexOf(r.category) !== -1, prefix + ' has valid category');
  check(typeof r.description === 'string' && r.description.length > 0, prefix + ' has description');
  check(Array.isArray(r.tags) && r.tags.length > 0, prefix + ' has tags');
  check(typeof r.url === 'string' && r.url.length > 0, prefix + ' has url');
  check(typeof r.source === 'string' && r.source.length > 0, prefix + ' has source');

  // official links only: amazon.com or kdp.amazon.com or authorcentral.amazon.com
  var u = new URL(r.url);
  var host = u.hostname;
  var official = host === 'amazon.com' || host === 'www.amazon.com' || host === 'kdp.amazon.com' || host === 'authorcentral.amazon.com' || host === 'kindlecreate.amazon.com';
  check(official, prefix + ' url is official: ' + r.url);
  check(u.protocol === 'https:', prefix + ' url is https: ' + r.url);

  seenCategories[r.category] = (seenCategories[r.category] || 0) + 1;
});

validCategories.forEach(function (c) {
  check((seenCategories[c] || 0) > 0, 'category present: ' + c);
});

// 5. index.html references
var html = read('index.html');
var app = read('app.js');
check(html.indexOf('style.css') !== -1, 'index.html links style.css');
check(html.indexOf('app.js') !== -1, 'index.html links app.js');

var appBundle = html + '\n' + app;
check(appBundle.indexOf('resources.json') !== -1, 'site loads resources.json (app.js)');
check(appBundle.indexOf('Asdale Dynamics, LLC') !== -1, 'site credits Asdale Dynamics, LLC');

// 6. app.js has client-side search/filter
check(app.indexOf('addEventListener') !== -1, 'app.js wires up input events');
check(app.indexOf('filter') !== -1, 'app.js filters resources');

// 7. No secrets / workflows
var all = [readme, license, resources, html, require('fs').readFileSync(path.join(root, 'style.css'), 'utf8'), app].join('\n');
check(!/sk-|API[_-]?KEY|secret|password|token/i.test(all.replace(/Asdale/g, '')), 'no apparent secrets or keys');
check(!fs.existsSync(path.join(root, '.github')), 'no .github/workflows added');

// 8. git status clean check handled outside

console.log('\n' + checks + ' checks, ' + errors.length + ' failure(s)');
process.exit(errors.length === 0 ? 0 : 1);
