<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AbsenceAlertMail extends Mailable
{
    use Queueable, SerializesModels;

    public $hours;
    public $etudiantName;

    public function __construct($hours, $etudiantName)
    {
        $this->hours = $hours;
        $this->etudiantName = $etudiantName;
    }

    public function build()
    {
        return $this->view('emails.absence_alert')
                    ->subject('Alerte d\'Absence')
                    ->with([
                        'hours' => $this->hours,
                        'etudiantName' => $this->etudiantName,
                    ]);
    }
}
