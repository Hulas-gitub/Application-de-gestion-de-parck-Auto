<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Connexion utilisateur avec vérification complète
     */
    public function login(Request $request)
    {
        // Validation avec messages personnalisés
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
            'remember_me' => 'boolean', // Nouveau champ
        ], [
            'email.required' => 'L\'adresse email est requise',
            'email.email' => 'L\'adresse email n\'est pas valide',
            'password.required' => 'Le mot de passe est requis',
            'password.min' => 'Le mot de passe doit contenir au moins 6 caractères',
        ]);

        try {
            // 1. Rechercher l'utilisateur avec ses relations
            $user = Utilisateur::with(['role', 'direction'])
                ->where('email', $request->email)
                ->first();

            // 2. Vérifier si l'utilisateur existe
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucun compte trouvé avec cet email'
                ], 404);
            }

            // 3. Vérifier le mot de passe
            if (!Hash::check($request->password, $user->mot_de_passe)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mot de passe incorrect'
                ], 401);
            }

            // 4. Vérifier que l'utilisateur est actif
            if (!$user->est_actif) {
                return response()->json([
                    'success' => false,
                    'message' => 'Votre compte est désactivé. Contactez l\'administrateur.'
                ], 403);
            }

            // 5. Vérifier que l'utilisateur n'est pas supprimé
            if ($user->est_supprime) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce compte n\'existe plus. Contactez l\'administrateur.'
                ], 403);
            }

            // 6. Vérifier que le rôle existe et est actif
            if (!$user->role || $user->role->est_supprime) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de configuration du compte. Contactez l\'administrateur.'
                ], 500);
            }

            // 7. Déterminer la durée du token selon "Se souvenir de moi"
            $rememberMe = $request->boolean('remember_me', false);
            $tokenExpiration = $rememberMe ? now()->addDays(30) : now()->addDays(7);
            $expiresInSeconds = $rememberMe ? (30 * 24 * 60 * 60) : (7 * 24 * 60 * 60);

            // 8. Créer le token Sanctum avec expiration personnalisée
            $token = $user->createToken('auth_token', ['*'], $tokenExpiration)->plainTextToken;

            // 9. Mettre à jour la dernière connexion
            $user->derniere_connexion = now();
            $user->save();

            // 10. Préparer les données utilisateur complètes
            $userData = [
                'id' => $user->id,
                'nom' => $user->nom,
                'email' => $user->email,
                'est_actif' => $user->est_actif,
                'derniere_connexion' => $user->derniere_connexion?->format('Y-m-d H:i:s'),
                
                // Informations du rôle
                'role' => [
                    'id' => $user->role->id,
                    'code' => $user->role->code,
                    'libelle' => $user->role->libelle,
                    'description' => $user->role->description,
                ],
                
                // Informations de la direction (si existe)
                'direction' => $user->direction ? [
                    'id' => $user->direction->id,
                    'nom' => $user->direction->nom,
                    'code' => $user->direction->code,
                ] : null,
                
                // Permissions basées sur le rôle
                'permissions' => $this->getPermissionsByRole($user->role->code),
            ];

            // 11. Log de connexion
            \Log::info('Connexion réussie', [
                'user_id' => $user->id,
                'email' => $user->email,
                'role' => $user->role->code,
                'remember_me' => $rememberMe,
                'token_expires_at' => $tokenExpiration->format('Y-m-d H:i:s'),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            // 12. Retourner la réponse avec toutes les données
            return response()->json([
                'success' => true,
                'message' => 'Connexion réussie',
                'token' => $token,
                'user' => $userData,
                'token_type' => 'Bearer',
                'expires_in' => $expiresInSeconds,
                'remember_me' => $rememberMe,
                'expires_at' => $tokenExpiration->format('Y-m-d H:i:s'),
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Erreur lors de la connexion', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la connexion',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Obtenir l'utilisateur connecté avec toutes ses informations
     */
    public function user(Request $request)
    {
        try {
            $user = $request->user()->load(['role', 'direction']);

            // Vérifier que l'utilisateur est toujours actif
            if (!$user->est_actif || $user->est_supprime) {
                return response()->json([
                    'success' => false,
                    'message' => 'Votre session a expiré ou votre compte a été désactivé'
                ], 401);
            }

            $userData = [
                'id' => $user->id,
                'nom' => $user->nom,
                'email' => $user->email,
                'est_actif' => $user->est_actif,
                'derniere_connexion' => $user->derniere_connexion?->format('Y-m-d H:i:s'),
                
                'role' => [
                    'id' => $user->role->id,
                    'code' => $user->role->code,
                    'libelle' => $user->role->libelle,
                    'description' => $user->role->description,
                ],
                
                'direction' => $user->direction ? [
                    'id' => $user->direction->id,
                    'nom' => $user->direction->nom,
                    'code' => $user->direction->code,
                ] : null,
                
                'permissions' => $this->getPermissionsByRole($user->role->code),
            ];

            return response()->json([
                'success' => true,
                'user' => $userData
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des données utilisateur',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Déconnexion utilisateur
     */
    public function logout(Request $request)
    {
        try {
            $user = $request->user();

            // Log de déconnexion
            \Log::info('Déconnexion', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);

            // Supprimer tous les tokens de l'utilisateur
            $user->tokens()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Déconnexion réussie'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la déconnexion',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Rafraîchir le token
     */
    public function refresh(Request $request)
    {
        try {
            $user = $request->user()->load(['role', 'direction']);

            // Supprimer l'ancien token
            $request->user()->currentAccessToken()->delete();

            // Créer un nouveau token
            $token = $user->createToken('auth_token', ['*'], now()->addDays(7))->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Token rafraîchi avec succès',
                'token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => 7 * 24 * 60 * 60,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du rafraîchissement du token',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Vérifier les permissions d'un utilisateur
     */
    public function checkPermission(Request $request)
    {
        $request->validate([
            'permission' => 'required|string'
        ]);

        try {
            $user = $request->user()->load('role');
            $permissions = $this->getPermissionsByRole($user->role->code);

            $hasPermission = in_array($request->permission, $permissions);

            return response()->json([
                'success' => true,
                'has_permission' => $hasPermission,
                'permission' => $request->permission
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la vérification des permissions',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    
    /**
     * Obtenir les permissions selon le rôle
     */
    private function getPermissionsByRole(string $roleCode): array
    {
        $permissions = [
            'admin' => [
                'dashboard.view',
                'users.view', 'users.create', 'users.edit', 'users.delete',
                'vehicules.view', 'vehicules.create', 'vehicules.edit', 'vehicules.delete',
                'missions.view', 'missions.create', 'missions.edit', 'missions.delete',
                'interventions.view', 'interventions.create', 'interventions.edit', 'interventions.delete',
                'anomalies.view', 'anomalies.create', 'anomalies.edit', 'anomalies.delete',
                'accidents.view', 'accidents.create', 'accidents.edit', 'accidents.delete',
                'stock.view', 'stock.create', 'stock.edit', 'stock.delete',
                'documents.view', 'documents.create', 'documents.edit', 'documents.delete',
                'rapports.view', 'rapports.create',
                'settings.view', 'settings.edit',
            ],
            
            'chef_parc' => [
                'dashboard.view',
                'vehicules.view', 'vehicules.create', 'vehicules.edit',
                'missions.view', 'missions.create', 'missions.edit',
                'interventions.view', 'interventions.create', 'interventions.edit',
                'anomalies.view', 'anomalies.edit',
                'accidents.view', 'accidents.edit',
                'stock.view', 'stock.create', 'stock.edit',
                'documents.view', 'documents.create',
                'rapports.view', 'rapports.create',
            ],
            
            'chef_tf' => [
                'dashboard.view',
                'missions.view', 'missions.create', 'missions.edit',
                'vehicules.view',
                'chauffeurs.view',
                'anomalies.view',
                'accidents.view',
                'rapports.view',
            ],
            
            'mecanicien' => [
                'dashboard.view',
                'interventions.view', 'interventions.edit',
                'anomalies.view', 'anomalies.edit',
                'vehicules.view',
                'stock.view',
            ],
            
            'agent_pc_radio' => [
                'dashboard.view',
                'pc_radio.view', 'pc_radio.create', 'pc_radio.edit',
                'vehicules.view',
                'chauffeurs.view',
            ],
            
            'chauffeur' => [
                'dashboard.view',
                'missions.view',
                'anomalies.view', 'anomalies.create',
                'vehicules.view',
            ],
        ];

        return $permissions[$roleCode] ?? [];
    }
}