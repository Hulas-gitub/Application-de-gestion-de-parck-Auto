<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes - Fleetify SGS
|--------------------------------------------------------------------------
*/

// ==========================================
// Routes publiques (non authentifiées)
// ==========================================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']); // Si inscription activée

// ==========================================
// Route de test CORS et API
// ==========================================
Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API Fleetify accessible !',
        'timestamp' => now()->format('Y-m-d H:i:s'),
        'version' => 'v1.0'
    ]);
});

// ==========================================
// Routes protégées par Sanctum
// ==========================================
Route::middleware('auth:sanctum')->group(function () {
    
    // ==========================================
    // Routes d'authentification
    // ==========================================
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/check-permission', [AuthController::class, 'checkPermission']);
    
    // ==========================================
    // Routes protégées par rôles
    // ==========================================
    
    // Routes ADMIN uniquement
    Route::prefix('admin')->middleware(['role:admin'])->group(function () {
        // Gestion des utilisateurs
        // Route::apiResource('utilisateurs', UtilisateurController::class);
        
        // Gestion des rôles
        // Route::apiResource('roles', RoleController::class);
        
        // Paramètres système
        // Route::get('settings', [SettingController::class, 'index']);
        // Route::put('settings', [SettingController::class, 'update']);
    });
    
    // Routes ADMIN + CHEF_PARC
    Route::middleware(['role:admin,chef_parc'])->group(function () {
        // Gestion des véhicules
        // Route::apiResource('vehicules', VehiculeController::class);
        
        // Gestion du stock
        // Route::apiResource('pieces', PieceDetacheeController::class);
        
        // Gestion des interventions
        // Route::apiResource('interventions', InterventionController::class);
    });
    
    // Routes ADMIN + CHEF_PARC + CHEF_TF
    Route::middleware(['role:admin,chef_parc,chef_tf'])->group(function () {
        // Gestion des missions
        // Route::apiResource('missions', MissionController::class);
        
        // Gestion des chauffeurs
        // Route::get('chauffeurs', [UtilisateurController::class, 'chauffeurs']);
    });
    
    // Routes MECANICIEN
    Route::middleware(['role:admin,chef_parc,mecanicien'])->group(function () {
        // Interventions
        // Route::get('interventions', [InterventionController::class, 'index']);
        // Route::post('interventions/{id}/complete', [InterventionController::class, 'complete']);
    });
    
    // Routes AGENT_PC_RADIO
    Route::middleware(['role:admin,chef_parc,agent_pc_radio'])->group(function () {
        // PC Radio
        // Route::apiResource('pc-radio', PcRadioController::class);
    });
    
    // ==========================================
    // Routes accessibles à TOUS les utilisateurs authentifiés
    // ==========================================
    
    // Dashboard
    // Route::get('dashboard', [DashboardController::class, 'index']);
    
    // Profil utilisateur
    // Route::get('profile', [ProfileController::class, 'show']);
    // Route::put('profile', [ProfileController::class, 'update']);
    // Route::put('profile/password', [ProfileController::class, 'updatePassword']);
    
    // Notifications
    // Route::get('notifications', [NotificationController::class, 'index']);
    // Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    // Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead']);
});