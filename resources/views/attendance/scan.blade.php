<!DOCTYPE html>
<html>
<head>
    <title>Attendance Scanner</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body{
            background: linear-gradient(135deg,#0d6efd,#ffc107);
            min-height:100vh;
            display:flex;
            justify-content:center;
            align-items:center;
            font-family:Arial,sans-serif;
        }

        .card-box{
            background:white;
            width:450px;
            padding:30px;
            border-radius:15px;
            box-shadow:0 10px 25px rgba(0,0,0,.2);
            text-align:center;
        }

        h2{
            color:#0d6efd;
            font-weight:bold;
        }

        input{
            margin-top:15px;
            padding:12px;
            width:100%;
            border:2px solid #0d6efd;
            border-radius:10px;
            text-align:center;
            font-size:18px;
        }
    </style>
</head>

<body>

<div class="card-box">

    <h2>📡 Attendance Scanner</h2>

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

    <form id="scanForm" action="{{ route('attendance.scan') }}" method="POST">
        @csrf

        <input
            type="text"
            name="barcode"
            id="barcodeInput"
            placeholder="Scan barcode here..."
            autocomplete="off"
            autofocus>
    </form>

</div>

<script>
document.addEventListener("DOMContentLoaded", function () {

    const input = document.getElementById("barcodeInput");
    const form = document.getElementById("scanForm");

    // auto focus para ready agad mag-scan
    input.focus();

    // auto submit kapag tapos mag-scan (USB scanner behavior)
    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            form.submit();
        }
    });

});
</script>

</body>
</html>