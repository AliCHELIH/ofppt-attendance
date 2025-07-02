<?php

namespace App\Http\Controllers;

use App\Mail\AbsenceAlertMail;
use App\Models\Etudiant;
use App\Notifications\AbsenceAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class EtudiantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $etudiants = Etudiant::all()->load('group.filiere');
        return response()->json($etudiants);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $rules = [
            'cin' => 'required',
            'nom' => 'required',
            'prenom' => 'required',
            'email' => 'required',
            'numero_stagiaire' => 'required',
            'numero_parent' => 'required',
            'group_id' => 'required|exists:groups,id',
        ];

        $validate = Validator::make($request->all(), $rules);

        if ($validate->fails()) {
            return response()->json($validate->errors(), 400);
        }

        $etudiant = new Etudiant();
        $etudiant->cin = $request->cin;
        $etudiant->nom = $request->nom;
        $etudiant->prenom = $request->prenom;
        $etudiant->email = $request->email;
        $etudiant->numero_stagiaire = $request->numero_stagiaire;
        $etudiant->numero_parent = $request->numero_parent;
        $etudiant->group_id = $request->group_id;
        $etudiant->save();
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $etudiants = Etudiant::find($id);
        if (!$etudiants) {
            return response()->json(['message' => 'Etudiant not found'], 404);
        }
        return response()->json($etudiants);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Etudiant $etudiant)
    {
        $rules = [
            'cin' => 'required',
            'nom' => 'required',
            'prenom' => 'required',
            'email' => 'required',
            'numero_stagiaire' => 'required',
            'numero_parent' => 'required',
            'group_id' => 'required|exists:groups,id',
        ];

        $validate = Validator::make($request->all(), $rules);

        if ($validate->fails()) {
            return response()->json($validate->errors(), 400);
        }

        $etudiant = Etudiant::find($etudiant->id);
        if (!$etudiant) {
            return response()->json(['message' => 'Etudiant not found'], 404);
        }

        $etudiant->cin = $request->cin;
        $etudiant->nom = $request->nom;
        $etudiant->prenom = $request->prenom;
        $etudiant->email = $request->email;
        $etudiant->numero_stagiaire = $request->numero_stagiaire;
        $etudiant->numero_parent = $request->numero_parent;
        $etudiant->group_id = $request->group_id;
        $etudiant->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $etudiant = Etudiant::find($id);
        if (!$etudiant) {
            return response()->json(['message' => 'Etudiant not found'], 404);
        }
        $etudiant->delete();

        return response()->json(['message' => 'Etudiant deleted successfully'], 200);
    }

    public function getEtudiantData($id)
    {
        $etudiant = Etudiant::with(['group.filiere', 'alerts'])
            ->with(['absences' => function ($query) {
                $query->where('statut', 'Absent');
                // ->where('is_justified', 0);
            }])
            ->find($id);

        if (!$etudiant) {
            return response()->json(['message' => 'Etudiant not found'], 404);
        }

        $totalDuree = $etudiant->absences->sum('duree');

        return response()->json([
            'etudiant' => $etudiant,
            'total_duree_absences' => $totalDuree,
        ]);
    }

    public function sendAlert(Request $request)
    {
        $etudiantId = $request->input('etudiant_id');
        $totalAbsences = $request->input('total_absences');

        $etudiant = Etudiant::find($etudiantId);

        if ($etudiant && $totalAbsences > 5) {
            $etudiantName = $etudiant->nom . ' ' . $etudiant->prenom;
            Mail::to($etudiant->email)->send(new AbsenceAlertMail($totalAbsences, $etudiantName));
        }

        return response()->json(['message' => 'Alert sent successfully'], 200);
    }

    public function updateObservation($id, Request $request)
    {
        $request->validate([
            'observations_formateur' => 'required|string|max:255',
        ]);

        $etudiant = Etudiant::find($id);

        if (!$etudiant) {
            return response()->json(['message' => 'Étudiant non trouvé'], 404);
        }

        $etudiant->observations_formateur = $request->input('observations_formateur');
        $etudiant->save();

        return response()->json(['message' => 'Observation mise à jour avec succès']);
    }

    public function updateObservationConseiller($id, Request $request)
    {
        $conseiller = $request->user('validator');
        if (!$conseiller || !$conseiller->is_conseiller) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $request->validate([
            'observations_conseiller' => 'required|string|max:255',
        ]);

        $etudiant = Etudiant::find($id);

        if (!$etudiant) {
            return response()->json(['message' => 'Étudiant non trouvé'], 404);
        }

        $etudiant->observations_conseiller = $request->input('observations_conseiller');
        $etudiant->save();

        return response()->json(['message' => 'Observation mise à jour avec succès']);
    }

    public function getEtudiantsByGroup($id)
    {
        $etudiants = Etudiant::where('group_id', $id)->with('group.filiere')->get();
        return response()->json($etudiants);
    }

    public function downloadCertificat(Request $request)
    {
        $filePath = $request->input('filePath');

        if (!$filePath) {
            return response()->json(['error' => 'File path is required.'], 400);
        }

        $filePath = $filePath;

        if (!Storage::disk('local')->exists($filePath)) {
            return response()->json(['error' => 'File not found.'], 404);
        }

        $file = Storage::disk('local')->get($filePath);
        $mimeType = Storage::mimeType($filePath);

        return Response::make($file, 200, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'attachment; filename="' . basename($filePath) . '"'
        ]);
    }
}
