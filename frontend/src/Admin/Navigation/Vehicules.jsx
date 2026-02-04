import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
// ============================================================================

// ============================================================================
// DONNÉES DE RÉFÉRENCE
// ============================================================================
const categories = ['4x4', 'Berline', 'Pickup', 'Utilitaire', 'Minibus', 'Blindé'];
const marques = ['Toyota', 'Nissan', 'Ford', 'Mercedes', 'Peugeot', 'Mitsubishi', 'Hyundai'];
const modeles = {
  'Toyota': ['Land Cruiser', 'Hilux', 'Prado', 'Corolla', 'Hiace'],
  'Nissan': ['Patrol', 'Navara', 'X-Trail', 'Almera'],
  'Ford': ['Ranger', 'Everest', 'Transit'],
  'Mercedes': ['Sprinter', 'Classe C', 'Vito'],
  'Peugeot': ['508', '3008', 'Partner'],
  'Mitsubishi': ['Pajero', 'L200', 'Outlander'],
  'Hyundai': ['Tucson', 'Santa Fe', 'H1']
};
const directions = ['Direction Générale', 'Direction Technique', 'Direction Commerciale', 'Direction Financière', 'Direction RH', 'Transport de Fonds', 'Direction Logistique'];
const statuts = ['Disponible', 'En Mission', 'Maintenance', 'Immobilisé'];

// ============================================================================
// DONNÉES INITIALES
// ============================================================================
const initialVehicles = [

  { id: '2', immatriculation: 'CD-5678-GA', marque: 'Nissan', modele: 'Patrol', categorie: '4x4', annee: 2021, kilometrage: 62000, statut: 'En Mission', chauffeur: 'Pierre Nzong', direction: 'Direction Technique', carburant: 'Diesel', puissance: '275 CV', couleur: 'Noir', dateAchat: '2021-06-20', prixAchat: 52000000, assuranceExpire: '2025-06-20', visiteExpire: '2025-06-18', image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400' },
  { id: '3', immatriculation: 'EF-9012-GA', marque: 'Toyota', modele: 'Hilux', categorie: 'Pickup', annee: 2023, kilometrage: 38000, statut: 'Maintenance', chauffeur: null, direction: 'Direction Commerciale', carburant: 'Diesel', puissance: '150 CV', couleur: 'Gris', dateAchat: '2023-01-10', prixAchat: 35000000, assuranceExpire: '2026-01-10', visiteExpire: '2026-01-08', image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400' },
  { id: '4', immatriculation: 'GH-3456-GA', marque: 'Mercedes', modele: 'Sprinter', categorie: 'Utilitaire', annee: 2020, kilometrage: 28000, statut: 'Disponible', chauffeur: 'Paul Ondo', direction: 'Direction Logistique', carburant: 'Diesel', puissance: '163 CV', couleur: 'Blanc', dateAchat: '2020-09-05', prixAchat: 42000000, assuranceExpire: '2025-09-05', visiteExpire: '2025-09-03', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
  { id: '5', immatriculation: 'IJ-7890-GA', marque: 'Peugeot', modele: '508', categorie: 'Berline', annee: 2022, kilometrage: 95000, statut: 'Immobilisé', chauffeur: null, direction: 'Direction Financière', carburant: 'Essence', puissance: '165 CV', couleur: 'Noir', dateAchat: '2022-07-12', prixAchat: 28000000, assuranceExpire: '2025-07-12', visiteExpire: '2025-07-10', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400' },
  { id: '6', immatriculation: 'KL-1234-GA', marque: 'Toyota', modele: 'Prado', categorie: '4x4', annee: 2021, kilometrage: 52000, statut: 'Disponible', chauffeur: 'Marc Essono', direction: 'Direction RH', carburant: 'Diesel', puissance: '177 CV', couleur: 'Blanc', dateAchat: '2021-11-20', prixAchat: 48000000, assuranceExpire: '2025-11-20', visiteExpire: '2025-11-18', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400' },
  { id: '7', immatriculation: 'MN-5678-GA', marque: 'Ford', modele: 'Ranger', categorie: 'Pickup', annee: 2023, kilometrage: 41000, statut: 'En Mission', chauffeur: 'Luc Mba', direction: 'Direction Technique', carburant: 'Diesel', puissance: '170 CV', couleur: 'Bleu', dateAchat: '2023-04-08', prixAchat: 38000000, assuranceExpire: '2026-04-08', visiteExpire: '2026-04-06', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400' },
  { id: '8', immatriculation: 'OP-9012-GA', marque: 'Mitsubishi', modele: 'Pajero', categorie: '4x4', annee: 2020, kilometrage: 35000, statut: 'Disponible', chauffeur: null, direction: 'Transport de Fonds', carburant: 'Diesel', puissance: '190 CV', couleur: 'Argent', dateAchat: '2020-12-01', prixAchat: 46000000, assuranceExpire: '2025-12-01', visiteExpire: '2025-11-29', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400' }
];

const vehicleDocuments = {
  '1': [
    { id: 'd1', nom: 'Carte Grise', type: 'Administratif', dateExpiration: '2027-03-15', statut: 'Valide' },
    { id: 'd2', nom: 'Assurance', type: 'Assurance', dateExpiration: '2025-12-15', statut: 'Expire bientôt' },
    { id: 'd3', nom: 'Visite Technique', type: 'Technique', dateExpiration: '2025-12-22', statut: 'Expire bientôt' },
    { id: 'd4', nom: 'Vignette', type: 'Fiscal', dateExpiration: '2025-12-31', statut: 'Valide' }
  ],
  '2': [
    { id: 'd5', nom: 'Carte Grise', type: 'Administratif', dateExpiration: '2026-06-20', statut: 'Valide' },
    { id: 'd6', nom: 'Assurance', type: 'Assurance', dateExpiration: '2025-06-20', statut: 'Expire bientôt' },
    { id: 'd7', nom: 'Visite Technique', type: 'Technique', dateExpiration: '2025-06-18', statut: 'Expire bientôt' }
  ],
  '3': [
    { id: 'd8', nom: 'Carte Grise', type: 'Administratif', dateExpiration: '2028-01-10', statut: 'Valide' },
    { id: 'd9', nom: 'Assurance', type: 'Assurance', dateExpiration: '2026-01-10', statut: 'Valide' }
  ]
};

const vehicleMaintenances = {
  '1': [
    { id: 'm1', type: 'Vidange', date: '2025-01-15', kilometrage: 44000, cout: 85000, statut: 'Effectuée', description: 'Vidange huile moteur + filtre' },
    { id: 'm2', type: 'Révision', date: '2024-10-20', kilometrage: 40000, cout: 350000, statut: 'Effectuée', description: 'Révision complète 40 000 km' },
    { id: 'm3', type: 'Pneus', date: '2025-02-28', kilometrage: 46000, cout: 480000, statut: 'Planifiée', description: 'Remplacement 4 pneus' }
  ],
  '3': [{ id: 'm4', type: 'Freins', date: '2025-02-01', kilometrage: 38000, cout: 250000, statut: 'En cours', description: 'Remplacement plaquettes et disques avant' }],
  '5': [{ id: 'm5', type: 'Moteur', date: '2025-01-20', kilometrage: 95000, cout: 1500000, statut: 'En cours', description: 'Réparation moteur - panne grave' }]
};

const vehicleMissions = {
  '1': [
    { id: 'mi1', destination: 'Franceville', dateDepart: '2025-01-20', dateRetour: '2025-01-22', chauffeur: 'Jean Mbourou', kilometrage: 1200, statut: 'Terminée' },
    { id: 'mi2', destination: 'Port-Gentil', dateDepart: '2025-01-25', dateRetour: '2025-01-27', chauffeur: 'Jean Mbourou', kilometrage: 800, statut: 'Terminée' },
    { id: 'mi3', destination: 'Oyem', dateDepart: '2025-02-15', dateRetour: '2025-02-18', chauffeur: 'Jean Mbourou', kilometrage: 1500, statut: 'Planifiée' }
  ],
  '2': [{ id: 'mi4', destination: 'Lambaréné', dateDepart: '2025-02-01', dateRetour: '2025-02-03', chauffeur: 'Pierre Nzong', kilometrage: 0, statut: 'En cours' }],
  '7': [{ id: 'mi5', destination: 'Mouila', dateDepart: '2025-02-02', dateRetour: '2025-02-05', chauffeur: 'Luc Mba', kilometrage: 0, statut: 'En cours' }]
};

const vehicleCarburant = {
  '1': [
    { id: 'c1', date: '2025-01-28', litres: 80, montant: 72000, kilometrage: 44800, station: 'Total Libreville' },
    { id: 'c2', date: '2025-01-15', litres: 75, montant: 67500, kilometrage: 44000, station: 'Oilibya Centre' },
    { id: 'c3', date: '2025-01-02', litres: 82, montant: 73800, kilometrage: 43200, station: 'Total Owendo' }
  ],
  '2': [
    { id: 'c4', date: '2025-02-01', litres: 90, montant: 81000, kilometrage: 62000, station: 'Total Libreville' },
    { id: 'c5', date: '2025-01-20', litres: 85, montant: 76500, kilometrage: 61200, station: 'Oilibya Nord' }
  ],
  '7': [{ id: 'c6', date: '2025-02-02', litres: 70, montant: 63000, kilometrage: 41000, station: 'Total Owendo' }]
};

// ============================================================================
// TOAST COMPONENT
// ============================================================================
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = { success: 'bg-green-500', error: 'bg-red-500', warning: 'bg-yellow-500', info: 'bg-blue-500' }[type];
  const icon = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', warning: 'bi-exclamation-triangle-fill', info: 'bi-info-circle-fill' }[type];

  return (
    <div className={`fixed top-4 right-4 z-[9999] ${bgColor} text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3`} style={{ animation: 'fadeInDown 0.3s ease-out' }}>
      <style>{`@keyframes fadeInDown { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <i className={`${icon} text-xl`}></i>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 hover:opacity-80"><i className="bi bi-x-lg"></i></button>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const Vehicules = () => {
  // ── Dark mode : même config que Dashboard (localStorage, default true) ──
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
  const [animateCards, setAnimateCards] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Même logique d'animation que Dashboard
  useEffect(() => {
    setAnimateCards(false);
    const id = requestAnimationFrame(() => {
      const id2 = requestAnimationFrame(() => {
        setAnimateCards(true);
      });
      return () => cancelAnimationFrame(id2);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // ── States fonctionnels ──
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategorie, setFilterCategorie] = useState('');
  const [filterMarque, setFilterMarque] = useState('');
  const [filterModele, setFilterModele] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [detailTab, setDetailTab] = useState('general');
  const [toast, setToast] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const [formData, setFormData] = useState({
    immatriculation: '', marque: '', modele: '', categorie: '', annee: new Date().getFullYear(),
    kilometrage: 0, statut: 'Disponible', chauffeur: null, direction: '', carburant: 'Diesel',
    puissance: '', couleur: '', dateAchat: '', prixAchat: 0, assuranceExpire: '', visiteExpire: '', image: ''
  });

  const itemsPerPage = 6;

  // ── Filtrage & pagination ──
  const filteredVehicles = vehicles.filter(v => {
    const matchSearch = v.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        v.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        v.modele.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch &&
      (!filterCategorie || v.categorie === filterCategorie) &&
      (!filterMarque || v.marque === filterMarque) &&
      (!filterModele || v.modele === filterModele) &&
      (!filterStatut || v.statut === filterStatut);
  });

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const availableModeles = filterMarque ? modeles[filterMarque] || [] : [];
  const formAvailableModeles = formData.marque ? modeles[formData.marque] || [] : [];

  // ── Handlers ──
  const showToast = (message, type) => setToast({ message, type });

  const handleAddVehicle = () => {
    setVehicles([...vehicles, { ...formData, id: Date.now().toString(), image: formData.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400' }]);
    setShowAddModal(false); resetForm();
    showToast('Véhicule ajouté avec succès', 'success');
  };

  const handleEditVehicle = () => {
    if (selectedVehicle) {
      setVehicles(vehicles.map(v => v.id === selectedVehicle.id ? { ...v, ...formData } : v));
      setShowEditModal(false); setSelectedVehicle(null); resetForm();
      showToast('Véhicule modifié avec succès', 'success');
    }
  };

  const handleDeleteVehicle = () => {
    if (vehicleToDelete) {
      setVehicles(vehicles.filter(v => v.id !== vehicleToDelete.id));
      setShowDeleteConfirm(false); setVehicleToDelete(null);
      showToast('Véhicule supprimé avec succès', 'success');
    }
  };

  const handleChangeStatut = (vehicle, newStatut) => {
    setVehicles(vehicles.map(v => v.id === vehicle.id ? { ...v, statut: newStatut } : v));
    setActiveMenu(null);
    showToast(`Statut changé en "${newStatut}"`, 'success');
  };

  const openEditModal = (vehicle) => { setSelectedVehicle(vehicle); setFormData(vehicle); setShowEditModal(true); };
  const openDetailModal = (vehicle) => { setSelectedVehicle(vehicle); setDetailTab('general'); setShowDetailModal(true); };
  const openDeleteConfirm = (vehicle) => { setVehicleToDelete(vehicle); setShowDeleteConfirm(true); };

  const resetForm = () => setFormData({
    immatriculation: '', marque: '', modele: '', categorie: '', annee: new Date().getFullYear(),
    kilometrage: 0, statut: 'Disponible', chauffeur: null, direction: '', carburant: 'Diesel',
    puissance: '', couleur: '', dateAchat: '', prixAchat: 0, assuranceExpire: '', visiteExpire: '', image: ''
  });

  const resetFilters = () => { setFilterCategorie(''); setFilterMarque(''); setFilterModele(''); setFilterStatut(''); setSearchTerm(''); setCurrentPage(1); };

  const getStatutColor = (statut) => ({
    'Disponible': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'En Mission': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Maintenance': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'Immobilisé': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }[statut] || 'bg-gray-100 text-gray-700');

  const getVehicleStats = (vehicleId) => {
    const carb = vehicleCarburant[vehicleId] || [];
    const maint = vehicleMaintenances[vehicleId] || [];
    const miss = vehicleMissions[vehicleId] || [];
    const totalCarburant = carb.reduce((s, c) => s + c.litres, 0);
    const totalCarburantCout = carb.reduce((s, c) => s + c.montant, 0);
    const totalMaintenance = maint.reduce((s, m) => s + m.cout, 0);
    const totalKmMissions = miss.reduce((s, m) => s + m.kilometrage, 0);
    const consommationMoyenne = totalCarburant > 0 && totalKmMissions > 0 ? ((totalCarburant / totalKmMissions) * 100).toFixed(1) : 0;
    return { totalCarburant, totalCarburantCout, totalMaintenance, totalMissions: miss.length, totalKmMissions, consommationMoyenne, coutTotal: totalCarburantCout + totalMaintenance };
  };
    {/* ============================================================================ */}
      {/* UTILISATION DU COMPOSANT SIDEBAR IMPORTÉ */}
      {/* ============================================================================ */}
      <Sidebar 
        darkMode={darkMode} 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed}
      />

      {/* ============================================================================ */}
      {/* UTILISATION DU COMPOSANT HEADER IMPORTÉ */}
      {/* ============================================================================ */}
      <Header 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        sidebarCollapsed={sidebarCollapsed}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
      />

  // ============================================================================
  // STATS CARDS — même style que Dashboard (rounded-xl, p-6, hover, fadeInUp)
  // ============================================================================
  const statsCards = [
    { title: 'Total Véhicules', value: String(vehicles.length), subtitle: 'dans le parc', trend: '', icon: 'bi-car-front-fill', iconBg: 'bg-blue-100 dark:bg-blue-800', textColor: 'text-blue-600 dark:text-blue-400' },
    { title: 'Disponibles', value: String(vehicles.filter(v => v.statut === 'Disponible').length), subtitle: 'prêts à partir', trend: '', icon: 'bi-check-circle-fill', iconBg: 'bg-green-100 dark:bg-green-800', textColor: 'text-green-600 dark:text-green-400' },
    { title: 'En Mission', value: String(vehicles.filter(v => v.statut === 'En Mission').length), subtitle: 'en cours', trend: '', icon: 'bi-geo-alt-fill', iconBg: 'bg-purple-100 dark:bg-purple-800', textColor: 'text-purple-600 dark:text-purple-400' },
    { title: 'Maintenance', value: String(vehicles.filter(v => v.statut === 'Maintenance').length), subtitle: 'à l\'atelier', trend: '', icon: 'bi-tools', iconBg: 'bg-orange-100 dark:bg-orange-800', textColor: 'text-orange-600 dark:text-orange-400' },
    { title: 'Immobilisés', value: String(vehicles.filter(v => v.statut === 'Immobilisé').length), subtitle: 'hors service', trend: '', icon: 'bi-x-circle-fill', iconBg: 'bg-red-100 dark:bg-red-800', textColor: 'text-red-600 dark:text-red-400' },
    { title: 'Kilométrage Total', value: vehicles.reduce((s, v) => s + v.kilometrage, 0).toLocaleString() + ' km', subtitle: 'ensemble du parc', trend: '', icon: 'bi-speedometer2', iconBg: 'bg-blue-100 dark:bg-blue-800', textColor: 'text-blue-600 dark:text-blue-400' },
    { title: 'Véhicules 4x4', value: String(vehicles.filter(v => v.categorie === '4x4').length), subtitle: 'dans le parc', trend: '', icon: 'bi-truck', iconBg: 'bg-yellow-100 dark:bg-yellow-800', textColor: 'text-yellow-600 dark:text-yellow-400' },
    { title: 'Directions', value: String([...new Set(vehicles.map(v => v.direction))].length), subtitle: 'desservies', trend: '', icon: 'bi-building', iconBg: 'bg-pink-100 dark:bg-pink-800', textColor: 'text-pink-600 dark:text-pink-400' }
  ];

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className={`${darkMode ? 'bg-gray-950' : 'bg-gray-50'} min-h-screen transition-colors duration-300`}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Sidebar darkMode={darkMode} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} theme={theme} navigate={navigate} />

      <Header darkMode={darkMode} setDarkMode={setDarkMode} sidebarCollapsed={sidebarCollapsed} theme={theme} showNotifications={showNotifications} setShowNotifications={setShowNotifications} showProfile={showProfile} setShowProfile={setShowProfile} />

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Click outside handler — ferme les dropdowns */}
      {(activeMenu || showNotifications || showProfile) && (
        <div className="fixed inset-0 z-30" onClick={() => { setActiveMenu(null); setShowNotifications(false); setShowProfile(false); }} />
      )}

      <main className="transition-all duration-300 pt-24 px-6 pb-6" style={{ marginLeft: sidebarCollapsed ? '5rem' : '18rem' }}>

        {/* ─── STATS GRID — même structure que Dashboard ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statsCards.map((card, idx) => (
            <div
              key={idx}
              className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl p-6 border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group`}
              style={{ animation: animateCards ? `fadeInUp 0.5s ease-out ${idx * 0.1}s both` : 'none' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>{card.title}</p>
                  <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{card.value}</h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{card.subtitle}</p>
                </div>
                <div className={`${card.iconBg} ${card.textColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                  <i className={card.icon} style={{ fontSize: '1.5rem' }}></i>
                </div>
              </div>
              {card.trend && (
                <div className={`flex items-center gap-1 text-xs ${card.trend.includes('-') ? 'text-red-600' : 'text-green-600'}`}>
                  <i className={card.trend.includes('-') ? 'bi bi-graph-down-arrow' : 'bi bi-graph-up-arrow'}></i>
                  <span>{card.trend}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ─── TOOLBAR ─── */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm p-4 mb-6`}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Filtres */}
            <div className="flex items-center gap-3 flex-wrap">
              <select value={filterCategorie} onChange={(e) => { setFilterCategorie(e.target.value); setCurrentPage(1); }}
                className={`px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                <option value="">Catégorie</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select value={filterMarque} onChange={(e) => { setFilterMarque(e.target.value); setFilterModele(''); setCurrentPage(1); }}
                className={`px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                <option value="">Marque</option>
                {marques.map(m => <option key={m} value={m}>{m}</option>)}
              </select>

              <select value={filterModele} onChange={(e) => { setFilterModele(e.target.value); setCurrentPage(1); }} disabled={!filterMarque}
                className={`px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 disabled:opacity-50`} style={{ '--tw-ring-color': theme.primary }}>
                <option value="">Modèle</option>
                {availableModeles.map(m => <option key={m} value={m}>{m}</option>)}
              </select>

              <select value={filterStatut} onChange={(e) => { setFilterStatut(e.target.value); setCurrentPage(1); }}
                className={`px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                <option value="">Statut</option>
                {statuts.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              {(filterCategorie || filterMarque || filterModele || filterStatut) && (
                <button onClick={resetFilters} className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${darkMode ? 'bg-gray-800 text-red-400 hover:bg-gray-700' : 'bg-red-50 text-red-600 hover:bg-red-100'} transition-colors`}>
                  <i className="bi bi-x-lg"></i> Effacer
                </button>
              )}
            </div>

            {/* View toggle + Ajouter */}
            <div className="flex items-center gap-3">
              <div className={`flex rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                <button onClick={() => setViewMode('table')}
                  className={`px-3 py-2 transition-colors ${viewMode === 'table' ? 'text-white' : darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  style={viewMode === 'table' ? { background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` } : {}}>
                  <i className="bi bi-list-ul"></i>
                </button>
                <button onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 transition-colors ${viewMode === 'grid' ? 'text-white' : darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  style={viewMode === 'grid' ? { background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` } : {}}>
                  <i className="bi bi-grid-3x3-gap-fill"></i>
                </button>
              </div>

              <button onClick={() => setShowAddModal(true)}
                className="px-5 py-2 rounded-lg text-white text-sm font-medium flex items-center gap-2 shadow-sm hover:opacity-90 hover:shadow-md transition-all"
                style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` }}>
                <i className="bi bi-plus-lg"></i> Ajouter
              </button>
            </div>
          </div>
        </div>

        {/* ─── TABLE VIEW ─── */}
        {viewMode === 'table' && (
          <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <tr>
                    {['Véhicule', 'Catégorie', 'Direction', 'Chauffeur', 'Statut', 'Kilométrage', 'Actions'].map((h, i) => (
                      <th key={i} className={`px-5 py-3.5 text-left text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider ${i === 6 ? 'text-center' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
                  {paginatedVehicles.map((vehicle, rowIdx) => (
                    <tr key={vehicle.id}
                      className={`${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-all duration-200`}
                      style={{ animation: animateCards ? `fadeInUp 0.4s ease-out ${rowIdx * 0.06}s both` : 'none' }}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={vehicle.image || '/placeholder.svg'} alt={vehicle.marque} className="w-11 h-11 rounded-lg object-cover shadow-sm" />
                          <div>
                            <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{vehicle.immatriculation}</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{vehicle.marque} {vehicle.modele} · {vehicle.annee}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-5 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{vehicle.categorie}</td>
                      <td className={`px-5 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{vehicle.direction}</td>
                      <td className={`px-5 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{vehicle.chauffeur || '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatutColor(vehicle.statut)}`}>{vehicle.statut}</span>
                      </td>
                      <td className={`px-5 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{vehicle.kilometrage.toLocaleString()} km</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => openDetailModal(vehicle)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'} transition-colors`} title="Détails">
                            <i className="bi bi-eye"></i>
                          </button>
                          <button onClick={() => openEditModal(vehicle)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'} transition-colors`} title="Modifier">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <div className="relative">
                            <button onClick={() => setActiveMenu(activeMenu === vehicle.id ? null : vehicle.id)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'} transition-colors`}>
                              <i className="bi bi-three-dots-vertical"></i>
                            </button>
                            {activeMenu === vehicle.id && (
                              <div className={`absolute right-0 mt-1 w-48 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-xl z-50`}>
                                <p className={`px-3 py-2 text-xs font-semibold ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Changer statut</p>
                                {statuts.filter(s => s !== vehicle.statut).map(s => (
                                  <button key={s} onClick={() => handleChangeStatut(vehicle, s)}
                                    className={`w-full text-left px-3 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}>{s}</button>
                                ))}
                                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-1`}></div>
                                <button onClick={() => { openDeleteConfirm(vehicle); setActiveMenu(null); }}
                                  className={`w-full text-left px-3 py-2 text-sm text-red-500 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-50'} transition-colors`}>
                                  <i className="bi bi-trash mr-2"></i>Supprimer
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`px-5 py-3.5 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'} flex items-center justify-between`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredVehicles.length)} sur {filteredVehicles.length} véhicules
                </p>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                    className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:bg-gray-800 disabled:opacity-40' : 'text-gray-600 hover:bg-gray-100 disabled:opacity-40'} transition-colors`}>
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${currentPage === page ? 'text-white shadow-sm' : darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                      style={currentPage === page ? { background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` } : {}}>
                      {page}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:bg-gray-800 disabled:opacity-40' : 'text-gray-600 hover:bg-gray-100 disabled:opacity-40'} transition-colors`}>
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── GRID VIEW ─── */}
        {viewMode === 'grid' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedVehicles.map((vehicle, idx) => (
                <div key={vehicle.id}
                  className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group`}
                  style={{ animation: animateCards ? `fadeInUp 0.5s ease-out ${idx * 0.1}s both` : 'none' }}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img src={vehicle.image || '/placeholder.svg'} alt={vehicle.marque} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getStatutColor(vehicle.statut)}`}>{vehicle.statut}</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{vehicle.immatriculation}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>{vehicle.categorie}</span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>{vehicle.marque} {vehicle.modele} · {vehicle.annee}</p>
                    <div className={`flex items-center justify-between text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-4`}>
                      <span><i className="bi bi-speedometer2 mr-1"></i>{vehicle.kilometrage.toLocaleString()} km</span>
                      <span><i className="bi bi-person mr-1"></i>{vehicle.chauffeur || 'Non assigné'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openDetailModal(vehicle)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                        <i className="bi bi-eye"></i> Détails
                      </button>
                      <button onClick={() => openEditModal(vehicle)}
                        className="py-2 px-3 rounded-lg text-sm font-medium text-white shadow-sm hover:opacity-90 transition-all"
                        style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` }}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button onClick={() => openDeleteConfirm(vehicle)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium ${darkMode ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-600 hover:bg-red-100'} transition-colors`}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border text-sm ${darkMode ? 'border-gray-700 text-gray-400 hover:bg-gray-800 disabled:opacity-40' : 'border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40'} transition-colors`}>
                  Précédent
                </button>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Page {currentPage} sur {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg border text-sm ${darkMode ? 'border-gray-700 text-gray-400 hover:bg-gray-800 disabled:opacity-40' : 'border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40'} transition-colors`}>
                  Suivant
                </button>
              </div>
            )}
          </>
        )}

        {/* ─── FOOTER — même que Dashboard ─── */}
        <div className={`mt-8 py-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center justify-center">
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>© 2026 SGS Tous droits reservés - Version 1.0</p>
          </div>
        </div>
      </main>

      {/* ============================================================ */}
      {/* MODAL — AJOUTER                                               */}
      {/* ============================================================ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl`}>
            <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-between sticky top-0 ${darkMode ? 'bg-gray-900' : 'bg-white'} z-10`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Ajouter un véhicule</h2>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} transition-colors`}>
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Immatriculation *', key: 'immatriculation', type: 'text', placeholder: 'AB-1234-GA' },
                  { label: 'Année', key: 'annee', type: 'number' },
                  { label: 'Kilométrage', key: 'kilometrage', type: 'number' },
                  { label: 'Puissance', key: 'puissance', type: 'text', placeholder: 'Ex: 150 CV' },
                  { label: 'Couleur', key: 'couleur', type: 'text', placeholder: 'Ex: Blanc' },
                  { label: "Date d'achat", key: 'dateAchat', type: 'date' },
                  { label: "Prix d'achat (CFA)", key: 'prixAchat', type: 'number' },
                  { label: 'Expiration assurance', key: 'assuranceExpire', type: 'date' },
                  { label: 'Expiration visite technique', key: 'visiteExpire', type: 'date' }
                ].map((field) => (
                  <div key={field.key}>
                    <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{field.label}</label>
                    <input type={field.type} value={formData[field.key] || ''} placeholder={field.placeholder}
                      onChange={(e) => setFormData({ ...formData, [field.key]: field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value })}
                      className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }} />
                  </div>
                ))}

                {/* Selects */}
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Catégorie *</label>
                  <select value={formData.categorie} onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                    <option value="">Sélectionner</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Marque *</label>
                  <select value={formData.marque} onChange={(e) => setFormData({ ...formData, marque: e.target.value, modele: '' })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                    <option value="">Sélectionner</option>
                    {marques.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Modèle *</label>
                  <select value={formData.modele} onChange={(e) => setFormData({ ...formData, modele: e.target.value })} disabled={!formData.marque}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 disabled:opacity-50`} style={{ '--tw-ring-color': theme.primary }}>
                    <option value="">Sélectionner</option>
                    {formAvailableModeles.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Direction *</label>
                  <select value={formData.direction} onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                    <option value="">Sélectionner</option>
                    {directions.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Carburant</label>
                  <select value={formData.carburant} onChange={(e) => setFormData({ ...formData, carburant: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                    <option value="Diesel">Diesel</option>
                    <option value="Essence">Essence</option>
                    <option value="Hybride">Hybride</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>URL de l'image</label>
                  <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..."
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }} />
                </div>
              </div>
            </div>
            <div className={`p-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-end gap-3 sticky bottom-0 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className={`px-5 py-2.5 rounded-lg border text-sm ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-100'} transition-colors`}>Annuler</button>
              <button onClick={handleAddVehicle} disabled={!formData.immatriculation || !formData.marque || !formData.modele || !formData.categorie || !formData.direction}
                className="px-5 py-2.5 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 disabled:opacity-50 transition-all"
                style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` }}>
                Ajouter le véhicule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL — MODIFIER                                              */}
      {/* ============================================================ */}
      {showEditModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl`}>
            <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-between sticky top-0 ${darkMode ? 'bg-gray-900' : 'bg-white'} z-10`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Modifier le véhicule</h2>
              <button onClick={() => { setShowEditModal(false); setSelectedVehicle(null); resetForm(); }} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} transition-colors`}>
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Immatriculation *</label>
                  <input type="text" value={formData.immatriculation} onChange={(e) => setFormData({ ...formData, immatriculation: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Catégorie *</label>
                  <select value={formData.categorie} onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Marque *</label>
                  <select value={formData.marque} onChange={(e) => setFormData({ ...formData, marque: e.target.value, modele: '' })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                    {marques.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Modèle *</label>
                  <select value={formData.modele} onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                    {formAvailableModeles.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Kilométrage</label>
                  <input type="number" value={formData.kilometrage} onChange={(e) => setFormData({ ...formData, kilometrage: parseInt(e.target.value) || 0 })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Direction *</label>
                  <select value={formData.direction} onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                    {directions.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Statut</label>
                  <select value={formData.statut} onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                    {statuts.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Chauffeur</label>
                  <input type="text" value={formData.chauffeur || ''} onChange={(e) => setFormData({ ...formData, chauffeur: e.target.value || null })} placeholder="Nom du chauffeur"
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }} />
                </div>
              </div>
            </div>
            <div className={`p-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-end gap-3 sticky bottom-0 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
              <button onClick={() => { setShowEditModal(false); setSelectedVehicle(null); resetForm(); }} className={`px-5 py-2.5 rounded-lg border text-sm ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-100'} transition-colors`}>Annuler</button>
              <button onClick={handleEditVehicle}
                className="px-5 py-2.5 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition-all"
                style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` }}>
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL — DÉTAILS (tabbed)                                      */}
      {/* ============================================================ */}
      {showDetailModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl`}>
            {/* Header détails */}
            <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-between`}>
              <div className="flex items-center gap-4">
                <img src={selectedVehicle.image || '/placeholder.svg'} alt={selectedVehicle.marque} className="w-16 h-16 rounded-xl object-cover shadow-md" />
                <div>
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedVehicle.immatriculation}</h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selectedVehicle.marque} {selectedVehicle.modele} · {selectedVehicle.annee}</p>
                </div>
                <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(selectedVehicle.statut)}`}>{selectedVehicle.statut}</span>
              </div>
              <button onClick={() => setShowDetailModal(false)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} transition-colors`}>
                <i className="bi bi-x-lg text-xl"></i>
              </button>
            </div>

            {/* Tabs — même style gradient actif que sidebar */}
            <div className={`border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} px-6 flex gap-1 overflow-x-auto`}>
              {[
                { key: 'general', label: 'Général', icon: 'bi-info-circle' },
                { key: 'documents', label: 'Documents', icon: 'bi-file-earmark-text' },
                { key: 'maintenance', label: 'Maintenance', icon: 'bi-tools' },
                { key: 'missions', label: 'Missions', icon: 'bi-geo-alt' },
                { key: 'carburant', label: 'Carburant', icon: 'bi-fuel-pump' },
                { key: 'statistiques', label: 'Statistiques', icon: 'bi-bar-chart' }
              ].map(tab => (
                <button key={tab.key} onClick={() => setDetailTab(tab.key)}
                  className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                    detailTab === tab.key
                      ? 'border-transparent text-white'
                      : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`
                  }`}
                  style={detailTab === tab.key ? { background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`, borderRadius: '8px 8px 0 0' } : {}}>
                  <i className={tab.icon}></i>{tab.label}
                </button>
              ))}
            </div>

            {/* Content scrollable */}
            <div className="flex-1 overflow-y-auto p-6">

              {/* ── Général ── */}
              {detailTab === 'general' && (
                <div className="grid grid-cols-3 gap-5">
                  {[
                    { title: 'Informations véhicule', icon: 'bi-car-front', iconColor: 'text-blue-500', bg: darkMode ? 'bg-gray-800' : 'bg-blue-50', fields: [
                      ['Immatriculation', selectedVehicle.immatriculation], ['Marque', selectedVehicle.marque], ['Modèle', selectedVehicle.modele],
                      ['Catégorie', selectedVehicle.categorie], ['Année', selectedVehicle.annee], ['Couleur', selectedVehicle.couleur],
                      ['Carburant', selectedVehicle.carburant], ['Puissance', selectedVehicle.puissance], ['Kilométrage', `${selectedVehicle.kilometrage.toLocaleString()} km`]
                    ]},
                    { title: 'Informations financières', icon: 'bi-currency-dollar', iconColor: 'text-green-500', bg: darkMode ? 'bg-gray-800' : 'bg-green-50', fields: [
                      ["Date d'achat", selectedVehicle.dateAchat ? new Date(selectedVehicle.dateAchat).toLocaleDateString('fr-FR') : '—'],
                      ["Prix d'achat", selectedVehicle.prixAchat ? `${selectedVehicle.prixAchat.toLocaleString()} CFA` : '—']
                    ]},
                    { title: 'Affectation', icon: 'bi-people', iconColor: 'text-purple-500', bg: darkMode ? 'bg-gray-800' : 'bg-purple-50', fields: [
                      ['Direction', selectedVehicle.direction], ['Chauffeur', selectedVehicle.chauffeur || 'Non assigné'], ['Statut', selectedVehicle.statut]
                    ]}
                  ].map((card, ci) => (
                    <div key={ci} className={`${card.bg} rounded-xl p-5`}>
                      <h3 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <i className={`${card.icon} ${card.iconColor}`}></i>{card.title}
                      </h3>
                      <div className="space-y-2.5">
                        {card.fields.map(([label, value], fi) => (
                          <div key={fi} className="flex justify-between">
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
                            <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Échéances */}
                  <div className={`col-span-3 ${darkMode ? 'bg-gray-800' : 'bg-orange-50'} rounded-xl p-5`}>
                    <h3 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <i className="bi bi-calendar-event text-orange-500"></i>Échéances importantes
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Assurance', value: selectedVehicle.assuranceExpire ? new Date(selectedVehicle.assuranceExpire).toLocaleDateString('fr-FR') : '—', icon: 'bi-shield-check' },
                        { label: 'Visite technique', value: selectedVehicle.visiteExpire ? new Date(selectedVehicle.visiteExpire).toLocaleDateString('fr-FR') : '—', icon: 'bi-clipboard-check' }
                      ].map((item, i) => (
                        <div key={i} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</p>
                              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.value}</p>
                            </div>
                            <i className={`${item.icon} text-2xl text-orange-500`}></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Documents ── */}
              {detailTab === 'documents' && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Documents du véhicule</h3>
                    <button className="px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition-all" style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` }}>
                      <i className="bi bi-plus-lg mr-1"></i>Ajouter
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {(vehicleDocuments[selectedVehicle.id] || []).map(doc => (
                      <div key={doc.id} className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4 flex items-center justify-between border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-white shadow-sm'}`}>
                            <i className="bi bi-file-earmark-text text-xl text-blue-500"></i>
                          </div>
                          <div>
                            <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{doc.nom}</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Expire : {new Date(doc.dateExpiration).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${doc.statut === 'Valide' ? 'bg-green-100 text-green-700' : doc.statut === 'Expire bientôt' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>{doc.statut}</span>
                      </div>
                    ))}
                    {(!vehicleDocuments[selectedVehicle.id] || vehicleDocuments[selectedVehicle.id].length === 0) && (
                      <div className="col-span-2 text-center py-12">
                        <i className={`bi bi-file-earmark-x text-5xl ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}></i>
                        <p className={`mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aucun document enregistré</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Maintenance ── */}
              {detailTab === 'maintenance' && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Historique de maintenance</h3>
                    <button className="px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition-all" style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` }}>
                      <i className="bi bi-plus-lg mr-1"></i>Ajouter
                    </button>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'} rounded-xl border overflow-hidden`}>
                    <table className="w-full">
                      <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                        <tr>
                          {['Type', 'Date', 'Kilométrage', 'Coût', 'Statut'].map(h => (
                            <th key={h} className={`px-5 py-3 text-left text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                        {(vehicleMaintenances[selectedVehicle.id] || []).map(m => (
                          <tr key={m.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                            <td className={`px-5 py-3.5 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{m.type}</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{new Date(m.date).toLocaleDateString('fr-FR')}</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{m.kilometrage.toLocaleString()} km</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{m.cout.toLocaleString()} CFA</td>
                            <td className="px-5 py-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${m.statut === 'Effectuée' ? 'bg-green-100 text-green-700' : m.statut === 'Planifiée' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{m.statut}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {(!vehicleMaintenances[selectedVehicle.id] || vehicleMaintenances[selectedVehicle.id].length === 0) && (
                      <div className="text-center py-12">
                        <i className={`bi bi-tools text-5xl ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}></i>
                        <p className={`mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aucune maintenance enregistrée</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Missions ── */}
              {detailTab === 'missions' && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Historique des missions</h3>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'} rounded-xl border overflow-hidden`}>
                    <table className="w-full">
                      <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                        <tr>
                          {['Destination', 'Départ', 'Retour', 'Chauffeur', 'KM', 'Statut'].map(h => (
                            <th key={h} className={`px-5 py-3 text-left text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                        {(vehicleMissions[selectedVehicle.id] || []).map(m => (
                          <tr key={m.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                            <td className={`px-5 py-3.5 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{m.destination}</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{new Date(m.dateDepart).toLocaleDateString('fr-FR')}</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{new Date(m.dateRetour).toLocaleDateString('fr-FR')}</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{m.chauffeur}</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{m.kilometrage > 0 ? `${m.kilometrage.toLocaleString()} km` : '—'}</td>
                            <td className="px-5 py-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${m.statut === 'Terminée' ? 'bg-green-100 text-green-700' : m.statut === 'En cours' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{m.statut}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {(!vehicleMissions[selectedVehicle.id] || vehicleMissions[selectedVehicle.id].length === 0) && (
                      <div className="text-center py-12">
                        <i className={`bi bi-geo-alt text-5xl ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}></i>
                        <p className={`mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aucune mission enregistrée</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Carburant ── */}
              {detailTab === 'carburant' && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Historique carburant</h3>
                    <button className="px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition-all" style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` }}>
                      <i className="bi bi-plus-lg mr-1"></i>Ajouter
                    </button>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'} rounded-xl border overflow-hidden`}>
                    <table className="w-full">
                      <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                        <tr>
                          {['Date', 'Litres', 'Montant', 'Kilométrage', 'Station'].map(h => (
                            <th key={h} className={`px-5 py-3 text-left text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                        {(vehicleCarburant[selectedVehicle.id] || []).map(c => (
                          <tr key={c.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                            <td className={`px-5 py-3.5 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{new Date(c.date).toLocaleDateString('fr-FR')}</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{c.litres} L</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{c.montant.toLocaleString()} CFA</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{c.kilometrage.toLocaleString()} km</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{c.station}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {(!vehicleCarburant[selectedVehicle.id] || vehicleCarburant[selectedVehicle.id].length === 0) && (
                      <div className="text-center py-12">
                        <i className={`bi bi-fuel-pump text-5xl ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}></i>
                        <p className={`mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aucun plein enregistré</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Statistiques ── */}
              {detailTab === 'statistiques' && (() => {
                const stats = getVehicleStats(selectedVehicle.id);
                const statCards = [
                  { label: 'Total missions', value: stats.totalMissions, icon: 'bi-geo-alt-fill', iconColor: 'text-blue-500', iconBg: 'bg-blue-500/20', bg: darkMode ? 'bg-gray-800' : 'bg-blue-50' },
                  { label: 'KM parcourus', value: stats.totalKmMissions.toLocaleString(), icon: 'bi-speedometer2', iconColor: 'text-green-500', iconBg: 'bg-green-500/20', bg: darkMode ? 'bg-gray-800' : 'bg-green-50' },
                  { label: 'Carburant total', value: `${stats.totalCarburant} L`, icon: 'bi-fuel-pump-fill', iconColor: 'text-yellow-500', iconBg: 'bg-yellow-500/20', bg: darkMode ? 'bg-gray-800' : 'bg-yellow-50' },
                  { label: 'Consommation moy.', value: `${stats.consommationMoyenne} L/100`, icon: 'bi-graph-up', iconColor: 'text-purple-500', iconBg: 'bg-purple-500/20', bg: darkMode ? 'bg-gray-800' : 'bg-purple-50' },
                  { label: 'Coût maintenance', value: `${stats.totalMaintenance.toLocaleString()} CFA`, icon: 'bi-tools', iconColor: 'text-orange-500', iconBg: 'bg-orange-500/20', bg: darkMode ? 'bg-gray-800' : 'bg-orange-50', span: 2 },
                  { label: 'Coût total (carb. + maint.)', value: `${stats.coutTotal.toLocaleString()} CFA`, icon: 'bi-cash-stack', iconColor: 'text-red-500', iconBg: 'bg-red-500/20', bg: darkMode ? 'bg-gray-800' : 'bg-red-50', span: 2 }
                ];
                return (
                  <div>
                    <h3 className={`font-semibold mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Statistiques du véhicule</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {statCards.map((card, i) => (
                        <div key={i} className={`${card.bg} rounded-xl p-5 ${card.span === 2 ? 'col-span-2' : ''}`} style={{ animation: animateCards ? `fadeInUp 0.4s ease-out ${i * 0.1}s both` : 'none' }}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{card.label}</p>
                              <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{card.value}</p>
                            </div>
                            <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                              <i className={`${card.icon} ${card.iconColor} text-xl`}></i>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Footer modal */}
            <div className={`p-5 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-end gap-3`}>
              <button onClick={() => { setShowDetailModal(false); openEditModal(selectedVehicle); }}
                className={`px-5 py-2.5 rounded-lg border text-sm ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-100'} transition-colors flex items-center gap-2`}>
                <i className="bi bi-pencil"></i>Modifier
              </button>
              <button onClick={() => setShowDetailModal(false)}
                className="px-5 py-2.5 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition-all"
                style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` }}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL — CONFIRMATION SUPPRESSION                             */}
      {/* ============================================================ */}
      {showDeleteConfirm && vehicleToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl w-full max-w-md p-8 shadow-2xl`}>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-exclamation-triangle-fill text-red-500 text-3xl"></i>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Confirmer la suppression</h3>
              <p className={`mb-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Êtes-vous sûr de vouloir supprimer le véhicule <strong className={darkMode ? 'text-white' : 'text-gray-900'}>{vehicleToDelete.immatriculation}</strong> ({vehicleToDelete.marque} {vehicleToDelete.modele}) ? Cette action est irréversible.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => { setShowDeleteConfirm(false); setVehicleToDelete(null); }}
                  className={`px-5 py-2.5 rounded-lg border text-sm ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-100'} transition-colors`}>
                  Annuler
                </button>
                <button onClick={handleDeleteVehicle}
                  className="px-5 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2 shadow-sm">
                  <i className="bi bi-trash"></i>Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicules;