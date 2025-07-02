<?php

namespace App\Http\Controllers;

use App\Models\Filiere;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FiliereController extends Controller
{
    public function index()
    {
        $filieres = Filiere::all();
        return response()->json($filieres);
    }

    public function store(Request $request)
    {
        $rules = [
            'nom' => 'required',
            'code' => 'required',
            'secteur_id' => 'required',
        ];

        $validate = Validator::make($request->all(), $rules);
        if ($validate->fails()) {
            return response()->json($validate->messages(), 400);
        }

        $filiere = Filiere::create($request->all());
        return response()->json(["data" => $filiere, "message" => "Filiere Bien Ajoute"], 201);
    }

    public function update(Request $request, Filiere $filiere)
    {
        $rules = [
            'nom' => 'required',
            'code' => 'required',
            'secteur_id' => 'required',

        ];

        $validate = Validator::make($request->all(), $rules);
        if ($validate->fails()) {
            return response()->json($validate->messages(), 400);
        }

        $filiere->update($request->all());
        return response()->json(["data" => $filiere, "message" => "Filiere Bien Modifie"], 200);
    }

    public function destroy(Filiere $filiere)
    {
        $filiere->delete();
        return response()->json(null, 204);
    }

    public function list($id)
    {
        $filieres = Filiere::where('secteur_id', $id)->get();
        return response()->json($filieres);
    }
}
