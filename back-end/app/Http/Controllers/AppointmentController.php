<?php

namespace App\Http\Controllers;

use App\Mail\AppointmentApologyMail;
use App\Mail\AppointmentCreatedMail;
use App\Mail\AppointmentThankYouMail;
use App\Models\Appointment;
use App\Models\Designer;
use App\Models\Validator as ModelsValidator;
use App\Notifications\AppointmentApology;
use App\Notifications\AppointmentCreated;
use App\Notifications\AppointmentThankYou;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    private $workingHoursStart = 7;
    private $workingHoursEnd = 18;

    public function index()
    {
        $validator = request()->user('validator');
        if ($validator) {
            return Appointment::with('etudiant', 'validator')->where('validator_id', $validator->id)->get();
        }
        return Appointment::with('etudiant', 'validator')->get();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'etudiant_id' => 'required|exists:etudiants,id',
            'rdv_time' => 'required|date_format:Y-m-d\TH:i:s\Z',
            'status' => 'required|in:pending,passed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $validator = $request->user('validator');
        if (!$validator) {
            return response()->json(['message' => 'Unauthorized'], 400);
        }

        if (!$validator->is_conseiller) {
            return response()->json(['message' => 'Unauthorized'], 400);
        }

        $rdv_time = Carbon::parse($request->rdv_time);

        // Ensure time is within working hours
        $hour = $rdv_time->hour;
        if ($hour < $this->workingHoursStart || $hour >= $this->workingHoursEnd) {
            return response()->json(['message' => 'L\'heure de rendez-vous doit être entre 8h et 18h.'], 400);
        }

        // Ensure time is at 60-minute intervals
        if ($rdv_time->minute !== 0) {
            return response()->json(['message' => 'Le rendez-vous doit être fixé à une heure précise (ex : 14:00, 08:00).'], 400);
        }

        // Check for existing appointments at this time
        $existingAppointment = Appointment::where('validator_id', $validator->id)
            ->where('rdv_time', $rdv_time->format('Y-m-d H:i:s'))
            ->first();

        if ($existingAppointment) {
            return response()->json(['message' => 'Le conseiller est occupé à ce moment-là.'], 400);
        }


        $appointment = Appointment::create([
            'etudiant_id' => $request->etudiant_id,
            'validator_id' => $validator->id,
            'rdv_time' => $rdv_time->format('Y-m-d H:i:s'),
            'status' => $request->status,
        ]);

        // Send notifications
        Mail::to($appointment->etudiant->email)->send(new AppointmentCreatedMail($appointment, 'etudiant', $appointment->etudiant));

        $cgcps = Designer::where('is_cgcp', 1)->get()->merge(ModelsValidator::where('is_cgcp', 1)->get());
        foreach ($cgcps as $cgcp) {
            Mail::to($cgcp->email)->send(new AppointmentCreatedMail($appointment, 'cgcp', $cgcp));
        }

        Mail::to($validator->email)->send(new AppointmentCreatedMail($appointment, 'conseiller', $validator));

        return response()->json($appointment, 201);
    }

    public function update(Request $request, $id)
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json(['message' => 'Rendez-vous introuvable.'], 404);
        }

        if ($appointment->status !== 'pending') {
            return response()->json(['message' => 'Le statut ne peut être modifié que si le rendez-vous est en attente.'], 400);
        }

        $request->validate([
            'status' => 'required|in:pending,passed,cancelled',
        ]);

        $appointment->status = $request->status;
        $appointment->save();
        // return response()->json(['message' => 'Rendez-vous introuvable.'], 404);

        // Send notifications based on status change
        if ($appointment->status === 'passed') {
            $this->sendThankYouEmails($appointment);
        } elseif ($appointment->status === 'cancelled') {
            $this->sendApologyEmails($appointment);
        }

        return response()->json($appointment, 200);
    }

    protected function sendThankYouEmails(Appointment $appointment)
    {
        $etudiant = $appointment->etudiant;
        $cgcps = Designer::where('is_cgcp', 1)->get()->merge(ModelsValidator::where('is_cgcp', 1)->get());

        // Send email to student
        Mail::to($etudiant->email)->send(new AppointmentThankYouMail($appointment, $etudiant));

        // Send email to CGCP users
        foreach ($cgcps as $cgcp) {
            Mail::to($cgcp->email)->send(new AppointmentThankYouMail($appointment, $cgcp));
        }
    }

    protected function sendApologyEmails(Appointment $appointment)
    {
        $etudiant = $appointment->etudiant;
        $cgcps = Designer::where('is_cgcp', 1)->get()->merge(ModelsValidator::where('is_cgcp', 1)->get());

        // Send email to student
        Mail::to($etudiant->email)->send(new AppointmentApologyMail($appointment, $etudiant));

        // Send email to CGCP users
        foreach ($cgcps as $cgcp) {
            Mail::to($cgcp->email)->send(new AppointmentApologyMail($appointment, $cgcp));
        }
    }



    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->delete();

        return response()->noContent();
    }
}
