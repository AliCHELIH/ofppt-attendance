<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('etudiant_id')->nullable()->constrained('etudiants')->cascadeOnDelete();
            $table->double('duree');
            $table->string('commentaire');
            $table->enum('motif_d_accompagnement', ['Absence', 'Comportement', 'Adaptation','Apprentissage','Autre']);
            $table->boolean('is_validated')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alerts');
    }
};
