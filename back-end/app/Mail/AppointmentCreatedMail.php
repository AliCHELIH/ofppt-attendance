<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AppointmentCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;
    public $role;
    public $notifiable;

    public function __construct($appointment, $role, $notifiable)
    {
        $this->appointment = $appointment;
        $this->role = $role;
        $this->notifiable = $notifiable;
    }

    public function build()
    {
        return $this->view('emails.appointment_created')
                    ->subject($this->getSubject())
                    ->with([
                        'appointment' => $this->appointment,
                        'role' => $this->role,
                        'notifiable' => $this->notifiable,
                    ]);
    }

    private function getSubject()
    {
        switch ($this->role) {
            case 'conseiller':
                return 'Notification de rendez-vous créé';
            case 'cgcp':
                return 'Notification de rendez-vous étudiant';
            default:
                return 'Notification de rendez-vous';
        }
    }
}
