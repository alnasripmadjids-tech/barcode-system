<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index()
    {
        // 1. Kukunin lahat ng data sa items table sa database
        $items = Item::all();

        // 2. Ipapasa ang data sa React page gamit ang Inertia
        return Inertia::render('Items/Index', [
            'items' => $items
        ]);
    }
}




