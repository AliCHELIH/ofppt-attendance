<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ExcessiveAbsenceMail extends Mailable
{
    use Queueable, SerializesModels;

    public $etudiant;
    public $totalDuree;
    public $role;
    public $notifiable;

    public function __construct($etudiant, $totalDuree, $role, $notifiable)
    {
        $this->etudiant = $etudiant;
        $this->totalDuree = $totalDuree;
        $this->role = $role;
        $this->notifiable = $notifiable;
    }

    public function build()
    {
        return $this->view('emails.excessive_absence')
                    ->subject($this->getSubject())
                    ->with([
                        'etudiant' => $this->etudiant,
                        'totalDuree' => $this->totalDuree,
                        'role' => $this->role,
                        'notifiable' => $this->notifiable,
                    ]);
    }

    private function getSubject()
    {
        return 'Avertissement d\'absences excessives';
    }
}
