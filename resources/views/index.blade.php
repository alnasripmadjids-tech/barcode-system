<!DOCTYPE html>
<html>
<head>
    <title>Student List</title>
</head>
<body>

<h2>Student List</h2>

<a href="/students/create">Add Student</a>

<table border="1" cellpadding="10">
    <tr>
        <th>ID</th>
        <th>Student ID</th>
        <th>Name</th>
        <th>Course</th>
        <th>Year</th>
        <th>Barcode</th>
    </tr>

    @foreach($students as $student)
    <tr>
        <td>{{ $student->id }}</td>
        <td>{{ $student->student_id }}</td>
        <td>{{ $student->first_name }} {{ $student->last_name }}</td>
        <td>{{ $student->course }}</td>
        <td>{{ $student->year_level }}</td>
        <td>{{ $student->barcode }}</td>
    </tr>
    @endforeach

</table>

</body>
</html>