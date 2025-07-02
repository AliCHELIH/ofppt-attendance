<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Etudiant;
use App\Models\Absence;
use App\Models\Alert;
use App\Models\Appointment;
use App\Models\Designer;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getTotalStudents()
    {
        $totalStudents = Etudiant::count();
        return response()->json(['total' => $totalStudents]);
    }

    public function getTotalAbsences()
    {
        $totalAbsences = Absence::where('statut', 'Absent')->count();
        return response()->json(['total' => $totalAbsences]);
    }

    public function getTotalAlerts()
    {
        $totalAlerts = Alert::where('is_validated', 0)->count();
        return response()->json(['total' => $totalAlerts]);
    }

    public function getTotalDesigners()
    {
        $totalDesigners = Designer::count();
        return response()->json(['total' => $totalDesigners]);
    }

    public function getRecentAppointments()
    {
        // Assuming 'Appointment' model exists and represents recent activities
        $recentAppointments = Appointment::with(['validator', 'etudiant'])
            ->whereDate('rdv_time', '>=', Carbon::today())
            ->orderByRaw('ABS(DATEDIFF(rdv_time, ?)) ASC', [Carbon::today()->format('Y-m-d')])
            ->limit(10)
            ->get();
        return response()->json(['appointments' => $recentAppointments]);
    }
}
