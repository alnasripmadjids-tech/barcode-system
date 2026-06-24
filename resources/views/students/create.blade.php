<!DOCTYPE html>
<html>
<head>
    <title>Add Student</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            background: linear-gradient(135deg, #0d6efd, #ffc107);
            min-height: 100vh;
        }

        .card {
            width: 420px;
            border: none;
            border-radius: 14px;
            box-shadow: 0 12px 25px rgba(0,0,0,0.15);
            background: #ffffff;
        }

        .header-title {
            font-weight: 800;
            color: #0d6efd;
        }

        .form-label {
            font-weight: 600;
            color: #333;
        }

        .btn-primary {
            background: #0d6efd;
            border: none;
            font-weight: 600;
        }

        .btn-warning {
            font-weight: 600;
        }

        .small-text {
            font-size: 12px;
            color: #666;
        }
    </style>
</head>

<body>

<div class="container">

    <div class="d-flex justify-content-center align-items-center" style="min-height: 100vh;">

        <div class="card p-4">

            <h4 class="header-title text-center mb-3">Add Student</h4>
            <p class="text-center small-text mb-4">Blue & Yellow Student System</p>

            @if(session('success'))
                <div class="alert alert-success py-2">
                    {{ session('success') }}
                </div>
            @endif

            @if($errors->any())
                <div class="alert alert-danger py-2">
                    <ul class="mb-0">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form action="{{ url('/students/store') }}" method="POST">
                @csrf

                <div class="mb-2">
                    <label class="form-label">Student ID</label>
                    <input type="text" name="student_id" class="form-control form-control-sm" placeholder="Enter ID">
                </div>

                <div class="mb-2">
                    <label class="form-label">First Name</label>
                    <input type="text" name="first_name" class="form-control form-control-sm" placeholder="Enter First Name">
                </div>

                <div class="mb-2">
                    <label class="form-label">Last Name</label>
                    <input type="text" name="last_name" class="form-control form-control-sm" placeholder="Enter Last Name">
                </div>

                <div class="mb-2">
                    <label class="form-label">Course</label>
                    <input type="text" name="course" class="form-control form-control-sm" placeholder="Enter Course">
                </div>

                <div class="mb-3">
                    <label class="form-label">Year Level</label>
                    <input type="text" name="year_level" class="form-control form-control-sm" placeholder="Enter Year">
                </div>

                <button type="submit" class="btn btn-primary btn-sm w-100 mb-2">
                    Save Student
                </button>

                <a href="{{ url('/students') }}" class="btn btn-warning btn-sm w-100">
                    Back
                </a>

            </form>

        </div>

    </div>

</div>

</body>
</html>