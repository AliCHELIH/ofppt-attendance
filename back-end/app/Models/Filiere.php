<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Filiere extends Model
{
    use HasFactory;

    public $with = ['secteur'];

    protected $fillable = [
        'nom',
        'code',
        'secteur_id',
    ];

    /**
     * Get the questions that belong to the filiere.
     */
    public function etudiants()
    {
        return $this->hasMany(Etudiant::class);
    }

    /**
     * Get the validators that belong to the filiere.
     */

    public function secteur()
    {
        return $this->belongsTo(Secteur::class);
    }
}
