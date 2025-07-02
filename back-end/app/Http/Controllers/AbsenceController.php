<?php

namespace App\Http\Controllers;

use App\Mail\ExcessiveAbsenceMail;
use App\Models\Absence;
use App\Models\Alert;
use App\Models\Designer;
use App\Models\Etudiant;
use App\Models\Validator;
use App\Notifications\ExcessiveAbsenceNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator as ValidatorData;

class AbsenceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $absences = Absence::all();
        return response()->json($absences);
    }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(Request $request)
    // {
    //     $designer = request()->user("designer");
    //     $validator = request()->user("validator");

    //     if (!$designer && !$validator) {
    //         return response()->json(['message' => 'Unauthorized'], 401);
    //     }

    //     $rules = [
    //         'etudiant_id' => 'required',
    //         'duree' => 'required',
    //         'commentaire' => 'required'
    //     ];

    //     $validate = validator($request->all(), $rules);
    //     if ($validate->fails()) {
    //         return response()->json($validate->errors(), 400);
    //     }

    //     $etudiant = Etudiant::find($request->etudiant_id);
    //     if (!$etudiant) {
    //         return response()->json(['message' => 'Etudiant not found'], 404);
    //     }

    //     $absence = new Absence();


    //     if ($validator) {
    //         $absence->validator_id = $validator->id;
    //     }
    //     if ($designer) {
    //         $absence->designer_id = $designer->id;
    //     }

    //     $absence->etudiant_id = $request->etudiant_id;
    //     $absence->duree = $request->duree;
    //     $absence->commentaire = $request->commentaire;
    //     $absence->save();


    //     $absences = Absence::where('etudiant_id', $request->etudiant_id)->where('is_justified', 0)->get();

    //     $dureeTotal = 0;

    //     foreach ($absences as $absence) {
    //         $dureeTotal += $absence->duree;
    //     }

    //     if ($dureeTotal > 20) {
    //         $alert = new Alert();
    //         $alert->etudiant_id = $request->etudiant_id;
    //         $alert->duree = $dureeTotal;
    //         $alert->save();
    //     }


    //     return response()->json([
    //         'message' => 'Absence created successfully',
    //         'dureeTotal' => $dureeTotal
    //     ]);
    // }

    public function store(Request $request)
    {
        $designer = request()->user("designer");
        $validateur = request()->user("validator");
        $admin = request()->user("admin");

        if (!$designer && !$validateur && !$admin) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $data = $request->all();

        $validator = ValidatorData::make($data, [
            '*.etudiant_id' => 'required|exists:etudiants,id',
            '*.statut' => 'required|in:Présent,Absent',
            '*.date' =>  ['required', 'date', 'before_or_equal:today'],
            '*.seance' => 'required|in:s1,s2,s3,s4',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        foreach ($data as $absenceData) {
            $existingAbsence = Absence::where('etudiant_id', $absenceData['etudiant_id'])
                ->where('date', $absenceData['date'])
                ->where('seance', $absenceData['seance'])
                ->first();

            if ($existingAbsence) {
                return response()->json(['message' => "La présence a déjà été enregistrée ce jour pour cette séance et ce groupe"], 400);
            }

            $absence = new Absence([
                'date' => $absenceData['date'],
                'seance' => $absenceData['seance'],
                'statut' => $absenceData['statut'],
                'etudiant_id' => $absenceData['etudiant_id'],
                'teacher_id' => auth()->user()->id,
            ]);

            if ($validateur) {
                $absence->validator_id = $validateur->id;
            }

            if ($designer) {
                $absence->designer_id = $designer->id;
            }

            $absence->save();


            if ($absenceData['statut'] == 'Absent') {
                $this->checkAndCreateAlert($absenceData['etudiant_id']);
            }
        }

        return response()->json(['message' => 'Absences enregistrées avec succès.']);
    }

    private function checkAndCreateAlert($etudiantId)
    {
        $etudiant = Etudiant::find($etudiantId);
        $totalDuree = Absence::where('etudiant_id', $etudiantId)
            ->where('is_justified', 0)
            ->where('statut', 'Absent')
            ->sum('duree');

        if ($totalDuree > 5) {
            // Create the alert
            Alert::create([
                'etudiant_id' => $etudiantId,
                'duree' => $totalDuree,
                'motif_d_accompagnement' => 'Absence',
                'commentaire' => "Dépasser 20 heures d'absence",
                'is_validated' => false,
            ]);

            // Send notification to the student
            Mail::to($etudiant->email)->send(new ExcessiveAbsenceMail($etudiant, $totalDuree, 'etudiant', $etudiant));

            // Get the conseillers
            $conseillers = Validator::where('is_conseiller', 1)->get();
            foreach ($conseillers as $conseiller) {
                Mail::to($conseiller->email)->send(new ExcessiveAbsenceMail($etudiant, $totalDuree, 'conseiller', $conseiller));
            }

            // Get the CGCPs
            $cgcps = Designer::where('is_cgcp', 1)->get()->merge(Validator::where('is_cgcp', 1)->get());
            foreach ($cgcps as $cgcp) {
                Mail::to($cgcp->email)->send(new ExcessiveAbsenceMail($etudiant, $totalDuree, 'cgcp', $cgcp));
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Absence $absence)
    {
        // $absence = Absence::find($id);

        if (!$absence) {
            return response()->json(['message' => 'Absence non trouvée'], 404);
        }

        return response()->json(['absence' => $absence]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Absence $absence)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Absence $absence)
    {
        //
    }

    public function absencesByDaySeanceGroup(Request $request)
    {
        $validated = $request->validate([
            'date' => ['required', 'date', 'before_or_equal:today'],
            'seance' => 'required|in:s1,s2,s3,s4',
            'group_id' => 'required|exists:groups,id',
        ]);

        $absences = DB::table('absences')
            ->join('etudiants', 'absences.etudiant_id', '=', 'etudiants.id')
            ->join('groups', 'etudiants.group_id', '=', 'groups.id')
            ->join('filieres', 'groups.filiere_id', '=', 'filieres.id')
            ->select(
                'etudiants.id',
                'etudiants.nom',
                'etudiants.prenom',
                'etudiants.cin',
                'etudiants.numero_stagiaire',
                'etudiants.numero_parent',
                'filieres.nom as filiere',
                'groups.nom as groupe',
                'absences.statut',
                'absences.is_justified',
            )
            ->where('absences.date', $validated['date'])
            ->where('absences.seance', $validated['seance'])
            ->where('etudiants.group_id', $validated['group_id'])
            ->get();

        return response()->json($absences);
    }

    public function justifyAbsence($id, Request $request)
    {
        $request->validate([
            'certificat' => 'required|file|mimes:pdf',
            'commentaire' => 'nullable|string',
        ]);

        $absence = Absence::find($id);

        if (!$absence) {
            return response()->json(['message' => 'Absence non trouvée'], 404);
        }

        if ($request->hasFile('certificat')) {
            $filePath = $request->file('certificat')->store('certificats');
            $absence->certificat = $filePath;
        }

        $absence->commentaire = $request->input('commentaire');
        $absence->is_justified = true;
        $absence->save();

        return response()->json(['message' => 'Absence justifiée avec succès']);
    }
}
