<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;

class AppointmentThankYouMail extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;
    public $notifiable;

    public function __construct($appointment, $notifiable)
    {
        $this->appointment = $appointment;
        $this->notifiable = $notifiable;
    }

    public function build()
    {
        $etudiant = $this->appointment->etudiant;
        $rdv_time = Carbon::parse($this->appointment->rdv_time)->format('d-m-Y H:i');

        return $this->view('emails.appointment_thank_you')
                    ->subject('Merci pour votre présence')
                    ->with([
                        'etudiant' => $etudiant,
                        'rdv_time' => $rdv_time,
                        'notifiable' => $this->notifiable,
                    ]);
    }
}
