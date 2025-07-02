<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    use HasFactory;

    protected $fillable = [
        'etudiant_id',
        'duree',
        'commentaire',
        'is_validated'
    ];

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class);
    }
}
