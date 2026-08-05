/* ============================================
   Registrar's Ledger — application logic
   ============================================ */

const STORAGE_KEY = 'registrar_students_v1';

/** @type {Array<Object>} */
let students = loadStudents();

// ---- DOM refs ----
const form = document.getElementById('studentForm');
const studentIdField = document.getElementById('studentId');
const fullName = document.getElementById('fullName');
const studentNumber = document.getElementById('studentNumber');
const dob = document.getElementById('dob');
const email = document.getElementById('email');
const course = document.getElementById('course');
const year = document.getElementById('year');

const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const search = document.getElementById('search');
const filterCourse = document.getElementById('filterCourse');
const exportBtn = document.getElementById('exportBtn');
const rosterBody = document.getElementById('rosterBody');
const emptyState = document.getElementById('emptyState');
const statTotal = document.getElementById('statTotal');
const statCourses = document.getElementById('statCourses');
const nextRollPreview = document.getElementById('nextRollPreview');

const cardName = document.getElementById('cardName');
const cardCourse = document.getElementById('cardCourse');
const cardNumber = document.getElementById('cardNumber');
const cardDob = document.getElementById('cardDob');
const cardYear = document.getElementById('cardYear');

// ---- persistence ----
function loadStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Could not read saved students:', err);
    return [];
  }
}

function saveStudents() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (err) {
    console.error('Could not save students:', err);
  }
}

// ---- validation ----
function showError(fieldId, message) {
  const el = document.querySelector(`.field__error[data-for="${fieldId}"]`);
  if (el) el.textContent = message || '';
}

function clearErrors() {
  document.querySelectorAll('.field__error').forEach(el => (el.textContent = ''));
}

function validate() {
  clearErrors();
  let valid = true;

  if (!fullName.value.trim()) {
    showError('fullName', 'Full name is required.');
    valid = false;
  }

  if (!studentNumber.value.trim()) {
    showError('studentNumber', 'Student number is required.');
    valid = false;
  } else {
    const duplicate = students.find(
      s => s.studentNumber === studentNumber.value.trim() && s.id !== studentIdField.value
    );
    if (duplicate) {
      showError('studentNumber', 'This student number is already registered.');
      valid = false;
    }
  }

  if (!dob.value) {
    showError('dob', 'Date of birth is required.');
    valid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
    showError('email', 'Enter a valid email address.');
    valid = false;
  }

  if (!course.value) {
    showError('course', 'Select a programme.');
    valid = false;
  }

  if (!year.value) {
    showError('year', 'Select a year of study.');
    valid = false;
  }

  return valid;
}

// ---- CRUD ----
function addOrUpdateStudent(evt) {
  evt.preventDefault();
  if (!validate()) return;

  const editingId = studentIdField.value;

  if (editingId) {
    const idx = students.findIndex(s => s.id === editingId);
    if (idx !== -1) {
      students[idx] = { ...students[idx], ...collectFormData() };
    }
  } else {
    students.push({ id: crypto.randomUUID(), ...collectFormData() });
  }

  saveStudents();
  renderAll();
  resetForm();
}

function collectFormData() {
  return {
    fullName: fullName.value.trim(),
    studentNumber: studentNumber.value.trim(),
    dob: dob.value,
    email: email.value.trim(),
    course: course.value,
    year: year.value,
  };
}

function editStudent(id) {
  const s = students.find(st => st.id === id);
  if (!s) return;
  studentIdField.value = s.id;
  fullName.value = s.fullName;
  studentNumber.value = s.studentNumber;
  dob.value = s.dob;
  email.value = s.email;
  course.value = s.course;
  year.value = s.year;
  submitBtn.textContent = 'Save changes';
  updateCardPreview();
  fullName.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteStudent(id) {
  const s = students.find(st => st.id === id);
  if (!s) return;
  const confirmed = window.confirm(`Remove ${s.fullName} (№ ${s.studentNumber}) from the roster?`);
  if (!confirmed) return;
  students = students.filter(st => st.id !== id);
  saveStudents();
  renderAll();
}

function resetForm() {
  form.reset();
  studentIdField.value = '';
  submitBtn.textContent = 'Register student';
  clearErrors();
  updateCardPreview();
}

// ---- rendering ----
function renderRoster() {
  const query = search.value.trim().toLowerCase();
  const courseFilterVal = filterCourse.value;

  const filtered = students.filter(s => {
    const matchesQuery =
      !query ||
      s.fullName.toLowerCase().includes(query) ||
      s.studentNumber.toLowerCase().includes(query) ||
      s.course.toLowerCase().includes(query);
    const matchesCourse = !courseFilterVal || s.course === courseFilterVal;
    return matchesQuery && matchesCourse;
  });

  rosterBody.innerHTML = '';

  filtered.forEach((s, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="num">${String(i + 1).padStart(3, '0')}</td>
      <td>${escapeHtml(s.fullName)}</td>
      <td class="mono">${escapeHtml(s.studentNumber)}</td>
      <td>${escapeHtml(s.course)}</td>
      <td><span class="year-pill">Yr ${escapeHtml(String(s.year))}</span></td>
      <td>${escapeHtml(s.email)}</td>
      <td>
        <div class="row-actions">
          <button class="btn btn--ghost btn--small" data-action="edit" data-id="${s.id}">Edit</button>
          <button class="btn btn--danger btn--small" data-action="delete" data-id="${s.id}">Remove</button>
        </div>
      </td>
    `;
    rosterBody.appendChild(tr);
  });

  emptyState.style.display = students.length === 0 ? 'block' : 'none';
  document.querySelector('.table-wrap table').style.display = students.length === 0 ? 'none' : 'table';
}

function renderStats() {
  statTotal.textContent = students.length;
  const uniqueCourses = new Set(students.map(s => s.course));
  statCourses.textContent = uniqueCourses.size;
  nextRollPreview.textContent = String(students.length + 1).padStart(3, '0');
}

function renderCourseFilterOptions() {
  const current = filterCourse.value;
  const uniqueCourses = [...new Set(students.map(s => s.course))].sort();
  filterCourse.innerHTML = '<option value="">All programmes</option>';
  uniqueCourses.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    filterCourse.appendChild(opt);
  });
  filterCourse.value = current;
}

function renderAll() {
  renderCourseFilterOptions();
  renderRoster();
  renderStats();
}

// ---- live ID card preview ----
function updateCardPreview() {
  cardName.textContent = fullName.value.trim() || 'Full Name';
  cardCourse.textContent = course.value || 'Programme not selected';
  cardNumber.textContent = studentNumber.value.trim() ? `№ ${studentNumber.value.trim()}` : '№ —';
  cardDob.textContent = dob.value ? `DOB ${formatDate(dob.value)}` : 'DOB —';
  cardYear.textContent = year.value ? `YR ${year.value}` : '—';
}

function formatDate(isoStr) {
  const d = new Date(isoStr + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return isoStr;
  return d.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ---- CSV export ----
function exportCsv() {
  if (students.length === 0) {
    alert('There are no students to export yet.');
    return;
  }
  const headers = ['Full Name', 'Student Number', 'Date of Birth', 'Email', 'Programme', 'Year'];
  const rows = students.map(s => [s.fullName, s.studentNumber, s.dob, s.email, s.course, s.year]);
  const csv = [headers, ...rows]
    .map(row => row.map(field => '"' + String(field).replace(/"/g, '""') + '"').join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'student_roster.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ---- helpers ----
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---- event wiring ----
form.addEventListener('submit', addOrUpdateStudent);
resetBtn.addEventListener('click', resetForm);
search.addEventListener('input', renderRoster);
filterCourse.addEventListener('change', renderRoster);
exportBtn.addEventListener('click', exportCsv);

[fullName, studentNumber, dob, course, year].forEach(el =>
  el.addEventListener('input', updateCardPreview)
);
course.addEventListener('change', updateCardPreview);
year.addEventListener('change', updateCardPreview);

rosterBody.addEventListener('click', evt => {
  const btn = evt.target.closest('button[data-action]');
  if (!btn) return;
  const { action, id } = btn.dataset;
  if (action === 'edit') editStudent(id);
  if (action === 'delete') deleteStudent(id);
});

// ---- init ----
renderAll();
updateCardPreview();