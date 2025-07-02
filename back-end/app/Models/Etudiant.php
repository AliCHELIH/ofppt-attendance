<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Etudiant extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'cin',
        'nom',
        'prenom',
        'email',
        'numero_stagiaire',
        'numero_parent',
        'observations_formateur',
        'observations_conseiller',
        'observations_cgcp',
        'group_id'
    ];

    public function absences()
    {
        return $this->hasMany(Absence::class);
    }

    public function alerts()
    {
        return $this->hasMany(Alert::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }
}
