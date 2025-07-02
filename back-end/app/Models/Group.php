<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'filiere_id'
    ];

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    public function designers()
    {
        return $this->belongsToMany(Designer::class, 'designer_group')
                    ->withPivot('modules');
    }

    public function etudiants()
    {
        return $this->hasMany(Etudiant::class);
    }
}
