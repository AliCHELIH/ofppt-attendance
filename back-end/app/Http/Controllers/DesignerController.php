<?php

namespace App\Http\Controllers;

use App\Models\Designer;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DesignerController extends Controller
{


    public function login(Request $request)
    {

        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($designer = Designer::where('email', $request->email)->first()) {
            if (!Hash::check($request->password, $designer->password)) {
                return response(['message' => 'Le mot de passe est incorrect', 'errors' => ['password' => ['Le mot de passe est incorrect']]], 422);
            }
        } else {
            return response(['message' => 'Cet utilisateur n\'existe pas', 'errors' => ['email' => ['Cet utilisateur n\'existe pas']]], 422);
        }

        return response([
            'token' => $designer->createToken('Designer')->plainTextToken
        ]);
    }


    public function logout()
    {
        auth('designer')->user()->tokens()->delete();
        return response(['message' => 'Deconnexion reussie']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $designers = Designer::all();
        return response()->json($designers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:designers',
            'is_cgcp' => 'required|boolean',
        ]);

        $password = Str::random(8);

        $designer = new Designer();
        $designer->first_name = $request->first_name;
        $designer->last_name = $request->last_name;
        $designer->email = $request->email;
        $designer->is_cgcp = $request->is_cgcp;
        $designer->password = Hash::make($password);
        $designer->save();

        return response()->json(['message' => 'Concepteur crée avec succés ', 'password' => $password], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Designer $designer)
    {
        return response()->json($designer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Designer $designer)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:designers,email,' . $designer->id,
            'is_cgcp' => 'required|boolean',
        ]);

        $designer->first_name = $request->first_name;
        $designer->last_name = $request->last_name;
        $designer->email = $request->email;
        $designer->is_cgcp = $request->is_cgcp;
        $designer->save();

        return response()->json(['message' => 'Concepteur mis a jour avec succes'], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Designer $designer)
    {
        $designer->delete();
        return response()->json(['message' => 'concepteur a ete supprime avec succes']);
    }

    public function resetPassword($id)
    {
        $validator = Designer::find($id);
        $password = Str::random(8);
        $validator->password = Hash::make($password);
        $validator->save();
        return response()->json(['message' => 'Mot de passe mis à jour avec succes', 'password' => $password], 201);
    }
}
