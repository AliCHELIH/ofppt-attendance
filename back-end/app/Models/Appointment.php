<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = ['etudiant_id', 'validator_id', 'rdv_time', 'status'];

    protected $dates = ['rdv_time'];

    // Explicitly disabling automatic updating of the timestamps
    public $timestamps = true;

    // Make sure Laravel doesn't auto-update 'rdv_time' field
    const UPDATED_AT = 'updated_at';

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class);
    }

    public function validator()
    {
        return $this->belongsTo(Validator::class);
    }
}
