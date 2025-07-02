<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{



    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($designer = Admin::where('email', $request->email)->first()) {
            if (!Hash::check($request->password, $designer->password)) {
                return response(['message' => 'Le mot de passe est incorrect', 'errors' => ['password' => ['Le mot de passe est incorrect']]], 422);
            }
        } else {
            return response(['message' => 'Cet utilisateur n\'existe pas', 'errors' => ['email' => ['Cet utilisateur n\'existe pas']]], 422);
        }

        return response([
            'token' => $designer->createToken('Admin')->plainTextToken
        ]);
    }

    public function logout()
    {
        auth('admin')->user()->tokens()->delete();
        return response(['message' => 'Deconnexion reussie']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
