// ===== dashboard.js : runs on admin.html only =====
// Reads the SAME localStorage key form.js writes to, so every ticket
// submitted on the public page shows up here automatically.

const KEY = 'aisin_tickets'; // must match form.js exactly
const STAGES = ['Pending', 'Processing', 'Complete'];

let tickets = JSON.parse(localStorage.getItem(KEY) || 'null') || [
  { id: 1, name: 'Ravi', dept: 'Production', cat: 'Network', loc: 'Bengalure', pri: 'High', desc: 'Line 3 PC has no internet.', stage: 0 },
  { id: 2, name: 'Mei', dept: 'HR', cat: 'Software', loc: 'Ahmedabad', pri: 'Medium', desc: 'Excel keeps crashing.', stage: 1 },
  { id: 3, name: 'Ken', dept: 'Stores', cat: 'Access / Password', loc: 'Pune', pri: 'Low', desc: 'Password reset needed.', stage: 2 }
];

let currentLoc = 'All';

const $ = id => document.getElementById(id);
const save = () => localStorage.setItem(KEY, JSON.stringify(tickets));
const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function render() {
  const visible = currentLoc === 'All'
    ? tickets
    : tickets.filter(t => t.loc === currentLoc);

  ['laneP', 'laneR', 'laneC'].forEach((lane, i) => {
    const list = visible.filter(t => t.stage === i);
    $(lane).innerHTML = list.length ? list.map(card).join('') : '<div class="empty">Nothing here 🎉</div>';
    $(['cP', 'cR', 'cC'][i]).textContent = list.length;
  });
  $('total').textContent = visible.length;

  const colors = ['#ff8a00', '#2f80ed', '#1fb37a'];
  let offset = 0;
  $('donut').innerHTML = '<circle cx="18" cy="18" r="15.9155" stroke="#8884" />' +
    STAGES.map((_, i) => {
      const pct = visible.length ? visible.filter(t => t.stage === i).length / visible.length * 100 : 0;
      const c = `<circle cx="18" cy="18" r="15.9155" stroke="${colors[i]}" stroke-dasharray="${pct} ${100 - pct}" stroke-dashoffset="${-offset}"/>`;
      offset += pct; return c;
    }).join('');
}

function card(t) {
  const buttons = STAGES.map((label, i) => {
    const isCurrent = i === t.stage;
    return `<button class="stage-btn s${i}${isCurrent ? ' active' : ''}"
      ${isCurrent ? 'disabled' : ''} onclick="setStage(${t.id}, ${i})">${label}</button>`;
  }).join('');

  return `<div class="t"><strong>#${t.id} ${esc(t.desc)}</strong>
    <span class="tag ${t.pri}">${t.pri}</span><span class="tag">${esc(t.cat)}</span>
    <small>${esc(t.name)} · ${esc(t.dept)} · ${esc(t.loc || '—')}</small>
    <div class="acts">${buttons}
    <button class="del" onclick="removeT(${t.id})">Delete</button></div></div>`;
}

function setStage(id, newStage) {
  const t = tickets.find(x => x.id === id);
  if (!t || t.stage === newStage) return;
  t.stage = newStage;
  save(); render();
  if (newStage === 2) emoji('🎉');
}

function removeT(id) { tickets = tickets.filter(x => x.id !== id); save(); render(); }

$('locFilter').addEventListener('change', e => {
  currentLoc = e.target.value;
  render();
});

// ===== Live updates across tabs =====
// If someone has admin.html open and a new issue comes in from
// index.html in a different tab, the browser fires a "storage" event
// on every OTHER open tab (never the tab that made the change). We
// listen for it so the dashboard refreshes itself without needing a
// manual page reload.
window.addEventListener('storage', e => {
  if (e.key === KEY) {
    tickets = JSON.parse(e.newValue || '[]');
    render();
  }
});

function emoji(sym) {
  for (let i = 0; i < 12; i++) {
    const s = document.createElement('span'); s.className = 'party'; s.textContent = sym;
    s.style.left = 20 + Math.random() * 60 + 'vw'; s.style.bottom = '10vh'; s.style.animationDelay = Math.random() * .4 + 's';
    document.body.appendChild(s); setTimeout(() => s.remove(), 2000);
  }
}

$('yr').textContent = new Date().getFullYear();
render();
