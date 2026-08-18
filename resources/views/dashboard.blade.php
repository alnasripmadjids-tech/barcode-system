<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            display: flex;
        }

        /* SIDEBAR */
        .sidebar {
            width: 260px;
            height: 100vh;
            background: linear-gradient(180deg, #1e3a8a, #0f172a);
            color: white;
            padding: 20px;
        }

        .title {
            text-align: center;
            font-size: 13px;
            letter-spacing: 3px;
            font-weight: bold;
            color: #cbd5e1;
        }

        .profile {
            margin-top: 15px;
            background: rgba(255,255,255,0.12);
            padding: 15px;
            border-radius: 12px;
            text-align: center;
        }

        .avatar {
            width: 55px;
            height: 55px;
            background: white;
            color: #1e3a8a;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin: auto;
            font-size: 18px;
        }

        .name { font-weight: bold; margin-top: 5px; }
        .role { font-size: 12px; color: #cbd5e1; }

        .menu a {
            display: flex;
            align-items: center;
            gap: 10px;
            color: white;
            text-decoration: none;
            padding: 12px;
            margin-top: 10px;
            border-radius: 8px;
            background: rgba(255,255,255,0.08);
            transition: 0.2s;
        }

        .menu a:hover {
            background: rgba(255,255,255,0.25);
            transform: translateX(5px);
        }

        .main {
            flex: 1;
            padding: 25px;
            background: #e2e8f0;
        }

        .header {
            font-size: 24px;
            font-weight: bold;
        }

        .sub {
            color: #475569;
            margin-bottom: 20px;
        }

        .paper-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            width: 280px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.15);
            border-left: 6px solid #1e3a8a;
        }

        .paper-card h3 { margin: 0; color: #334155; }
        .paper-card h2 { margin: 10px 0 0 0; color: #1e3a8a; font-size: 28px; }

        /* ANNOUNCEMENT */
        .announcement {
            margin-top: 30px;
            background: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .announcement input,
        .announcement textarea {
            width: 100%;
            padding: 10px;
            margin-top: 8px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 8px;
        }

        .announcement button {
            background: #1e3a8a;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        }

        .announcement button:hover {
            background: #0f172a;
        }
    </style>
</head>

<body>

<div class="sidebar">

    <div class="title">SYSTEM ADMINISTRATION</div>

    <div class="profile">
        <div class="avatar"></div>
        <div class="name">Admin</div>
        <div class="role"></div>
    </div>

    <div class="menu">

        <a href="/dashboard">📊 Dashboard</a>

        <a href="javascript:void(0)" onclick="toggleAnnouncement()">
            📢 Add Event / Announcement
        </a>

        <a href="/studentlist">🎓 Student List Record</a>
       <a href="/student-attendance">📝 Student Attendance Log</a>
        <a href="/grades">📊 Student Grade Report</a>
        <a href="/users">👤 User Management</a>
        <a href="/logout">🚪 Log Out</a>

    </div>
</div>

<div class="main">

    <div class="header">Dashboard</div>
    <div class="sub">Sulu College of Technology, Inc.</div>

    <div class="paper-card">
        <h3>Total Students</h3>
        <h2>{{ \App\Models\Student::count() }}</h2>
    </div>

    <!-- HIDDEN ANNOUNCEMENT -->
    <div class="announcement" id="announcement" style="display:none;">

        <h3>📢 Add Event / Announcement</h3>

        <form>
            <label>Title</label>
            <input type="text" placeholder="Enter title">

            <label>Date</label>
            <input type="date">

            <label>Description</label>
            <textarea rows="4" placeholder="Enter description"></textarea>

            <button type="submit">Save Announcement</button>
        </form>

    </div>

</div>

<script>
function toggleAnnouncement() {
    var section = document.getElementById("announcement");

    if (section.style.display === "none") {
        section.style.display = "block";
    } else {
        section.style.display = "none";
    }
}
</script>

</body>
</html>