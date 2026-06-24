<!DOCTYPE html>
<html>
<head>
    <title>Add Student</title>
</head>
<body>

<h2>Add Student</h2>

<form action="{{ route('students.store') }}" method="POST">
    @csrf

    <input type="text" name="student_id" placeholder="Student ID" required><br><br>
    <input type="text" name="first_name" placeholder="First Name" required><br><br>
    <input type="text" name="last_name" placeholder="Last Name" required><br><br>
    <input type="text" name="course" placeholder="Course" required><br><br>
    <input type="text" name="year_level" placeholder="Year Level" required><br><br>
    <input type="text" name="barcode" placeholder="Barcode"><br><br>

    <button type="submit">Save Student</button>
</form>

</body>
</html>