<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DesignerGroup extends Model
{
    use HasFactory;

    protected $table = 'designer_group';

    protected $fillable = [
        'designer_id',
        'group_id',
        'modules'
    ];

    protected $casts = [
        'modules' => 'array',
    ];

    public function designer()
    {
        return $this->belongsTo(Designer::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
