<?php

namespace App\Http\Controllers;

use App\Models\Secteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SecteurController extends Controller
{
    public function index()
    {
        $secteurs = Secteur::all();
        return response()->json($secteurs);
    }

    public function store(Request $request)
    {
        $rules = [
            'nom' => 'required',
        ];

        $validate = Validator::make($request->all(), $rules);
        if ($validate->fails()) {
            return response()->json($validate->messages(), 400);
        }

        $secteur = Secteur::create($request->all());
        return response()->json(["data" => $secteur, "message" => "Secteur Bien Ajoute"], 201);
    }

    public function update(Request $request, Secteur $secteur)
    {
        $rules = [
            'nom' => 'required',
        ];

        $validate = Validator::make($request->all(), $rules);
        if ($validate->fails()) {
            return response()->json($validate->messages(), 400);
        }

        $secteur->update($request->all());
        return response()->json(["data" => $secteur, "message" => "Secteur Bien Modifie"], 200);
    }

    public function destroy(Secteur $secteur)
    {
        $secteur->delete();
        return response()->json(null, 204);
    }
}
