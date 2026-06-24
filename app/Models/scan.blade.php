<!DOCTYPE html>
<html>
<head>
    <title>Attendance Scanner</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            background: linear-gradient(135deg, #0d6efd, #ffc107);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
        }

        .box {
            background: #fff;
            width: 420px;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 12px 25px rgba(0,0,0,0.2);
            text-align: center;
        }

        h2 {
            color: #0d6efd;
            font-weight: 800;
        }

        .sub {
            font-size: 13px;
            color: #666;
            margin-bottom: 15px;
        }

        input {
            width: 100%;
            padding: 12px;
            font-size: 18px;
            text-align: center;
            border-radius: 10px;
            border: 2px solid #0d6efd;
            outline: none;
        }

        input:focus {
            border-color: #ffc107;
        }

        .alert {
            margin-top: 15px;
        }

        .footer {
            margin-top: 10px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>

<body>

<div class="box">

    <h2>📡 Attendance Scanner</h2>
    <div class="sub">Scan Student Barcode to Record Time-In</div>

    {{-- SUCCESS MESSAGE --}}
    @if(session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

    {{-- ERROR MESSAGE --}}
    @if(session('error'))
        <div class="alert alert-danger">
            {{ session('error') }}
        </div>
    @endif

    {{-- SCANNER FORM --}}
    <form action="{{ url('/attendance/scan') }}" method="POST">
        @csrf

        <input type="text"
               name="barcode"
               autofocus
               placeholder="I-scan ang barcode dito..."
               onkeydown="if(event.key==='Enter'){ this.form.submit(); }">
    </form>

    <div class="footer">
        Ready for USB Barcode Scanner ✔
    </div>

</div>

</body>
</html>