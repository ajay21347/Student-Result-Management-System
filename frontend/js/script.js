const API = "../backend/";

let currentRoll = "";

/* ================= LOAD RESULTS ================= */
async function loadResults() {
  let res = await fetch(API + "get_results.php");
  let data = await res.json();

  let tbody = document.querySelector("#resultTable tbody");
  tbody.innerHTML = "";

  data.forEach((r) => {
    let grade = getGrade(r.percentage);

    tbody.innerHTML += `
      <tr>
        <td>${r.name}</td>
        <td>${r.roll_no}</td>
        <td>${r.subject1}</td>
        <td>${r.subject2}</td>
        <td>${r.subject3}</td>
        <td>${r.total}</td>
        <td>${r.percentage}</td>
        <td>${grade}</td>
        <td>
          <button class="edit-btn" onclick="openEdit('${r.roll_no}', ${r.subject1}, ${r.subject2}, ${r.subject3})">Edit</button>
          <button class="delete-btn" onclick="deleteRow('${r.roll_no}')">Delete</button>
        </td>
      </tr>
    `;
  });

  renderCharts(data);
}

/* ================= ADD STUDENT ================= */
async function addFullData() {
  let name = document.getElementById("name").value;
  let roll = document.getElementById("roll").value;
  let s1 = document.getElementById("sub1").value;
  let s2 = document.getElementById("sub2").value;
  let s3 = document.getElementById("sub3").value;

  // Validation
  if (!name || !roll || !s1 || !s2 || !s3) {
    showToast("All fields required");
    return;
  }

  if (s1 > 100 || s2 > 100 || s3 > 100) {
    showToast("Marks cannot exceed 100");
    return;
  }

  // Add student
  await fetch(API + "add_student.php", {
    method: "POST",
    body: JSON.stringify({ name, roll }),
  });

  // Get student ID
  let res = await fetch(API + "get_students.php");
  let data = await res.json();
  let last = data[data.length - 1];

  // Add marks
  await fetch(API + "add_marks.php", {
    method: "POST",
    body: JSON.stringify({
      student_id: last.id,
      s1,
      s2,
      s3,
    }),
  });

  showToast("Student Added!");
  loadResults();
}

/* ================= SEARCH ================= */
async function searchResult() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let gradeFilter = document.getElementById("gradeFilter").value;

  let res = await fetch(API + "get_results.php");
  let data = await res.json();

  let filtered = data.filter((r) => {
    let matchText =
      r.name.toLowerCase().includes(input) ||
      r.roll_no.toString().includes(input);

    let grade = getGrade(r.percentage);

    let matchGrade = gradeFilter ? grade === gradeFilter : true;

    return matchText && matchGrade;
  });

  renderTable(filtered);
}

/* ================= TABLE RENDER ================= */
function renderTable(data) {
  let tbody = document.querySelector("#resultTable tbody");
  tbody.innerHTML = "";

  data.forEach((r) => {
    let grade = getGrade(r.percentage);

    tbody.innerHTML += `
      <tr>
        <td>${r.name}</td>
        <td>${r.roll_no}</td>
        <td>${r.subject1}</td>
        <td>${r.subject2}</td>
        <td>${r.subject3}</td>
        <td>${r.total}</td>
        <td>${r.percentage}</td>
        <td>${grade}</td>
      </tr>
    `;
  });
}

/* ================= EDIT ================= */
function openEdit(roll, s1, s2, s3) {
  currentRoll = roll;

  document.getElementById("editS1").value = s1;
  document.getElementById("editS2").value = s2;
  document.getElementById("editS3").value = s3;

  document.getElementById("editModal").style.display = "block";
}

async function updateMarks() {
  await fetch(API + "update_marks.php", {
    method: "POST",
    body: JSON.stringify({
      roll: currentRoll,
      s1: editS1.value,
      s2: editS2.value,
      s3: editS3.value,
    }),
  });

  document.getElementById("editModal").style.display = "none";
  showToast("Updated!");
  loadResults();
}

/* ================= DELETE ================= */
async function deleteRow(roll) {
  if (!confirm("Delete student?")) return;

  await fetch(API + "delete_student.php", {
    method: "POST",
    body: JSON.stringify({ roll }),
  });

  showToast("Deleted!");
  loadResults();
}

/* ================= CHART ================= */
function renderCharts(data) {
  let s1 = 0,
    s2 = 0,
    s3 = 0;
  let gradeCount = { A: 0, B: 0, C: 0 };

  data.forEach((r) => {
    s1 += +r.subject1;
    s2 += +r.subject2;
    s3 += +r.subject3;

    let g = getGrade(r.percentage);
    if (g === "A") gradeCount.A++;
    else if (g === "B") gradeCount.B++;
    else gradeCount.C++;
  });

  new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: ["S1", "S2", "S3"],
      datasets: [{ label: "Marks", data: [s1, s2, s3] }],
    },
  });

  new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: ["A", "B", "C"],
      datasets: [{ data: [gradeCount.A, gradeCount.B, gradeCount.C] }],
    },
  });
}

/* ================= GRADE ================= */
function getGrade(p) {
  if (p >= 75) return "A";
  if (p >= 50) return "B";
  return "C";
}

/* ================= TOAST ================= */
function showToast(msg) {
  let t = document.getElementById("toast");
  t.innerText = msg;
  t.style.display = "block";
  setTimeout(() => (t.style.display = "none"), 2000);
}

/* ================= LOAD ================= */
loadResults();

if (!localStorage.getItem("auth")) {
  window.location.href = "auth.html";
}

function logout() {
  localStorage.removeItem("auth");
  window.location.href = "auth.html";
}
