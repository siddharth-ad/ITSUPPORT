// ===== form.js : runs on index.html only =====
// This page's only job is to collect a new ticket and save it where
// admin.html will find it. It never reads or displays other tickets.

// IMPORTANT: this key must be spelled EXACTLY the same here and in
// dashboard.js, since it's how the two pages share one set of tickets.
const KEY = 'aisin_tickets';

const $ = id => document.getElementById(id);

// Load whatever tickets already exist (so we don't wipe out tickets
// the admin page already has) and only fall back to the starter
// examples if this is truly the first time anyone has used the site.
let tickets = JSON.parse(localStorage.getItem(KEY) || 'null') || [
  { id: 1, name: 'Ravi', dept: 'Production', cat: 'Network', loc: 'Bengalure', pri: 'High', desc: 'Line 3 PC has no internet.', stage: 0 },
  { id: 2, name: 'Mei', dept: 'HR', cat: 'Software', loc: 'Ahmedabad', pri: 'Medium', desc: 'Excel keeps crashing.', stage: 1 },
  { id: 3, name: 'Ken', dept: 'Stores', cat: 'Access / Password', loc: 'Pune', pri: 'Low', desc: 'Password reset needed.', stage: 2 }
];

const save = () => localStorage.setItem(KEY, JSON.stringify(tickets));

$('form').addEventListener('submit', e => {
  e.preventDefault();

  tickets.push({
    id: Date.now() % 100000,
    name: $('name').value,
    dept: $('dept').value,
    cat: $('cat').value,
    loc: $('loc').value,
    pri: $('pri').value,
    desc: $('desc').value,
    stage: 0   // every new ticket starts life as Pending
  });

  save();
  e.target.reset();

  // Confirmation shown IN PLACE on this same page - we do not send the
  // person to admin.html, since that page is for IT staff only.
  const status = $('formStatus');
  status.textContent = "Thanks! Your issue has been logged and sent to IT.";
  status.classList.add('ok');
  setTimeout(() => { status.textContent = ''; status.classList.remove('ok'); }, 4000);
});

// ===== Admin sign-in =====
// IMPORTANT: this is a simple front-end check, not real security.
// Anyone who views this page's source or opens the browser's dev
// tools can read the two values below. It stops a casual employee
// from wandering into the dashboard - it does not protect anything
// truly sensitive. Change both values below before using this for
// real, and pick something only your IT team would guess.
const ADMIN_USER = 'itadmin';
const ADMIN_PASS = 'aisin@2026';

const overlay = $('adminOverlay');
const adminForm = $('adminForm');
const adminError = $('adminError');

function openAdminModal() {
  overlay.hidden = false;   // removes "hidden" so the box appears
  $('adminUser').focus();
}
function closeAdminModal() {
  overlay.hidden = true;    // adds "hidden" back so it disappears
  adminForm.reset();
  adminError.textContent = '';
}

$('adminOpenBtn').addEventListener('click', openAdminModal);
$('adminCancel').addEventListener('click', closeAdminModal);

// Clicking the dark area outside the box also closes it, same as most
// sign-in popups behave
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeAdminModal();
});

adminForm.addEventListener('submit', (e) => {
  e.preventDefault(); // stop the form from reloading the page
  const user = $('adminUser').value.trim();
  const pass = $('adminPass').value;

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    window.location.href = 'admin.html'; // correct credentials -> go to the dashboard
  } else {
    adminError.textContent = 'Incorrect username or password.';
    $('adminPass').value = '';
    $('adminPass').focus();
  }
});

$('yr').textContent = new Date().getFullYear();
