import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Swal from 'sweetalert2';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MonProfile = () => {
  // ── Dark mode: persiste dans localStorage, default = true (sombre) ──
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('fleetify_darkMode');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fleetify_darkMode', String(darkMode));
    } catch {}
  }, [darkMode]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('profil'); // profil | securite
  const [isEditing, setIsEditing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  // ── Données utilisateur connecté (depuis localStorage) ──
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; }
  })();

  const [profileData, setProfileData] = useState({
    nom: storedUser.nom || 'Mbourou',
    prenom: storedUser.prenom || 'Hulas',
    email: storedUser.email || 'j.mbourou@sgs.ga',
    telephone: storedUser.telephone || '+241 77 00 00 01',
    role: storedUser.role?.libelle || 'Administrateur',
    direction: storedUser.direction?.nom || 'Direction Générale',
    derniere_connexion: storedUser.derniere_connexion || "Aujourd'hui, 10:30",
    est_actif: storedUser.est_actif ?? true,
  });

  const [editData, setEditData] = useState({ ...profileData });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // ── L'admin peut modifier son rôle et sa direction, les autres non ──
  const isAdmin = storedUser.role?.code === 'admin' || storedUser.role?.code === 'super_admin';

  // ── Initiales ──
  const getInitiales = () => {
    const p = (profileData.prenom || '').charAt(0).toUpperCase();
    const n = (profileData.nom || '').charAt(0).toUpperCase();
    return `${p}${n}`;
  };

  // ── Config SweetAlert selon thème ──
  const getSwalConfig = () => ({
    background: darkMode ? '#111827' : '#ffffff',
    color: darkMode ? '#f1f5f9' : '#111827',
    confirmButtonColor: theme.primary,
    customClass: {
      popup: 'swal-profile-popup',
      confirmButton: 'swal-confirm-btn',
    },
  });

  const showSuccess = (msg) => {
    Swal.fire({
      ...getSwalConfig(),
      icon: 'success',
      title: 'Succès',
      text: msg,
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false,
      iconColor: '#22c55e',
    });
  };

  const showError = (msg) => {
    Swal.fire({
      ...getSwalConfig(),
      icon: 'error',
      title: 'Erreur',
      text: msg,
      confirmButtonText: 'Fermer',
      iconColor: '#ef4444',
    });
  };

  // ── Sauvegarde du profil ──
  const handleSaveProfile = async () => {
    if (!editData.nom.trim() || !editData.prenom.trim()) {
      showError('Le nom et le prénom sont requis.');
      return;
    }
    if (!editData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      showError("L'adresse email n'est pas valide.");
      return;
    }

    setLoadingProfile(true);
    // Simulation appel API
    await new Promise((r) => setTimeout(r, 900));

    setProfileData({ ...profileData, ...editData });

    // Mettre à jour le localStorage
    try {
      const updatedUser = { ...storedUser, nom: editData.nom, prenom: editData.prenom, email: editData.email, telephone: editData.telephone };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch {}

    setLoadingProfile(false);
    setIsEditing(false);
    showSuccess('Profil mis à jour avec succès !');
  };

  const handleCancelEdit = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  // ── Changement de mot de passe ──
  const handleChangePassword = async () => {
    const { current_password, new_password, confirm_password } = passwordData;

    if (!current_password || !new_password || !confirm_password) {
      showError('Veuillez remplir tous les champs.');
      return;
    }
    if (new_password.length < 8) {
      showError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (new_password !== confirm_password) {
      showError('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    if (current_password === new_password) {
      showError("Le nouveau mot de passe doit être différent de l'actuel.");
      return;
    }

    setLoadingPassword(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoadingPassword(false);

    setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    showSuccess('Mot de passe modifié avec succès !');
  };

  // ── Force du mot de passe ──
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { score, label: 'Très faible', color: '#ef4444' };
    if (score === 2) return { score, label: 'Faible', color: '#f97316' };
    if (score === 3) return { score, label: 'Moyen', color: '#eab308' };
    if (score === 4) return { score, label: 'Fort', color: '#22c55e' };
    return { score, label: 'Très fort', color: '#10b981' };
  };

  const pwdStrength = getPasswordStrength(passwordData.new_password);

  // ── Champ de mot de passe ──
  const PasswordInput = ({ id, label, value, onChange, show, onToggle, placeholder }) => (
    <div>
      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <i className={`bi bi-lock-fill text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}></i>
        </div>
        <input
          type={show ? 'text' : 'password'}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 focus:outline-none focus:ring-0 transition-all duration-200 ${
            darkMode
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-yellow-500'
              : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-yellow-400'
          }`}
          disabled={loadingPassword}
        />
        <button
          type="button"
          onClick={onToggle}
          className={`absolute inset-y-0 right-0 flex items-center pr-4 ${darkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-400 hover:text-yellow-500'} transition-colors`}
        >
          <i className={`bi ${show ? 'bi-eye-slash-fill' : 'bi-eye-fill'} text-sm`}></i>
        </button>
      </div>
    </div>
  );

  return (
    <div className={`${darkMode ? 'bg-gray-950' : 'bg-gray-50'} min-h-screen transition-colors duration-300`}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />

      <style>{`
        .swal-profile-popup { border-radius: 16px !important; }
        .swal-confirm-btn { border-radius: 10px !important; font-weight: 600 !important; padding: 10px 28px !important; }
        .swal2-timer-progress-bar { background: #f59e0b !important; }
      `}</style>

      <Sidebar
        darkMode={darkMode}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        theme={theme}
        navigate={navigate}
      />

      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarCollapsed={sidebarCollapsed}
        theme={theme}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
      />

      <main
        className="transition-all duration-300 pt-24 px-6 pb-6"
        style={{ marginLeft: sidebarCollapsed ? '5rem' : '18rem' }}
      >
        {/* ── Onglets ── */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm mb-6 p-2`}>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('profil')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'profil'
                  ? 'text-white shadow-md'
                  : `${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'}`
              }`}
              style={activeTab === 'profil' ? { background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` } : {}}
            >
              <i className="bi bi-person-fill text-xl"></i>
              <span>Mon Profil</span>
            </button>
            <button
              onClick={() => setActiveTab('securite')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'securite'
                  ? 'text-white shadow-md'
                  : `${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'}`
              }`}
              style={activeTab === 'securite' ? { background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` } : {}}
            >
              <i className="bi bi-shield-lock-fill text-xl"></i>
              <span>Sécurité</span>
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* ONGLET PROFIL                                   */}
        {/* ═══════════════════════════════════════════════ */}
        {activeTab === 'profil' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Carte identité gauche ── */}
            <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm p-8 flex flex-col items-center text-center`}>
              {/* Avatar initiales */}
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-xl mb-5"
                style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` }}
              >
                {getInitiales()}
              </div>

              <h2 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {profileData.prenom} {profileData.nom}
              </h2>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {profileData.email}
              </p>

              {/* Badge rôle */}
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white mb-6"
                style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` }}
              >
                <i className="bi bi-shield-fill text-xs"></i>
                {profileData.role}
              </span>

              {/* Statut */}
              <div className={`w-full rounded-xl p-4 mb-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold uppercase ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Statut</span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    profileData.est_actif
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${profileData.est_actif ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {profileData.est_actif ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold uppercase ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Direction</span>
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{profileData.direction}</span>
                </div>
              </div>

              {/* Dernière connexion */}
              <div className={`w-full rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className={`text-xs font-semibold uppercase mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Dernière connexion</p>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <i className="bi bi-clock mr-1 text-yellow-500"></i>
                  {profileData.derniere_connexion}
                </p>
              </div>
            </div>

            {/* ── Formulaire profil droite ── */}
            <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm overflow-hidden`}>
              {/* Header */}
              <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'} flex items-center justify-between`}>
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Informations personnelles</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Modifiez vos informations de contact
                  </p>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90 shadow-md hover:shadow-lg"
                    style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` }}
                  >
                    <i className="bi bi-pencil-fill"></i>
                    <span>Modifier</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={loadingProfile}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` }}
                    >
                      {loadingProfile ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Sauvegarde...</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg"></i>
                          <span>Sauvegarder</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Champs */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Prénom */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <i className={`bi bi-person text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}></i>
                      </div>
                      <input
                        type="text"
                        value={isEditing ? editData.prenom : profileData.prenom}
                        onChange={(e) => setEditData({ ...editData, prenom: e.target.value })}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                          isEditing
                            ? darkMode
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-yellow-500'
                              : 'bg-white border-gray-200 text-gray-900 focus:border-yellow-400'
                            : darkMode
                              ? 'bg-gray-800/50 border-gray-800 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-50 border-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Nom */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <i className={`bi bi-person text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}></i>
                      </div>
                      <input
                        type="text"
                        value={isEditing ? editData.nom : profileData.nom}
                        onChange={(e) => setEditData({ ...editData, nom: e.target.value })}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                          isEditing
                            ? darkMode
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-yellow-500'
                              : 'bg-white border-gray-200 text-gray-900 focus:border-yellow-400'
                            : darkMode
                              ? 'bg-gray-800/50 border-gray-800 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-50 border-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <i className={`bi bi-envelope text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}></i>
                      </div>
                      <input
                        type="email"
                        value={isEditing ? editData.email : profileData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                          isEditing
                            ? darkMode
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-yellow-500'
                              : 'bg-white border-gray-200 text-gray-900 focus:border-yellow-400'
                            : darkMode
                              ? 'bg-gray-800/50 border-gray-800 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-50 border-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Téléphone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <i className={`bi bi-telephone text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}></i>
                      </div>
                      <input
                        type="tel"
                        value={isEditing ? editData.telephone : profileData.telephone}
                        onChange={(e) => setEditData({ ...editData, telephone: e.target.value })}
                        disabled={!isEditing}
                        placeholder="+241 77 00 00 00"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                          isEditing
                            ? darkMode
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-yellow-500'
                              : 'bg-white border-gray-200 text-gray-900 focus:border-yellow-400'
                            : darkMode
                              ? 'bg-gray-800/50 border-gray-800 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-50 border-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Rôle — modifiable uniquement pour admin */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Rôle
                      {!isAdmin && (
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                          Non modifiable
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <i className={`bi bi-shield-fill text-sm ${
                          isAdmin && isEditing
                            ? darkMode ? 'text-gray-500' : 'text-gray-400'
                            : darkMode ? 'text-gray-600' : 'text-gray-300'
                        }`}></i>
                      </div>
                      <input
                        type="text"
                        value={isEditing && isAdmin ? editData.role : profileData.role}
                        onChange={(e) => isAdmin && setEditData({ ...editData, role: e.target.value })}
                        disabled={!isEditing || !isAdmin}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                          isEditing && isAdmin
                            ? darkMode
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-yellow-500'
                              : 'bg-white border-gray-200 text-gray-900 focus:border-yellow-400'
                            : darkMode
                              ? 'bg-gray-800/30 border-gray-800 text-gray-600 cursor-not-allowed'
                              : 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Direction — modifiable uniquement pour admin */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Direction
                      {!isAdmin && (
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                          Non modifiable
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <i className={`bi bi-building text-sm ${
                          isAdmin && isEditing
                            ? darkMode ? 'text-gray-500' : 'text-gray-400'
                            : darkMode ? 'text-gray-600' : 'text-gray-300'
                        }`}></i>
                      </div>
                      <input
                        type="text"
                        value={isEditing && isAdmin ? editData.direction : profileData.direction}
                        onChange={(e) => isAdmin && setEditData({ ...editData, direction: e.target.value })}
                        disabled={!isEditing || !isAdmin}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                          isEditing && isAdmin
                            ? darkMode
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-yellow-500'
                              : 'bg-white border-gray-200 text-gray-900 focus:border-yellow-400'
                            : darkMode
                              ? 'bg-gray-800/30 border-gray-800 text-gray-600 cursor-not-allowed'
                              : 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Note champs non modifiables — affichée uniquement pour les non-admins */}
                {!isAdmin && (
                  <div className={`mt-6 flex items-start gap-3 p-4 rounded-xl ${darkMode ? 'bg-gray-800/60 border border-gray-700' : 'bg-yellow-50 border border-yellow-100'}`}>
                    <i className="bi bi-info-circle-fill text-yellow-500 mt-0.5 flex-shrink-0"></i>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Le <strong>rôle</strong> et la <strong>direction</strong> sont gérés par l'administrateur et ne peuvent pas être modifiés ici. Contactez votre administrateur pour toute demande de changement.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* ONGLET SÉCURITÉ                                 */}
        {/* ═══════════════════════════════════════════════ */}
        {activeTab === 'securite' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Carte info sécurité gauche ── */}
            <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm p-8 flex flex-col items-center text-center`}>
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-5 shadow-xl"
                style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` }}
              >
                <i className="bi bi-shield-lock-fill text-4xl text-white"></i>
              </div>

              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Sécurité du compte
              </h3>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Gérez la sécurité de votre accès
              </p>

              {/* Règles */}
              <div className={`w-full rounded-xl p-5 text-left ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className={`text-xs font-bold uppercase mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Règles du mot de passe
                </p>
                {[
                  { rule: '8 caractères minimum', icon: 'bi-check2-circle' },
                  { rule: 'Une lettre majuscule', icon: 'bi-check2-circle' },
                  { rule: 'Un chiffre', icon: 'bi-check2-circle' },
                  { rule: 'Un caractère spécial', icon: 'bi-check2-circle' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 mb-3">
                    <i className={`bi ${item.icon} text-sm`} style={{ color: theme.primary }}></i>
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.rule}</span>
                  </div>
                ))}
              </div>

              {/* Dernière connexion */}
              <div className={`w-full rounded-xl p-4 mt-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className={`text-xs font-semibold uppercase mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Dernière connexion</p>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <i className="bi bi-clock mr-1 text-yellow-500"></i>
                  {profileData.derniere_connexion}
                </p>
              </div>
            </div>

            {/* ── Formulaire mot de passe droite ── */}
            <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm overflow-hidden`}>
              {/* Header */}
              <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Changer le mot de passe</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Choisissez un mot de passe fort pour sécuriser votre compte
                </p>
              </div>

              <div className="p-6 space-y-5">
                {/* Mot de passe actuel */}
                <PasswordInput
                  id="current_password"
                  label="Mot de passe actuel"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  show={showPasswords.current}
                  onToggle={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  placeholder="••••••••"
                />

                <div className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}></div>

                {/* Nouveau mot de passe */}
                <PasswordInput
                  id="new_password"
                  label="Nouveau mot de passe"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  show={showPasswords.new}
                  onToggle={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  placeholder="Minimum 8 caractères"
                />

                {/* Barre de force */}
                {passwordData.new_password && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Force du mot de passe</span>
                      <span className="text-xs font-bold" style={{ color: pwdStrength.color }}>{pwdStrength.label}</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(pwdStrength.score / 5) * 100}%`,
                          backgroundColor: pwdStrength.color,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Confirmer mot de passe */}
                <PasswordInput
                  id="confirm_password"
                  label="Confirmer le nouveau mot de passe"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  show={showPasswords.confirm}
                  onToggle={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  placeholder="Répétez le nouveau mot de passe"
                />

                {/* Indicateur correspondance */}
                {passwordData.confirm_password && passwordData.new_password && (
                  <div className={`flex items-center gap-2 text-xs font-medium ${
                    passwordData.new_password === passwordData.confirm_password ? 'text-green-500' : 'text-red-500'
                  }`}>
                    <i className={`bi ${passwordData.new_password === passwordData.confirm_password ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}></i>
                    {passwordData.new_password === passwordData.confirm_password
                      ? 'Les mots de passe correspondent'
                      : 'Les mots de passe ne correspondent pas'}
                  </div>
                )}

                {/* Bouton */}
                <div className="pt-2">
                  <button
                    onClick={handleChangePassword}
                    disabled={loadingPassword}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` }}
                  >
                    {loadingPassword ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Modification...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-shield-lock-fill"></i>
                        <span>Modifier le mot de passe</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={`mt-8 py-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center justify-center">
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              © 2026 SGS Tous droits réservés - Version 1.0
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MonProfile;