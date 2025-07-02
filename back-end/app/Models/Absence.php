<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Absence extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'duree',
        'seance',
        'certificat',
        'commentaire',
        'statut',
        'is_justified',
        'etudiant_id',
        'designer_id',
        'validator_id'
    ];


    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class);
    }

    public function validator()
    {
        return $this->belongsTo(Validator::class);
    }

    public function designer()
    {
        return $this->belongsTo(Designer::class);
    }
}
