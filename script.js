/* =======================================
   DEMO USERS
======================================= */

let users =
  JSON.parse(
    localStorage.getItem("attendanceUsers")
  ) || [
    {
      id: 1,
      name: "System Admin",
      email: "admin@attendance.com",
      password: "Admin@123",
      role: "admin"
    },
    {
      id: 2,
      name: "ML Teacher",
      email: "teacher1@attendance.com",
      password: "Teacher@123",
      role: "teacher",
      subject: "Machine Learning",
      className: "SY MSc CS"
    },
    {
      id: 3,
      name: "IoT Teacher",
      email: "teacher2@attendance.com",
      password: "Teacher@123",
      role: "teacher",
      subject: "Internet of Things",
      className: "SY MSc CS"
    }
  ];


/* =======================================
   STUDENTS
======================================= */

let students =
  JSON.parse(
    localStorage.getItem("attendanceStudentsV3")
  ) || [];


/* =======================================
   LOCKED ATTENDANCE
======================================= */

let attendanceLocks =
  JSON.parse(
    localStorage.getItem("attendanceLocks")
  ) || {};


/* =======================================
   AUDIT LOG
======================================= */

let auditLogs =
  JSON.parse(
    localStorage.getItem("attendanceAuditLogs")
  ) || [];


/* =======================================
   CURRENT USER
======================================= */

let currentUser =
  JSON.parse(
    sessionStorage.getItem("currentAttendanceUser")
  ) || null;


let editingStudentId = null;


/* =======================================
   SAVE DATA
======================================= */

function saveUsers() {

  localStorage.setItem(
    "attendanceUsers",
    JSON.stringify(users)
  );

}


function saveStudents() {

  localStorage.setItem(
    "attendanceStudentsV3",
    JSON.stringify(students)
  );

}


function saveLocks() {

  localStorage.setItem(
    "attendanceLocks",
    JSON.stringify(attendanceLocks)
  );

}


function saveAuditLogs() {

  localStorage.setItem(
    "attendanceAuditLogs",
    JSON.stringify(auditLogs)
  );

}


/* =======================================
   DATE
======================================= */

function getToday() {

  const date =
    new Date();

  return date
    .toISOString()
    .split("T")[0];

}


document.getElementById(
  "attendanceDate"
).value =
  getToday();


document.getElementById(
  "monthPicker"
).value =
  getToday().slice(0,7);


/* =======================================
   LOGIN
======================================= */

function login() {

  const email =
    document.getElementById(
      "loginEmail"
    ).value.trim();


  const password =
    document.getElementById(
      "loginPassword"
    ).value;


  const user =
    users.find(
      u =>
        u.email === email &&
        u.password === password
    );


  if (!user) {

    alert(
      "Invalid email or password"
    );

    return;

  }


  currentUser =
    user;


  sessionStorage.setItem(
    "currentAttendanceUser",
    JSON.stringify(user)
  );


  showApplication();

}


/* =======================================
   LOGOUT
======================================= */

function logout() {

  currentUser =
    null;


  sessionStorage.removeItem(
    "currentAttendanceUser"
  );


  document.getElementById(
    "mainApp"
  ).classList.add(
    "hidden"
  );


  document.getElementById(
    "loginPage"
  ).classList.remove(
    "hidden"
  );

}


/* =======================================
   SHOW APPLICATION
======================================= */

function showApplication() {

  if (!currentUser) {
    return;
  }


  document.getElementById(
    "loginPage"
  ).classList.add(
    "hidden"
  );


  document.getElementById(
    "mainApp"
  ).classList.remove(
    "hidden"
  );


  document.getElementById(
    "loggedUserInfo"
  ).innerText =
    `Welcome, ${currentUser.name}`;


  document.getElementById(
    "roleText"
  ).innerText =
    currentUser.role.toUpperCase();


  configureRole();

  renderTeachers();

  renderStudents();

  renderAuditLogs();

}


/* =======================================
   ROLE CONFIGURATION
======================================= */

function configureRole() {

  const adminPanel =
    document.getElementById(
      "adminPanel"
    );


  const studentManagement =
    document.getElementById(
      "studentManagement"
    );


  const auditSection =
    document.getElementById(
      "auditSection"
    );


  const adminElements =
    document.querySelectorAll(
      ".admin-only"
    );


  const classSelect =
    document.getElementById(
      "classSelect"
    );


  const subjectSelect =
    document.getElementById(
      "subjectSelect"
    );


  if (
    currentUser.role ===
    "admin"
  ) {

    adminPanel.classList.remove(
      "hidden"
    );

    studentManagement.classList.remove(
      "hidden"
    );

    auditSection.classList.remove(
      "hidden"
    );


    adminElements.forEach(
      element =>
        element.classList.remove(
          "hidden"
        )
    );


    classSelect.disabled =
      false;

    subjectSelect.disabled =
      false;

  } else {

    adminPanel.classList.add(
      "hidden"
    );

    studentManagement.classList.add(
      "hidden"
    );

    auditSection.classList.add(
      "hidden"
    );


    adminElements.forEach(
      element =>
        element.classList.add(
          "hidden"
        )
    );


    classSelect.value =
      currentUser.className;

    subjectSelect.value =
      currentUser.subject;


    classSelect.disabled =
      true;

    subjectSelect.disabled =
      true;

  }

}


/* =======================================
   CURRENT VALUES
======================================= */

function getSelectedDate() {

  return document.getElementById(
    "attendanceDate"
  ).value;

}


function getSelectedSubject() {

  return document.getElementById(
    "subjectSelect"
  ).value;

}


function getSelectedClass() {

  return document.getElementById(
    "classSelect"
  ).value;

}


/* =======================================
   ATTENDANCE KEY
======================================= */

function getAttendanceKey() {

  return (
    getSelectedDate()
    + "__"
    + getSelectedSubject()
  );

}


function getLockKey() {

  return (
    getSelectedDate()
    + "__"
    + getSelectedClass()
    + "__"
    + getSelectedSubject()
  );

}


/* =======================================
   TEACHER MANAGEMENT
======================================= */

function addTeacher() {

  if (
    currentUser.role !==
    "admin"
  ) {
    return;
  }


  const name =
    document.getElementById(
      "teacherName"
    ).value.trim();


  const email =
    document.getElementById(
      "teacherEmail"
    ).value.trim();


  const password =
    document.getElementById(
      "teacherPassword"
    ).value;


  const subject =
    document.getElementById(
      "teacherSubject"
    ).value;


  const className =
    document.getElementById(
      "teacherClass"
    ).value;


  if (
    !name ||
    !email ||
    !password
  ) {

    alert(
      "Fill all teacher details."
    );

    return;

  }


  const exists =
    users.some(
      u =>
        u.email === email
    );


  if (exists) {

    alert(
      "Teacher email already exists."
    );

    return;

  }


  users.push({

    id: Date.now(),

    name,

    email,

    password,

    role: "teacher",

    subject,

    className

  });


  saveUsers();


  document.getElementById(
    "teacherName"
  ).value = "";


  document.getElementById(
    "teacherEmail"
  ).value = "";


  document.getElementById(
    "teacherPassword"
  ).value = "";


  renderTeachers();

}


/* =======================================
   RENDER TEACHERS
======================================= */

function renderTeachers() {

  const table =
    document.getElementById(
      "teacherTable"
    );


  if (!table) {
    return;
  }


  const teachers =
    users.filter(
      user =>
        user.role ===
        "teacher"
    );


  table.innerHTML = "";


  if (
    teachers.length ===
    0
  ) {

    table.innerHTML = `
      <tr>
        <td colspan="5">
          No teachers found.
        </td>
      </tr>
    `;

    return;

  }


  teachers.forEach(
    teacher => {

      const row =
        document.createElement(
          "tr"
        );


      row.innerHTML = `

        <td>
          ${teacher.name}
        </td>

        <td>
          ${teacher.email}
        </td>

        <td>
          ${teacher.subject}
        </td>

        <td>
          ${teacher.className}
        </td>

        <td>

          <button
            class="danger-btn"
            onclick="
              deleteTeacher(
                ${teacher.id}
              )
            "
          >
            Delete
          </button>

        </td>

      `;


      table.appendChild(
        row
      );

    }
  );

}


/* =======================================
   DELETE TEACHER
======================================= */

function deleteTeacher(id) {

  if (
    currentUser.role !==
    "admin"
  ) {
    return;
  }


  if (
    !confirm(
      "Delete this teacher?"
    )
  ) {
    return;
  }


  users =
    users.filter(
      user =>
        user.id !== id
    );


  saveUsers();

  renderTeachers();

}


/* =======================================
   ADD STUDENT
======================================= */

function addOrUpdateStudent() {

  if (
    currentUser.role !==
    "admin"
  ) {

    alert(
      "Only admin can manage students."
    );

    return;

  }


  const roll =
    document.getElementById(
      "rollInput"
    ).value.trim();


  const name =
    document.getElementById(
      "nameInput"
    ).value.trim();


  const email =
    document.getElementById(
      "emailInput"
    ).value.trim();


  if (
    !roll ||
    !name
  ) {

    alert(
      "Enter roll number and name."
    );

    return;

  }


  const duplicate =
    students.find(
      student =>
        student.roll === roll &&
        student.id !==
          editingStudentId
    );


  if (duplicate) {

    alert(
      "Roll number already exists."
    );

    return;

  }


  if (
    editingStudentId
  ) {

    const student =
      students.find(
        student =>
          student.id ===
          editingStudentId
      );


    student.roll =
      roll;

    student.name =
      name;

    student.email =
      email;

    student.className =
      getSelectedClass();

  } else {

    students.push({

      id: Date.now(),

      roll,

      name,

      email,

      className:
        getSelectedClass(),

      attendance: {}

    });

  }


  saveStudents();

  cancelStudentEdit();

  renderStudents();

}


/* =======================================
   EDIT STUDENT
======================================= */

function editStudent(id) {

  if (
    currentUser.role !==
    "admin"
  ) {
    return;
  }


  const student =
    students.find(
      student =>
        student.id === id
    );


  document.getElementById(
    "rollInput"
  ).value =
    student.roll;


  document.getElementById(
    "nameInput"
  ).value =
    student.name;


  document.getElementById(
    "emailInput"
  ).value =
    student.email || "";


  editingStudentId =
    id;


  document.getElementById(
    "saveStudentBtn"
  ).innerText =
    "Update Student";


  document.getElementById(
    "cancelStudentBtn"
  ).classList.remove(
    "hidden"
  );

}


/* =======================================
   CANCEL EDIT
======================================= */

function cancelStudentEdit() {

  editingStudentId =
    null;


  document.getElementById(
    "rollInput"
  ).value = "";


  document.getElementById(
    "nameInput"
  ).value = "";


  document.getElementById(
    "emailInput"
  ).value = "";


  document.getElementById(
    "saveStudentBtn"
  ).innerText =
    "Add Student";


  document.getElementById(
    "cancelStudentBtn"
  ).classList.add(
    "hidden"
  );

}


/* =======================================
   DELETE STUDENT
======================================= */

function deleteStudent(id) {

  if (
    currentUser.role !==
    "admin"
  ) {
    return;
  }


  if (
    !confirm(
      "Delete this student?"
    )
  ) {
    return;
  }


  students =
    students.filter(
      student =>
        student.id !== id
    );


  saveStudents();

  renderStudents();

}


/* =======================================
   CHECK LOCK
======================================= */

function isAttendanceLocked() {

  return !!attendanceLocks[
    getLockKey()
  ];

}


/* =======================================
   MARK ATTENDANCE
======================================= */

function markAttendance(
  id,
  status
) {

  if (
    currentUser.role !==
    "teacher"
  ) {

    alert(
      "Attendance can only be marked by teacher account."
    );

    return;

  }


  if (
    isAttendanceLocked()
  ) {

    alert(
      "Attendance is locked."
    );

    return;

  }


  const student =
    students.find(
      student =>
        student.id === id
    );


  const key =
    getAttendanceKey();


  const oldRemark =
    student.attendance[key]
      ?.remark || "";


  const remark =
    prompt(
      "Enter remark (optional)",
      oldRemark
    );


  student.attendance[
    key
  ] = {

    status,

    remark:
      remark || "",

    date:
      getSelectedDate(),

    subject:
      getSelectedSubject(),

    markedBy:
      currentUser.name,

    markedById:
      currentUser.id,

    markedAt:
      new Date()
        .toLocaleString()

  };


  saveStudents();

  renderStudents();

}


/* =======================================
   MARK ALL PRESENT
======================================= */

function markAllPresent() {

  if (
    currentUser.role !==
    "teacher"
  ) {

    alert(
      "Teacher login required."
    );

    return;

  }


  if (
    isAttendanceLocked()
  ) {

    alert(
      "Attendance is locked."
    );

    return;

  }


  const key =
    getAttendanceKey();


  students
    .filter(
      student =>
        student.className ===
        getSelectedClass()
    )
    .forEach(
      student => {

        student.attendance[
          key
        ] = {

          status: "present",

          remark: "",

          date:
            getSelectedDate(),

          subject:
            getSelectedSubject(),

          markedBy:
            currentUser.name,

          markedById:
            currentUser.id,

          markedAt:
            new Date()
              .toLocaleString()

        };

      }
    );


  saveStudents();

  renderStudents();

}


/* =======================================
   CLEAR
======================================= */

function clearSelectedAttendance() {

  if (
    currentUser.role !==
    "teacher"
  ) {
    return;
  }


  if (
    isAttendanceLocked()
  ) {

    alert(
      "Attendance is locked."
    );

    return;

  }


  if (
    !confirm(
      "Clear selected attendance?"
    )
  ) {
    return;
  }


  const key =
    getAttendanceKey();


  students.forEach(
    student => {

      delete student.attendance[
        key
      ];

    }
  );


  saveStudents();

  renderStudents();

}


/* =======================================
   SUBMIT & LOCK
======================================= */

function submitAttendance() {

  if (
    currentUser.role !==
    "teacher"
  ) {

    alert(
      "Only teachers can submit attendance."
    );

    return;

  }


  const key =
    getLockKey();


  if (
    attendanceLocks[key]
  ) {

    alert(
      "Attendance already submitted."
    );

    return;

  }


  if (
    !confirm(
      "Submit and lock attendance?"
    )
  ) {
    return;
  }


  attendanceLocks[key] = {

    locked: true,

    teacher:
      currentUser.name,

    teacherId:
      currentUser.id,

    date:
      getSelectedDate(),

    subject:
      getSelectedSubject(),

    className:
      getSelectedClass(),

    submittedAt:
      new Date()
        .toLocaleString()

  };


  auditLogs.unshift({

    id: Date.now(),

    action:
      "Attendance Submitted",

    teacher:
      currentUser.name,

    subject:
      getSelectedSubject(),

    className:
      getSelectedClass(),

    date:
      getSelectedDate(),

    time:
      new Date()
        .toLocaleString()

  });


  saveLocks();

  saveAuditLogs();

  alert(
    "Attendance submitted and locked successfully."
  );

  renderStudents();

}


/* =======================================
   ADMIN UNLOCK
======================================= */

function unlockAttendance() {

  if (
    currentUser.role !==
    "admin"
  ) {

    alert(
      "Only admin can unlock attendance."
    );

    return;

  }


  const key =
    getLockKey();


  if (
    !attendanceLocks[
      key
    ]
  ) {

    alert(
      "This attendance is already unlocked."
    );

    return;

  }


  if (
    !confirm(
      "Unlock this attendance?"
    )
  ) {
    return;
  }


  delete attendanceLocks[
    key
  ];


  auditLogs.unshift({

    id:
      Date.now(),

    action:
      "Attendance Unlocked",

    teacher:
      currentUser.name,

    subject:
      getSelectedSubject(),

    className:
      getSelectedClass(),

    date:
      getSelectedDate(),

    time:
      new Date()
        .toLocaleString()

  });


  saveLocks();

  saveAuditLogs();

  renderStudents();

  renderAuditLogs();

}


/* =======================================
   ATTENDANCE INFO
======================================= */

function getAttendanceInfo(
  student
) {

  const subject =
    getSelectedSubject();


  const records =
    Object.values(
      student.attendance
    ).filter(
      record =>
        record.subject ===
        subject
    );


  let present = 0;
  let absent = 0;
  let late = 0;


  records.forEach(
    record => {

      if (
        record.status ===
        "present"
      ) {
        present++;
      }


      if (
        record.status ===
        "absent"
      ) {
        absent++;
      }


      if (
        record.status ===
        "late"
      ) {
        late++;
      }

    }
  );


  const total =
    present +
    absent +
    late;


  const percentage =
    total === 0
      ? 0
      : (
          (present + late)
          /
          total
        ) * 100;


  return {

    present,

    absent,

    late,

    total,

    percentage

  };

}


/* =======================================
   RENDER STUDENTS
======================================= */

function renderStudents() {

  if (!currentUser) {
    return;
  }


  if (
    currentUser.role ===
    "teacher"
  ) {

    document.getElementById(
      "classSelect"
    ).value =
      currentUser.className;


    document.getElementById(
      "subjectSelect"
    ).value =
      currentUser.subject;

  }


  const table =
    document.getElementById(
      "studentTable"
    );


  const search =
    document.getElementById(
      "searchInput"
    )
      .value
      .toLowerCase();


  const filter =
    document.getElementById(
      "filterSelect"
    ).value;


  const sort =
    document.getElementById(
      "sortSelect"
    ).value;


  const key =
    getAttendanceKey();


  let list =
    students.filter(
      student =>

        student.className ===
        getSelectedClass()

        &&

        (
          student.name
            .toLowerCase()
            .includes(search)

          ||

          String(student.roll)
            .toLowerCase()
            .includes(search)
        )

    );


  list =
    list.filter(
      student => {

        const record =
          student.attendance[
            key
          ];


        const info =
          getAttendanceInfo(
            student
          );


        if (
          filter ===
          "present"
        ) {

          return (
            record?.status ===
            "present"
          );

        }


        if (
          filter ===
          "absent"
        ) {

          return (
            record?.status ===
            "absent"
          );

        }


        if (
          filter ===
          "late"
        ) {

          return (
            record?.status ===
            "late"
          );

        }


        if (
          filter ===
          "not-marked"
        ) {

          return !record;

        }


        if (
          filter ===
          "defaulter"
        ) {

          return (
            info.total > 0 &&
            info.percentage < 75
          );

        }


        return true;

      }
    );


  list.sort(
    (a,b) => {

      if (
        sort ===
        "name"
      ) {

        return a.name
          .localeCompare(
            b.name
          );

      }


      if (
        sort ===
        "high"
      ) {

        return (
          getAttendanceInfo(b)
            .percentage
          -
          getAttendanceInfo(a)
            .percentage
        );

      }


      if (
        sort ===
        "low"
      ) {

        return (
          getAttendanceInfo(a)
            .percentage
          -
          getAttendanceInfo(b)
            .percentage
        );

      }


      return (
        Number(a.roll)
        -
        Number(b.roll)
      );

    }
  );


  table.innerHTML =
    "";


  if (
    list.length ===
    0
  ) {

    table.innerHTML = `

      <tr>

        <td colspan="7">
          No students found.
        </td>

      </tr>

    `;

  }


  const locked =
    isAttendanceLocked();


  list.forEach(
    student => {

      const info =
        getAttendanceInfo(
          student
        );


      const record =
        student.attendance[
          key
        ];


      let badge = `
        <span
          class="
            badge
            not-marked-badge
          "
        >
          Not Marked
        </span>
      `;


      if (
        record?.status ===
        "present"
      ) {

        badge = `
          <span
            class="
              badge
              present-badge
            "
          >
            Present
          </span>
        `;

      }


      if (
        record?.status ===
        "absent"
      ) {

        badge = `
          <span
            class="
              badge
              absent-badge
            "
          >
            Absent
          </span>
        `;

      }


      if (
        record?.status ===
        "late"
      ) {

        badge = `
          <span
            class="
              badge
              late-badge
            "
          >
            Late
          </span>
        `;

      }


      let percentageClass =
        "good";


      if (
        info.percentage < 75
        &&
        info.percentage >= 60
      ) {

        percentageClass =
          "average";

      }


      if (
        info.percentage < 60
      ) {

        percentageClass =
          "low";

      }


      const teacherButtons =
        (
          currentUser.role ===
          "teacher"
          &&
          !locked
        )
          ? `

            <button
              class="success-btn"
              onclick="
                markAttendance(
                  ${student.id},
                  'present'
                )
              "
            >
              P
            </button>

            <button
              class="danger-btn"
              onclick="
                markAttendance(
                  ${student.id},
                  'absent'
                )
              "
            >
              A
            </button>

            <button
              class="warning-btn"
              onclick="
                markAttendance(
                  ${student.id},
                  'late'
                )
              "
            >
              Late
            </button>

          `
          : locked
          ? "🔒"
          : "-";


      const adminButtons =
        currentUser.role ===
        "admin"
          ? `

            <button
              onclick="
                editStudent(
                  ${student.id}
                )
              "
            >
              Edit
            </button>

            <button
              class="danger-btn"
              onclick="
                deleteStudent(
                  ${student.id}
                )
              "
            >
              Delete
            </button>

          `
          : "";


      const row =
        document.createElement(
          "tr"
        );


      row.innerHTML = `

        <td>
          ${student.roll}
        </td>

        <td>
          ${student.name}
        </td>

        <td
          class="
            ${percentageClass}
          "
        >

          ${info.percentage.toFixed(1)}%

          <br>

          <small>

            P:${info.present}

            A:${info.absent}

            L:${info.late}

          </small>

        </td>

        <td>
          ${badge}
        </td>

        <td>
          ${
            record?.remark
            || "-"
          }
        </td>

        <td
          class="action-cell"
        >
          ${teacherButtons}
        </td>

        <td
          class="action-cell"
        >

          <button
            onclick="
              showHistory(
                ${student.id}
              )
            "
          >
            History
          </button>

          ${adminButtons}

        </td>

      `;


      table.appendChild(
        row
      );

    }
  );


  updateDashboard();

  renderDefaulters();

  updateLockStatus();

  generateMonthlyReport();

  renderAuditLogs();

}


/* =======================================
   DASHBOARD
======================================= */

function updateDashboard() {

  const key =
    getAttendanceKey();


  const classStudents =
    students.filter(
      student =>
        student.className ===
        getSelectedClass()
    );


  let present = 0;
  let absent = 0;
  let late = 0;


  classStudents.forEach(
    student => {

      const status =
        student.attendance[
          key
        ]?.status;


      if (
        status ===
        "present"
      ) {
        present++;
      }


      if (
        status ===
        "absent"
      ) {
        absent++;
      }


      if (
        status ===
        "late"
      ) {
        late++;
      }

    }
  );


  const totalMarked =
    present +
    absent +
    late;


  const percentage =
    totalMarked === 0
      ? 0
      : (
          (present + late)
          /
          totalMarked
        ) * 100;


  document.getElementById(
    "totalStudents"
  ).innerText =
    classStudents.length;


  document.getElementById(
    "presentCount"
  ).innerText =
    present;


  document.getElementById(
    "absentCount"
  ).innerText =
    absent;


  document.getElementById(
    "lateCount"
  ).innerText =
    late;


  document.getElementById(
    "attendancePercentage"
  ).innerText =
    percentage.toFixed(1)
    + "%";


  updateChart(
    present,
    absent,
    late,
    totalMarked
  );

}


/* =======================================
   CHART
======================================= */

function updateChart(
  present,
  absent,
  late,
  total
) {

  function percent(
    value
  ) {

    return total === 0
      ? 0
      : value / total * 100;

  }


  const presentPercent =
    percent(present);


  const absentPercent =
    percent(absent);


  const latePercent =
    percent(late);


  document.getElementById(
    "chartPresent"
  ).style.width =
    presentPercent + "%";


  document.getElementById(
    "chartAbsent"
  ).style.width =
    absentPercent + "%";


  document.getElementById(
    "chartLate"
  ).style.width =
    latePercent + "%";


  document.getElementById(
    "chartPresentText"
  ).innerText =
    presentPercent.toFixed(1)
    + "%";


  document.getElementById(
    "chartAbsentText"
  ).innerText =
    absentPercent.toFixed(1)
    + "%";


  document.getElementById(
    "chartLateText"
  ).innerText =
    latePercent.toFixed(1)
    + "%";

}


/* =======================================
   LOCK STATUS
======================================= */

function updateLockStatus() {

  const box =
    document.getElementById(
      "lockStatusBox"
    );


  const lock =
    attendanceLocks[
      getLockKey()
    ];


  if (lock) {

    box.className =
      "lock-status locked";


    box.innerHTML = `

      🔒 Attendance Submitted & Locked

      <br>

      <small>

        Submitted by:
        ${lock.teacher}

        |
        ${lock.submittedAt}

      </small>

    `;

  } else {

    box.className =
      "lock-status unlocked";


    box.innerText =
      "🔓 Attendance is open for marking.";

  }

}


/* =======================================
   DEFAULTERS
======================================= */

function renderDefaulters() {

  const container =
    document.getElementById(
      "defaulterList"
    );


  const defaulters =
    students.filter(
      student => {

        if (
          student.className !==
          getSelectedClass()
        ) {
          return false;
        }


        const info =
          getAttendanceInfo(
            student
          );


        return (
          info.total > 0 &&
          info.percentage < 75
        );

      }
    );


  if (
    defaulters.length ===
    0
  ) {

    container.innerHTML =
      "✅ No students below 75% attendance.";

    return;

  }


  container.innerHTML =
    defaulters
      .map(
        student => {

          const info =
            getAttendanceInfo(
              student
            );


          return `

            <div
              class="
                defaulter-item
              "
            >

              <span>

                ${student.roll}
                -
                ${student.name}

              </span>

              <strong
                class="low"
              >

                ${info.percentage.toFixed(1)}%

              </strong>

            </div>

          `;

        }
      )
      .join("");

}


/* =======================================
   STUDENT HISTORY
======================================= */

function showHistory(id) {

  const student =
    students.find(
      student =>
        student.id === id
    );


  document.getElementById(
    "historyTitle"
  ).innerText =
    `${student.name} - Attendance History`;


  const records =
    Object.values(
      student.attendance
    ).sort(
      (a,b) =>
        b.date.localeCompare(
          a.date
        )
    );


  const content =
    document.getElementById(
      "historyContent"
    );


  if (
    records.length ===
    0
  ) {

    content.innerHTML =
      "No history found.";

  } else {

    content.innerHTML =
      records
        .map(
          record => `

            <div
              class="
                history-row
              "
            >

              <span>
                ${record.date}
              </span>

              <span>
                ${record.subject}
              </span>

              <span>
                ${record.status}
              </span>

              <span>

                ${
                  record.markedBy
                  || "-"
                }

              </span>

            </div>

          `
        )
        .join("");

  }


  document.getElementById(
    "historyModal"
  ).classList.remove(
    "hidden"
  );

}


function closeHistory() {

  document.getElementById(
    "historyModal"
  ).classList.add(
    "hidden"
  );

}


/* =======================================
   MONTHLY REPORT
======================================= */

function generateMonthlyReport() {

  const month =
    document.getElementById(
      "monthPicker"
    ).value;


  if (!month) {
    return;
  }


  const subject =
    getSelectedSubject();


  const classStudents =
    students.filter(
      student =>
        student.className ===
        getSelectedClass()
    );


  let html = `

    <table>

      <thead>

        <tr>

          <th>Roll</th>
          <th>Name</th>
          <th>Present</th>
          <th>Absent</th>
          <th>Late</th>
          <th>%</th>

        </tr>

      </thead>

      <tbody>

  `;


  classStudents.forEach(
    student => {

      const records =
        Object.values(
          student.attendance
        ).filter(
          record =>

            record.date
              .startsWith(
                month
              )

            &&

            record.subject ===
            subject

        );


      let present = 0;
      let absent = 0;
      let late = 0;


      records.forEach(
        record => {

          if (
            record.status ===
            "present"
          ) {
            present++;
          }


          if (
            record.status ===
            "absent"
          ) {
            absent++;
          }


          if (
            record.status ===
            "late"
          ) {
            late++;
          }

        }
      );


      const total =
        present +
        absent +
        late;


      const percentage =
        total === 0
          ? 0
          : (
              (present + late)
              /
              total
            ) * 100;


      html += `

        <tr>

          <td>
            ${student.roll}
          </td>

          <td>
            ${student.name}
          </td>

          <td>
            ${present}
          </td>

          <td>
            ${absent}
          </td>

          <td>
            ${late}
          </td>

          <td>
            ${percentage.toFixed(1)}%
          </td>

        </tr>

      `;

    }
  );


  html += `

      </tbody>

    </table>

  `;


  document.getElementById(
    "monthlyReport"
  ).innerHTML =
    html;

}


/* =======================================
   AUDIT LOG
======================================= */

function renderAuditLogs() {

  const container =
    document.getElementById(
      "auditLog"
    );


  if (!container) {
    return;
  }


  if (
    auditLogs.length ===
    0
  ) {

    container.innerHTML =
      "No audit activity yet.";

    return;

  }


  container.innerHTML =
    auditLogs
      .map(
        log => `

          <div
            class="audit-item"
          >

            <strong>
              ${log.action}
            </strong>

            <br>

            ${log.subject}

            -

            ${log.className}

            -

            ${log.date}

            <br>

            <small>

              By:
              ${log.teacher}

              |
              ${log.time}

            </small>

          </div>

        `
      )
      .join("");

}


/* =======================================
   CSV EXPORT
======================================= */

function exportCSV() {

  let csv =
    "Roll,Name,Class,Subject,Date,Status,Remark,Marked By\n";


  students.forEach(
    student => {

      Object.values(
        student.attendance
      ).forEach(
        record => {

          csv +=

            `${student.roll},`

            + `"${student.name}",`

            + `"${student.className}",`

            + `"${record.subject}",`

            + `${record.date},`

            + `${record.status},`

            + `"${record.remark || ""}",`

            + `"${record.markedBy || ""}"\n`;

        }
      );

    }
  );


  downloadFile(
    csv,
    "attendance-report.csv",
    "text/csv"
  );

}


/* =======================================
   BACKUP
======================================= */

function backupData() {

  const backup = {

    students,

    users,

    attendanceLocks,

    auditLogs

  };


  downloadFile(

    JSON.stringify(
      backup,
      null,
      2
    ),

    "attendance-backup.json",

    "application/json"

  );

}


/* =======================================
   DOWNLOAD
======================================= */

function downloadFile(
  content,
  fileName,
  type
) {

  const blob =
    new Blob(
      [content],
      { type }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  link.href =
    url;


  link.download =
    fileName;


  link.click();


  URL.revokeObjectURL(
    url
  );

}


/* =======================================
   DARK MODE
======================================= */

const themeBtn =
  document.getElementById(
    "themeBtn"
  );


if (
  localStorage.getItem(
    "attendanceTheme"
  ) === "dark"
) {

  document.body
    .classList.add(
      "dark"
    );


  themeBtn.innerText =
    "☀️ Light Mode";

}


themeBtn.addEventListener(
  "click",
  () => {

    document.body
      .classList.toggle(
        "dark"
      );


    const dark =
      document.body
        .classList.contains(
          "dark"
        );


    themeBtn.innerText =
      dark
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";


    localStorage.setItem(
      "attendanceTheme",
      dark
        ? "dark"
        : "light"
    );

  }
);


/* =======================================
   INITIAL LOAD
======================================= */

saveUsers();


if (
  currentUser
) {

  showApplication();

}