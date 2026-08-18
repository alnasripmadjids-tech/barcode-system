<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SmsLog extends Model
{
    // 🌟 IDINAGDAG ITO: Pinapayagan natin ang Laravel na isulat itong mga columns na ito sa MySQL
    protected $fillable = [
        'student_id',
        'phone_number',
        'message',
        'status'
    ];
}
