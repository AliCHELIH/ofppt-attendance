<?php

namespace App\Http\Controllers;

use App\Models\Designer;
use App\Models\DesignerGroup;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GroupController extends Controller
{
    public function index()
    {
        $groups = Group::with(['filiere', 'designers' => function($query) {
            $query->select('designers.id', 'first_name', 'last_name')
                  ->withPivot('modules');
        }])->get();
    
        return response()->json($groups);
    }

    public function store(Request $request)
    {
        $rules = [
            'nom' => 'required',
            'filiere_id' => 'required|exists:filieres,id',
            'designers' => 'required|array',
            'designers.*.id' => 'required|exists:designers,id',
            'designers.*.modules' => 'array',
        ];

        $validate = Validator::make($request->all(), $rules);
        if ($validate->fails()) {
            return response()->json($validate->messages(), 400);
        }

        $group = Group::create($request->only(['nom', 'filiere_id']));

        foreach ($request->designers as $designer) {
            DesignerGroup::create([
                'designer_id' => $designer['id'],
                'group_id' => $group->id,
                'modules' => $designer['modules'],
            ]);
        }

        return response()->json(["data" => $group, "message" => "Group successfully added"], 201);
    }

    public function update(Request $request, Group $group)
    {
        $rules = [
            'nom' => 'required',
            'filiere_id' => 'required|exists:filieres,id',
            'designers' => 'required|array',
            'designers.*.id' => 'required|exists:designers,id',
            'designers.*.modules' => 'array',
        ];

        $validate = Validator::make($request->all(), $rules);
        if ($validate->fails()) {
            return response()->json($validate->messages(), 400);
        }

        $group->update($request->only(['nom', 'filiere_id']));

        // Delete existing designer assignments
        DesignerGroup::where('group_id', $group->id)->delete();

        // Add new designer assignments
        foreach ($request->designers as $designer) {
            DesignerGroup::create([
                'designer_id' => $designer['id'],
                'group_id' => $group->id,
                'modules' => $designer['modules'],
            ]);
        }

        return response()->json(["data" => $group, "message" => "Group successfully updated"], 200);
    }

    public function destroy(Group $group)
    {
        $group->delete();
        return response()->json(null, 204);
    }

    public function listByFiliere($filiere_id)
    {
        $groups = Group::where('filiere_id', $filiere_id)->get();
        return response()->json($groups);
    }

    public function getDesigners()
    {
        $designers = Designer::all();
        return response()->json($designers);
    }

    public function formateurGroups(Request $request)
    {
        $formateur = $request->user();
        $groups = $formateur->groups;
        return response()->json($groups);
    }
}
