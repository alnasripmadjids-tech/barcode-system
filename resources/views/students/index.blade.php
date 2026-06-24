<!DOCTYPE html>
<html>
<head>
    <title>Student List</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            background: linear-gradient(135deg, #0d6efd, #ffc107);
            font-family: Arial, sans-serif;
            min-height: 100vh;
        }

        .container-box {
            margin: 30px;
        }

        .card {
            background: #ffffff;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .header h2 {
            margin: 0;
            color: #0d6efd;
            font-weight: 800;
        }

        .btn-add {
            background: #ffc107;
            color: #000;
            padding: 10px 15px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 700;
            transition: 0.2s;
        }

        .btn-add:hover {
            background: #e0a800;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 10px;
            overflow: hidden;
        }

        thead {
            background: #0d6efd;
            color: white;
        }

        th, td {
            padding: 12px;
            border: 1px solid #ddd;
            text-align: left;
        }

        tr:hover {
            background: #f1f5f9;
        }

        .badge {
            background: #ffc107;
            color: #000;
            padding: 5px 10px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 700;
        }

        .empty {
            text-align: center;
            padding: 20px;
            color: #555;
            font-weight: 600;
        }
    </style>
</head>

<body>

<div class="container-box">

    <div class="card">

        <!-- HEADER -->
        <div class="header">
            <h2>🎓 Student List</h2>

            <a href="/students/create" class="btn-add">
                + Add Student
            </a>
        </div>

        <!-- TABLE -->
        <table>

            <thead>
                <tr>
                    <th>ID</th>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th>Barcode</th>
                </tr>
            </thead>

            <tbody>

                @forelse($students as $student)
                    <tr>
                        <td>{{ $student->id }}</td>
                        <td>{{ $student->student_id }}</td>

                        <td>
                            {{ $student->name ?? trim(($student->first_name ?? '') . ' ' . ($student->last_name ?? '')) }}
                        </td>

                        <td>{{ $student->course }}</td>

                        <td>{{ $student->year_level ?? $student->year }}</td>

                        <td>
                            <span class="badge">
                                {{ $student->barcode ?? 'N/A' }}
                            </span>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" class="empty">
                            Walang student records pa
                        </td>
                    </tr>
                @endforelse

            </tbody>

        </table>

    </div>

</div>

</body>
</html>