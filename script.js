let students = JSON.parse(localStorage.getItem("attendanceStudents")) || [];

let editingId = null;

const today = getTodayKey();

document.getElementById("currentDate").innerText =
  new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

function getTodayKey() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function saveData() {
  localStorage.setItem(
    "attendanceStudents",
    JSON.stringify(students)
  );
}

function addOrUpdateStudent() {
  const rollInput = document.getElementById("rollInput");
  const nameInput = document.getElementById("nameInput");

  const roll = rollInput.value.trim();
  const name = nameInput.value.trim();

  if (!roll || !name) {
    alert("Please enter roll number and student name.");
    return;
  }

  const duplicateRoll = students.find(
    student =>
      student.roll === roll &&
      student.id !== editingId
  );

  if (duplicateRoll) {
    alert("This roll number already exists.");
    return;
  }

  if (editingId) {
    const student = students.find(
      student => student.id === editingId
    );

    student.roll = roll;
    student.name = name;

    editingId = null;

    document.getElementById("saveBtn").innerText =
      "Add Student";

    document.getElementById("cancelBtn")
      .classList.add("hidden");

  } else {

    students.push({
      id: Date.now(),
      roll,
      name,
      attendance: {}
    });
  }

  rollInput.value = "";
  nameInput.value = "";

  saveData();
  renderStudents();
}

function editStudent(id) {
  const student = students.find(
    student => student.id === id
  );

  document.getElementById("rollInput").value =
    student.roll;

  document.getElementById("nameInput").value =
    student.name;

  editingId = id;

  document.getElementById("saveBtn").innerText =
    "Update Student";

  document.getElementById("cancelBtn")
    .classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function cancelEdit() {
  editingId = null;

  document.getElementById("rollInput").value = "";
  document.getElementById("nameInput").value = "";

  document.getElementById("saveBtn").innerText =
    "Add Student";

  document.getElementById("cancelBtn")
    .classList.add("hidden");
}

function deleteStudent(id) {
  if (!confirm("Delete this student?")) {
    return;
  }

  students = students.filter(
    student => student.id !== id
  );

  saveData();
  renderStudents();
}

function markAttendance(id, status) {
  const student = students.find(
    student => student.id === id
  );

  student.attendance[today] = status;

  saveData();
  renderStudents();
}

function markAllPresent() {
  if (students.length === 0) {
    alert("No students available.");
    return;
  }

  students.forEach(student => {
    student.attendance[today] = "present";
  });

  saveData();
  renderStudents();
}

function clearTodayAttendance() {
  if (!confirm("Clear today's attendance for all students?")) {
    return;
  }

  students.forEach(student => {
    delete student.attendance[today];
  });

  saveData();
  renderStudents();
}

function getAttendanceInfo(student) {
  const records = Object.values(student.attendance);

  const present = records.filter(
    value => value === "present"
  ).length;

  const absent = records.filter(
    value => value === "absent"
  ).length;

  const total = present + absent;

  const percentage =
    total === 0
      ? 0
      : (present / total) * 100;

  return {
    present,
    absent,
    total,
    percentage
  };
}

function renderStudents() {
  const table = document.getElementById("studentTable");

  const searchValue =
    document.getElementById("searchInput")
      .value
      .toLowerCase();

  const filterValue =
    document.getElementById("filterSelect").value;

  const sortValue =
    document.getElementById("sortSelect").value;

  let filtered = students.filter(student => {

    const matchesSearch =
      student.name.toLowerCase().includes(searchValue) ||
      student.roll.toLowerCase().includes(searchValue);

    if (!matchesSearch) {
      return false;
    }

    const todayStatus =
      student.attendance[today];

    const info = getAttendanceInfo(student);

    if (filterValue === "present") {
      return todayStatus === "present";
    }

    if (filterValue === "absent") {
      return todayStatus === "absent";
    }

    if (filterValue === "not-marked") {
      return !todayStatus;
    }

    if (filterValue === "low") {
      return info.total > 0 &&
        info.percentage < 75;
    }

    return true;
  });

  filtered.sort((a, b) => {

    if (sortValue === "name") {
      return a.name.localeCompare(b.name);
    }

    if (sortValue === "high") {
      return (
        getAttendanceInfo(b).percentage -
        getAttendanceInfo(a).percentage
      );
    }

    if (sortValue === "low") {
      return (
        getAttendanceInfo(a).percentage -
        getAttendanceInfo(b).percentage
      );
    }

    return Number(a.roll) - Number(b.roll);
  });

  table.innerHTML = "";

  filtered.forEach(student => {

    const info = getAttendanceInfo(student);

    const status =
      student.attendance[today];

    let statusBadge = `
      <span class="badge not-marked-badge">
        Not Marked
      </span>
    `;

    if (status === "present") {
      statusBadge = `
        <span class="badge present-badge">
          Present
        </span>
      `;
    }

    if (status === "absent") {
      statusBadge = `
        <span class="badge absent-badge">
          Absent
        </span>
      `;
    }

    const attendanceClass =
      info.total > 0 &&
      info.percentage < 75
        ? "low-attendance"
        : "good-attendance";

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${student.roll}</td>

      <td>${student.name}</td>

      <td>${info.present}</td>

      <td>${info.absent}</td>

      <td>${info.total}</td>

      <td class="${attendanceClass}">
        ${info.percentage.toFixed(1)}%
      </td>

      <td>
        ${statusBadge}
      </td>

      <td class="action-cell">

        <button
          class="present-btn"
          onclick="markAttendance(${student.id}, 'present')"
        >
          P
        </button>

        <button
          class="absent-btn"
          onclick="markAttendance(${student.id}, 'absent')"
        >
          A
        </button>

        <button
          class="history-btn"
          onclick="showHistory(${student.id})"
        >
          History
        </button>

        <button
          class="edit-btn"
          onclick="editStudent(${student.id})"
        >
          Edit
        </button>

        <button
          class="delete-btn"
          onclick="deleteStudent(${student.id})"
        >
          Delete
        </button>

      </td>
    `;

    table.appendChild(row);
  });

  updateDashboard();
  updateWarnings();
}

function updateDashboard() {
  const total = students.length;

  const present =
    students.filter(
      student =>
        student.attendance[today] === "present"
    ).length;

  const absent =
    students.filter(
      student =>
        student.attendance[today] === "absent"
    ).length;

  const marked = present + absent;

  const percentage =
    marked === 0
      ? 0
      : (present / marked) * 100;

  document.getElementById("totalStudents")
    .innerText = total;

  document.getElementById("presentToday")
    .innerText = present;

  document.getElementById("absentToday")
    .innerText = absent;

  document.getElementById("todayPercentage")
    .innerText =
    percentage.toFixed(1) + "%";

  document.getElementById("progressText")
    .innerText =
    percentage.toFixed(1) + "%";

  document.getElementById("progressFill")
    .style.width =
    percentage + "%";
}

function updateWarnings() {
  const lowAttendanceStudents =
    students.filter(student => {

      const info =
        getAttendanceInfo(student);

      return (
        info.total > 0 &&
        info.percentage < 75
      );
    });

  const warningBox =
    document.getElementById("warningBox");

  if (lowAttendanceStudents.length === 0) {
    warningBox.style.display = "none";
    return;
  }

  warningBox.style.display = "block";

  warningBox.innerHTML = `
    ⚠ ${lowAttendanceStudents.length}
    student(s) have attendance below 75%:
    ${lowAttendanceStudents
      .map(student => student.name)
      .join(", ")}
  `;
}

function showHistory(id) {
  const student = students.find(
    student => student.id === id
  );

  document.getElementById("historyTitle")
    .innerText =
    `${student.name} - Attendance History`;

  const historyContent =
    document.getElementById("historyContent");

  const entries =
    Object.entries(student.attendance)
      .sort((a, b) =>
        b[0].localeCompare(a[0])
      );

  if (entries.length === 0) {
    historyContent.innerHTML =
      "<p>No attendance history available.</p>";
  } else {

    historyContent.innerHTML =
      entries.map(([date, status]) => {

        const formattedDate =
          new Date(date + "T00:00:00")
            .toLocaleDateString("en-IN");

        return `
          <div class="history-row">

            <span>${formattedDate}</span>

            <span class="
              ${
                status === "present"
                  ? "good-attendance"
                  : "low-attendance"
              }
            ">
              ${
                status === "present"
                  ? "Present"
                  : "Absent"
              }
            </span>

          </div>
        `;
      }).join("");
  }

  document.getElementById("historyModal")
    .classList.remove("hidden");
}

function closeHistory() {
  document.getElementById("historyModal")
    .classList.add("hidden");
}

function exportCSV() {
  if (students.length === 0) {
    alert("No data available to export.");
    return;
  }

  let csv =
    "Roll No,Name,Present,Absent,Total,Attendance Percentage,Today Status\n";

  students.forEach(student => {

    const info =
      getAttendanceInfo(student);

    const todayStatus =
      student.attendance[today] || "Not Marked";

    csv +=
      `${student.roll},` +
      `"${student.name}",` +
      `${info.present},` +
      `${info.absent},` +
      `${info.total},` +
      `${info.percentage.toFixed(1)}%,` +
      `${todayStatus}\n`;
  });

  const blob =
    new Blob(
      [csv],
      { type: "text/csv" }
    );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    `attendance-${today}.csv`;

  link.click();

  URL.revokeObjectURL(url);
}

const themeBtn =
  document.getElementById("themeBtn");

const savedTheme =
  localStorage.getItem("attendanceTheme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");

  themeBtn.innerText =
    "☀️ Light Mode";
}

themeBtn.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  const darkMode =
    document.body.classList.contains("dark");

  themeBtn.innerText =
    darkMode
      ? "☀️ Light Mode"
      : "🌙 Dark Mode";

  localStorage.setItem(
    "attendanceTheme",
    darkMode ? "dark" : "light"
  );
});

window.addEventListener("click", event => {

  const modal =
    document.getElementById("historyModal");

  if (event.target === modal) {
    closeHistory();
  }

});

renderStudents();