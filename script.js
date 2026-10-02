'use strict';
const $ = (selector) => document.querySelector(selector);
const card = $('#student-card');
let likes = 0;
let currentTab = 'html';
const escapeHtml = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
function showCode() {
  const snippets = {
    html: `<article class="student-card">\n  <h3 id="student-name">${escapeHtml($('#name').value.trim() || 'Sinh viên')}</h3>\n  <p>Đang khám phá lập trình web.</p>\n  <button id="like">Thích <span id="count">${likes}</span></button>\n</article>`,
    css: `.student-card {\n  display: flex;\n  flex-direction: ${$('#horizontal').checked ? 'row' : 'column'};\n  border-top: 4px solid ${$('#color').value};\n  border-radius: ${$('#radius').value}px;\n  padding: 30px;\n}`,
    js: `let likes = 0;\nconst button = document.querySelector('#like');\nconst counter = document.querySelector('#count');\n\nbutton.addEventListener('click', () => {\n  likes += 1;\n  counter.textContent = likes;\n});`
  };
  $('#code').textContent = snippets[currentTab];
  $('#code-note').textContent = {html:'Đoạn mã rút gọn: minh họa cấu trúc thẻ và nội dung hiện tại trong DOM.',css:'Đoạn mã rút gọn: các giá trị đồng bộ với điều khiển bên trên. Trên màn hình hẹp, media query chuyển bố cục thành dọc.',js:'Đoạn mã rút gọn: querySelector chọn phần tử; addEventListener lắng nghe click; textContent cập nhật nội dung.'}[currentTab];
}
function log(message) { $('#event').textContent = message; }
function updateName() {
  const name = $('#name').value.trim() || 'Sinh viên';
  $('#student-name').textContent = name;
  $('.avatar').textContent = name.split(/\s+/).slice(-2).map(word => word[0]).join('').toUpperCase();
  log('input → cập nhật textContent của tên sinh viên');
  showCode();
}
$('#name').addEventListener('input', updateName);
$('#color').addEventListener('input', () => {
  card.style.setProperty('--accent', $('#color').value);
  $('#hex').textContent = $('#color').value;
  log('input → thay đổi màu viền và màu nhấn bằng CSS');
  showCode();
});
$('#radius').addEventListener('input', () => {
  card.style.borderRadius = `${$('#radius').value}px`;
  $('#radius-value').textContent = `${$('#radius').value} px`;
  log('input → cập nhật border-radius');
  showCode();
});
$('#horizontal').addEventListener('change', () => {
  card.classList.toggle('horizontal', $('#horizontal').checked);
  log('change → bật/tắt class horizontal (Flexbox)');
  showCode();
});
$('#like').addEventListener('click', () => {
  likes += 1;
  $('#count').textContent = likes;
  log(`click → likes = ${likes} → cập nhật bộ đếm trong DOM`);
  showCode();
});
const tabs = [...document.querySelectorAll('[data-tab]')];
function selectTab(tab) {
  currentTab = tab.dataset.tab;
  tabs.forEach(item => { item.setAttribute('aria-selected', String(item === tab)); item.tabIndex = item === tab ? 0 : -1; });
  $('#code-panel').setAttribute('aria-labelledby', tab.id);
  showCode();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let target;
    if (event.key === 'ArrowRight') target = tabs[(index + 1) % tabs.length];
    if (event.key === 'ArrowLeft') target = tabs[(index + tabs.length - 1) % tabs.length];
    if (event.key === 'Home') target = tabs[0];
    if (event.key === 'End') target = tabs[tabs.length - 1];
    if (target) { event.preventDefault(); selectTab(target); target.focus(); }
  });
});
$('#reset').addEventListener('click', () => {
  $('#name').value = 'Nguyễn Minh Anh';
  $('#color').value = '#2563eb';
  $('#hex').textContent = '#2563eb';
  $('#radius').value = '16';
  $('#radius-value').textContent = '16 px';
  $('#horizontal').checked = false;
  card.classList.remove('horizontal');
  card.style.removeProperty('--accent');
  card.style.removeProperty('border-radius');
  likes = 0;
  $('#count').textContent = '0';
  updateName();
  log('Đã đặt lại nội dung, giao diện và bộ đếm.');
});
showCode();
