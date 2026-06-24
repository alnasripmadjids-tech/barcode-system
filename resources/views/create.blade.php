<!DOCTYPE html>
<html>
<head>
    <title>Add Student</title>
</head>
<body>

<h2>Add Student</h2>

<form action="/students/store" method="POST">
    @csrf

    <input type="text" name="student_id" placeholder="Student ID"><br><br>
    <input type="text" name="first_name" placeholder="First Name"><br><br>
    <input type="text" name="last_name" placeholder="Last Name"><br><br>
    <input type="text" name="course" placeholder="Course"><br><br>
    <input type="text" name="year_level" placeholder="Year Level"><br><br>
    <input type="text" name="barcode" placeholder="Barcode"><br><br>

    <button type="submit">Save</button>
</form>

</body>
</html>