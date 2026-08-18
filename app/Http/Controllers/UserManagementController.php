<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | USER MANAGEMENT INDEX
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
        $query = User::query();

        /*
        |--------------------------------------------------------------------------
        | SEARCH
        |--------------------------------------------------------------------------
        */

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        /*
        |--------------------------------------------------------------------------
        | ROLE FILTER
        |--------------------------------------------------------------------------
        */

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        /*
        |--------------------------------------------------------------------------
        | GET USERS
        |--------------------------------------------------------------------------
        */

        $users = $query
            ->latest()
            ->get();

        /*
        |--------------------------------------------------------------------------
        | SUMMARY
        |--------------------------------------------------------------------------
        */

        $summary = [
            'total' => User::count(),

            'admins' => User::where(
                'role',
                'admin'
            )->count(),

            'users' => User::where(
                'role',
                'user'
            )->count(),
        ];

        /*
        |--------------------------------------------------------------------------
        | RETURN USER MANAGEMENT PAGE
        |--------------------------------------------------------------------------
        */

        return Inertia::render(
            'UserManagement',
            [
                'users' => $users,

                'filters' => [
                    'search' => $request->search ?? '',
                    'role' => $request->role ?? '',
                ],

                'summary' => $summary,
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | STORE NEW USER
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | VALIDATE INPUT
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],

            'role' => [
                'required',
                'in:admin,user',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | CREATE USER
        |--------------------------------------------------------------------------
        */

        User::create([
            'name' => $validated['name'],

            'email' => $validated['email'],

            'password' => Hash::make(
                $validated['password']
            ),

            'role' => $validated['role'],
        ]);

        /*
        |--------------------------------------------------------------------------
        | RETURN
        |--------------------------------------------------------------------------
        */

        return redirect()
            ->route('user.management')
            ->with(
                'success',
                'New user has been added successfully.'
            );
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE USER
    |--------------------------------------------------------------------------
    */

    public function update(Request $request, User $user)
    {
        /*
        |--------------------------------------------------------------------------
        | VALIDATE INPUT
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email,' . $user->id,
            ],

            'role' => [
                'required',
                'in:admin,user',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | UPDATE USER
        |--------------------------------------------------------------------------
        */

        $user->update([
            'name' => $validated['name'],

            'email' => $validated['email'],

            'role' => $validated['role'],
        ]);

        /*
        |--------------------------------------------------------------------------
        | RETURN
        |--------------------------------------------------------------------------
        */

        return redirect()
            ->route('user.management')
            ->with(
                'success',
                'User has been updated successfully.'
            );
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE USER
    |--------------------------------------------------------------------------
    */

    public function destroy(User $user)
    {
        /*
        |--------------------------------------------------------------------------
        | PREVENT DELETING CURRENT ACCOUNT
        |--------------------------------------------------------------------------
        */

        if (Auth::id() === $user->id) {
            return redirect()
                ->route('user.management')
                ->with(
                    'error',
                    'You cannot delete the account you are currently using.'
                );
        }

        /*
        |--------------------------------------------------------------------------
        | DELETE USER
        |--------------------------------------------------------------------------
        */

        $user->delete();

        /*
        |--------------------------------------------------------------------------
        | RETURN
        |--------------------------------------------------------------------------
        */

        return redirect()
            ->route('user.management')
            ->with(
                'success',
                'User has been deleted successfully.'
            );
    }
}