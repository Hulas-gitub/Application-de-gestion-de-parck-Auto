import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

// ============================================================================
// IMPORTS DES COMPOSANTS SÉPARÉS - SIDEBAR ET HEADER
// ============================================================================
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
// ============================================================================

const FournisseursOutils = () => {
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
  const { theme } = useTheme();
  const navigate = useNavigate();

  // ============================================================================
  // ÉTATS POUR LES FILTRES ET MODALS
  // ============================================================================
  const [activeFilter, setActiveFilter] = useState('fournisseurs'); // fournisseurs, outils, pieces
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create, edit
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  // ============================================================================
  // PAGINATION
  // ============================================================================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ============================================================================
  // DONNÉES FACTICES (À REMPLACER PAR APPELS API)
  // ============================================================================
  
  // Fournisseurs
  const [fournisseurs, setFournisseurs] = useState([
    { 
      id: 1, 
      nom: 'AutoPièces Pro', 
      contact: 'Jean Martin', 
      telephone: '+241 01 23 45 67', 
      email: 'contact@autopieces.ga',
      type: 'pieces',
      adresse: 'Zone Industrielle Owendo, Libreville',
      est_actif: true 
    },
    { 
      id: 2, 
      nom: 'Garage Central', 
      contact: 'Marie Dupont', 
      telephone: '+241 07 89 01 23', 
      email: 'info@garagecentral.ga',
      type: 'pieces',
      adresse: 'Boulevard Triomphal, Libreville',
      est_actif: true 
    },
    { 
      id: 3, 
      nom: 'Total Gabon', 
      contact: 'Service Commercial', 
      telephone: '+241 01 76 54 32', 
      email: 'commercial@total.ga',
      type: 'carburant',
      adresse: 'Avenue Bouet, Libreville',
      est_actif: true 
    },
  ]);

  // Outils
  const [outils, setOutils] = useState([
    { 
      id: 1, 
      nom: 'Clé dynamométrique 200Nm', 
      type: 'Clé spéciale', 
      categorie: 'Outillage mécanique',
      etat: 'OK',
      emplacement: 'Atelier principal - Armoire A2',
      date_dernier_controle: '2026-01-15',
      notes: 'Calibration à jour'
    },
    { 
      id: 2, 
      nom: 'Pont élévateur 4 colonnes', 
      type: 'Équipement lourd', 
      categorie: 'Levage',
      etat: 'OK',
      emplacement: 'Atelier principal - Zone 1',
      date_dernier_controle: '2025-12-10',
      notes: 'Contrôle annuel effectué'
    },
    { 
      id: 3, 
      nom: 'Valise diagnostic OBD2', 
      type: 'Électronique', 
      categorie: 'Diagnostic',
      etat: 'Maintenance',
      emplacement: 'Atelier électrique',
      date_dernier_controle: '2026-02-01',
      notes: 'Mise à jour logicielle en cours'
    },
  ]);

  // Pièces détachées
  const [pieces, setPieces] = useState([
    { 
      id: 1, 
      sku: 'FLT-001', 
      nom: 'Filtre à huile standard', 
      type_piece: 'Filtre',
      description: 'Filtre à huile compatible Toyota, Nissan',
      quantite_stock: 45,
      seuil_alerte: 20,
      unite: 'unité',
      prix_unitaire: 8500,
      fournisseur_id: 1,
      emplacement: 'Magasin - Rayon B3',
      est_actif: true
    },
    { 
      id: 2, 
      sku: 'PLQ-002', 
      nom: 'Plaquettes de frein avant', 
      type_piece: 'Freinage',
      description: 'Jeu de plaquettes avant premium',
      quantite_stock: 12,
      seuil_alerte: 15,
      unite: 'jeu',
      prix_unitaire: 35000,
      fournisseur_id: 1,
      emplacement: 'Magasin - Rayon A1',
      est_actif: true
    },
    { 
      id: 3, 
      sku: 'HUI-003', 
      nom: 'Huile moteur 5W30 synthétique', 
      type_piece: 'Lubrifiant',
      description: 'Huile moteur synthétique 5 litres',
      quantite_stock: 5,
      seuil_alerte: 10,
      unite: 'bidon',
      prix_unitaire: 28000,
      fournisseur_id: 3,
      emplacement: 'Magasin - Zone huiles',
      est_actif: true
    },
  ]);

  // ============================================================================
  // FORM DATA STATE
  // ============================================================================
  const [formData, setFormData] = useState({
    // Fournisseur
    nom: '',
    contact: '',
    telephone: '',
    email: '',
    type: 'pieces',
    adresse: '',
    est_actif: true,
    
    // Outil
    categorie: '',
    etat: 'OK',
    emplacement: '',
    date_dernier_controle: '',
    notes: '',
    
    // Pièce
    sku: '',
    type_piece: '',
    description: '',
    quantite_stock: 0,
    seuil_alerte: 0,
    unite: 'unité',
    prix_unitaire: 0,
    fournisseur_id: '',
  });

  // ============================================================================
  // GESTION DU MENU DÉROULANT
  // ============================================================================
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !event.target.closest('.action-menu')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  // ============================================================================
  // FONCTIONS CRUD
  // ============================================================================
  
  const handleOpenModal = (mode, item = null) => {
    setModalMode(mode);
    setSelectedItem(item);
    setOpenMenuId(null);
    
    if (mode === 'edit' && item) {
      setFormData({
        nom: item.nom || '',
        contact: item.contact || '',
        telephone: item.telephone || '',
        email: item.email || '',
        type: item.type || 'pieces',
        adresse: item.adresse || '',
        est_actif: item.est_actif !== undefined ? item.est_actif : true,
        
        categorie: item.categorie || '',
        etat: item.etat || 'OK',
        emplacement: item.emplacement || '',
        date_dernier_controle: item.date_dernier_controle || '',
        notes: item.notes || '',
        
        sku: item.sku || '',
        type_piece: item.type_piece || '',
        description: item.description || '',
        quantite_stock: item.quantite_stock || 0,
        seuil_alerte: item.seuil_alerte || 0,
        unite: item.unite || 'unité',
        prix_unitaire: item.prix_unitaire || 0,
        fournisseur_id: item.fournisseur_id || '',
      });
    } else {
      // Reset form
      setFormData({
        nom: '',
        contact: '',
        telephone: '',
        email: '',
        type: 'pieces',
        adresse: '',
        est_actif: true,
        
        categorie: '',
        etat: 'OK',
        emplacement: '',
        date_dernier_controle: '',
        notes: '',
        
        sku: '',
        type_piece: '',
        description: '',
        quantite_stock: 0,
        seuil_alerte: 0,
        unite: 'unité',
        prix_unitaire: 0,
        fournisseur_id: '',
      });
    }
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setFormData({
      nom: '',
      contact: '',
      telephone: '',
      email: '',
      type: 'pieces',
      adresse: '',
      est_actif: true,
      
      categorie: '',
      etat: 'OK',
      emplacement: '',
      date_dernier_controle: '',
      notes: '',
      
      sku: '',
      type_piece: '',
      description: '',
      quantite_stock: 0,
      seuil_alerte: 0,
      unite: 'unité',
      prix_unitaire: 0,
      fournisseur_id: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalMode === 'create') {
      const newItem = {
        id: Date.now(),
        ...formData
      };
      
      switch (activeFilter) {
        case 'fournisseurs':
          setFournisseurs([...fournisseurs, newItem]);
          break;
        case 'outils':
          setOutils([...outils, newItem]);
          break;
        case 'pieces':
          setPieces([...pieces, newItem]);
          break;
        default:
          break;
      }
    } else if (modalMode === 'edit' && selectedItem) {
      switch (activeFilter) {
        case 'fournisseurs':
          setFournisseurs(fournisseurs.map(item => 
            item.id === selectedItem.id ? { ...item, ...formData } : item
          ));
          break;
        case 'outils':
          setOutils(outils.map(item => 
            item.id === selectedItem.id ? { ...item, ...formData } : item
          ));
          break;
        case 'pieces':
          setPieces(pieces.map(item => 
            item.id === selectedItem.id ? { ...item, ...formData } : item
          ));
          break;
        default:
          break;
      }
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      setOpenMenuId(null);
      
      switch (activeFilter) {
        case 'fournisseurs':
          setFournisseurs(fournisseurs.filter(item => item.id !== id));
          break;
        case 'outils':
          setOutils(outils.filter(item => item.id !== id));
          break;
        case 'pieces':
          setPieces(pieces.filter(item => item.id !== id));
          break;
        default:
          break;
      }
    }
  };

  const handleToggleStatus = (id) => {
    setOpenMenuId(null);
    
    switch (activeFilter) {
      case 'fournisseurs':
        setFournisseurs(fournisseurs.map(item => 
          item.id === id ? { ...item, est_actif: !item.est_actif } : item
        ));
        break;
      case 'pieces':
        setPieces(pieces.map(item => 
          item.id === id ? { ...item, est_actif: !item.est_actif } : item
        ));
        break;
      default:
        break;
    }
  };

  // ============================================================================
  // FILTRAGE ET PAGINATION DES DONNÉES
  // ============================================================================
  const getFilteredData = () => {
    let data = [];
    switch (activeFilter) {
      case 'fournisseurs':
        data = fournisseurs;
        break;
      case 'outils':
        data = outils;
        break;
      case 'pieces':
        data = pieces;
        break;
      default:
        data = [];
    }

    if (searchTerm) {
      return data.filter(item => 
        (item.nom && item.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.type && item.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.contact && item.contact.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return data;
  };

  const filteredData = getFilteredData();
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchTerm]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // ============================================================================
  // FONCTION POUR DÉTERMINER L'ÉTAT DU STOCK
  // ============================================================================
  const getStockStatus = (quantite, seuil) => {
    const pourcentage = (quantite / seuil) * 100;
    
    if (quantite === 0) {
      return { 
        label: 'Épuisé', 
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        icon: 'bi-arrow-down-circle-fill text-red-500',
        badge: 'bg-red-500'
      };
    } else if (quantite <= seuil) {
      return { 
        label: 'Stock faible', 
        color: 'bg-orange-100 text-orange-700 dark:bg-orange-5000/30 dark:text-orange-800',
        icon: 'bi-exclamation-triangle-fill text-orange-500',
        badge: 'bg-orange-500'
      };
    } else if (pourcentage <= 150) {
      return { 
        label: 'Stock moyen', 
        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        icon: 'bi-arrow-right-circle-fill text-yellow-500',
        badge: 'bg-yellow-500'
      };
    } else {
      return { 
        label: 'Stock élevé', 
        color: 'bg-green-100 text-green-700 dark:bg-green-5000/30 dark:text-green-800',
        icon: 'bi-arrow-up-circle-fill text-green-500',
        badge: 'bg-green-500'
      };
    }
  };

  // ============================================================================
  // STATISTIQUES PAR TYPE
  // ============================================================================
  const getStats = () => {
    switch (activeFilter) {
      case 'fournisseurs':
        return {
          total: fournisseurs.length,
          actifs: fournisseurs.filter(f => f.est_actif).length,
          pieces: fournisseurs.filter(f => f.type === 'pieces').length,
        };
      case 'outils':
        return {
          total: outils.length,
          ok: outils.filter(o => o.etat === 'OK').length,
          maintenance: outils.filter(o => o.etat === 'Maintenance').length,
        };
      case 'pieces':
        const stockFaible = pieces.filter(p => p.quantite_stock <= p.seuil_alerte && p.quantite_stock > 0).length;
        const epuise = pieces.filter(p => p.quantite_stock === 0).length;
        return {
          total: pieces.length,
          stockFaible: stockFaible,
          epuise: epuise,
        };
      default:
        return { total: 0, actifs: 0, pieces: 0 };
    }
  };

  const stats = getStats();

  // ============================================================================
  // RENDER MODAL FORM FIELDS
  // ============================================================================
  const renderFormFields = () => {
    switch (activeFilter) {
      case 'fournisseurs':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Ex: AutoPièces Pro"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Contact
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Nom du contact"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="+241 XX XX XX XX"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="email@exemple.com"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="pieces">Pièces détachées</option>
                <option value="carburant">Carburant</option>
                <option value="assurance">Assurance</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Adresse
              </label>
              <textarea
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                rows="3"
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Adresse complète du fournisseur"
              />
            </div>
          </>
        );

      case 'outils':
        return (
          <>
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Ex: Clé dynamométrique 200Nm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Type
                </label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Ex: Clé spéciale"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Catégorie
                </label>
                <select
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="Outillage mécanique">Outillage mécanique</option>
                  <option value="Levage">Levage</option>
                  <option value="Diagnostic">Diagnostic</option>
                  <option value="Électrique">Électrique</option>
                  <option value="Pneumatique">Pneumatique</option>
                  <option value="Carrosserie">Carrosserie</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  État <span className="text-red-500">*</span>
                </label>
                <select
                  name="etat"
                  value={formData.etat}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="OK">OK</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Hors service">Hors service</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Date dernier contrôle
                </label>
                <input
                  type="date"
                  name="date_dernier_controle"
                  value={formData.date_dernier_controle}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Emplacement
              </label>
              <input
                type="text"
                name="emplacement"
                value={formData.emplacement}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Ex: Atelier principal - Armoire A2"
              />
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Notes et observations"
              />
            </div>
          </>
        );

      case 'pieces':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  SKU / Référence
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Ex: FLT-001"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Ex: Filtre à huile standard"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Type de pièce
              </label>
              <select
                name="type_piece"
                value={formData.type_piece}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Sélectionner un type</option>
                <option value="Filtre">Filtre</option>
                <option value="Freinage">Freinage</option>
                <option value="Lubrifiant">Lubrifiant</option>
                <option value="Pneumatique">Pneumatique</option>
                <option value="Électrique">Électrique</option>
                <option value="Carrosserie">Carrosserie</option>
                <option value="Moteur">Moteur</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="2"
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Description de la pièce"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Quantité en stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantite_stock"
                  value={formData.quantite_stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="0"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Seuil d'alerte <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="seuil_alerte"
                  value={formData.seuil_alerte}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="0"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Unité
                </label>
                <select
                  name="unite"
                  value={formData.unite}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="unité">Unité</option>
                  <option value="jeu">Jeu</option>
                  <option value="bidon">Bidon</option>
                  <option value="litre">Litre</option>
                  <option value="kg">Kilogramme</option>
                  <option value="mètre">Mètre</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Prix unitaire (FCFA) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="prix_unitaire"
                  value={formData.prix_unitaire}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="0"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Fournisseur
                </label>
                <select
                  name="fournisseur_id"
                  value={formData.fournisseur_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Sélectionner un fournisseur</option>
                  {fournisseurs.filter(f => f.est_actif).map(fournisseur => (
                    <option key={fournisseur.id} value={fournisseur.id}>
                      {fournisseur.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Emplacement
              </label>
              <input
                type="text"
                name="emplacement"
                value={formData.emplacement}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Ex: Magasin - Rayon B3"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  // ============================================================================
  // RENDER TABLE
  // ============================================================================
  const renderTable = () => {
    if (currentItems.length === 0) {
      return (
        <tr>
          <td colSpan="8" className="px-6 py-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <i className={`bi bi-inbox text-5xl mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}></i>
              <p className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Aucun élément trouvé
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {searchTerm ? 'Essayez une autre recherche' : 'Commencez par créer un nouvel élément'}
              </p>
            </div>
          </td>
        </tr>
      );
    }

    return currentItems.map((item) => {
      switch (activeFilter) {
        case 'fournisseurs':
          return (
            <tr key={item.id} className={`${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors`}>
              <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2">
                  <i className="bi bi-building text-blue-500"></i>
                  <span className="font-medium">{item.nom}</span>
                </div>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {item.contact || '-'}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {item.telephone || '-'}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {item.email || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.type === 'pieces' ? 'bg-purple-100 text-purple-700 dark:bg-purple-5000/30 dark:text-purple-800' :
                  item.type === 'carburant' ? 'bg-orange-100 text-orange-700 dark:bg-orange-5000/30 dark:text-orange-800' :
                  item.type === 'assurance' ? 'bg-blue-100 text-blue-700 dark:bg-blue-5000/30 dark:text-blue-800' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {item.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.est_actif
                    ? 'bg-green-100 text-green-700 dark:bg-green-5000/30 dark:text-green-800'
                    : 'bg-red-100 text-red-700 dark:bg-red-5000/30 dark:text-red-800'
                }`}>
                  {item.est_actif ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="relative action-menu inline-block">
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
                    title="Actions"
                  >
                    <i className="bi bi-three-dots-vertical"></i>
                  </button>
                  
                  {openMenuId === item.id && (
                    <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10 ${
                      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}>
                      <div className="py-1">
                        <button
                          onClick={() => handleOpenModal('edit', item)}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                          } flex items-center gap-2`}
                        >
                          <i className="bi bi-pencil-square text-blue-500"></i>
                          Modifier
                        </button>
                        <button
                          onClick={() => handleToggleStatus(item.id)}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                          } flex items-center gap-2`}
                        >
                          <i className={`bi ${item.est_actif ? 'bi-toggle-on text-green-500' : 'bi-toggle-off text-gray-500'}`}></i>
                          {item.est_actif ? 'Désactiver' : 'Activer'}
                        </button>
                        <hr className={`my-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                        <button
                          onClick={() => handleDelete(item.id)}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'
                          } flex items-center gap-2`}
                        >
                          <i className="bi bi-trash3"></i>
                          Supprimer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          );

        case 'outils':
          return (
            <tr key={item.id} className={`${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors`}>
              <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2">
                  <i className="bi bi-tools text-orange-500"></i>
                  <span className="font-medium">{item.nom}</span>
                </div>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {item.type || '-'}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {item.categorie || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.etat === 'OK' ? 'bg-green-100 text-green-700 dark:bg-green-5000/30 dark:text-green-800' :
                  item.etat === 'Maintenance' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-5000/30 dark:text-yellow-800' :
                  'bg-red-100 text-red-700 dark:bg-red-5000/30 dark:text-red-800'
                }`}>
                  {item.etat}
                </span>
              </td>
              <td className={`px-6 py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="max-w-xs truncate">{item.emplacement || '-'}</div>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {item.date_dernier_controle || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="relative action-menu inline-block">
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
                    title="Actions"
                  >
                    <i className="bi bi-three-dots-vertical"></i>
                  </button>
                  
                  {openMenuId === item.id && (
                    <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10 ${
                      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}>
                      <div className="py-1">
                        <button
                          onClick={() => handleOpenModal('edit', item)}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                          } flex items-center gap-2`}
                        >
                          <i className="bi bi-pencil-square text-blue-500"></i>
                          Modifier
                        </button>
                        <hr className={`my-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                        <button
                          onClick={() => handleDelete(item.id)}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'
                          } flex items-center gap-2`}
                        >
                          <i className="bi bi-trash3"></i>
                          Supprimer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          );

        case 'pieces':
          const fournisseur = fournisseurs.find(f => f.id === item.fournisseur_id);
          const stockStatus = getStockStatus(item.quantite_stock, item.seuil_alerte);
          
          return (
            <tr key={item.id} className={`${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors`}>
              <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2">
                  <i className="bi bi-box-seam text-green-500"></i>
                  <div>
                    <div className="font-medium">{item.nom}</div>
                    {item.sku && (
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        SKU: {item.sku}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {item.type_piece || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <i className={`${stockStatus.icon}`}></i>
                  <div>
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.quantite_stock} {item.unite}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Seuil: {item.seuil_alerte}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {item.prix_unitaire.toLocaleString()} FCFA
              </td>
              <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {fournisseur ? fournisseur.nom : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.est_actif
                    ? 'bg-green-100 text-green-700 dark:bg-green-5000/30 dark:text-green-800'
                    : 'bg-red-100 text-red-700 dark:bg-red-5000/30 dark:text-red-800'
                }`}>
                  {item.est_actif ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="relative action-menu inline-block">
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
                    title="Actions"
                  >
                    <i className="bi bi-three-dots-vertical"></i>
                  </button>
                  
                  {openMenuId === item.id && (
                    <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10 ${
                      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}>
                      <div className="py-1">
                        <button
                          onClick={() => handleOpenModal('edit', item)}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                          } flex items-center gap-2`}
                        >
                          <i className="bi bi-pencil-square text-blue-500"></i>
                          Modifier
                        </button>
                        <button
                          onClick={() => handleToggleStatus(item.id)}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                          } flex items-center gap-2`}
                        >
                          <i className={`bi ${item.est_actif ? 'bi-toggle-on text-green-500' : 'bi-toggle-off text-gray-500'}`}></i>
                          {item.est_actif ? 'Désactiver' : 'Activer'}
                        </button>
                        <hr className={`my-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                        <button
                          onClick={() => handleDelete(item.id)}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'
                          } flex items-center gap-2`}
                        >
                          <i className="bi bi-trash3"></i>
                          Supprimer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          );

        default:
          return null;
      }
    });
  };

  // ============================================================================
  // RENDER PAGINATION
  // ============================================================================
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-4">
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredData.length)} sur {filteredData.length} résultats
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-lg ${
              currentPage === 1
                ? `${darkMode ? 'bg-gray-800 text-gray-600' : 'bg-gray-100 text-gray-400'} cursor-not-allowed`
                : `${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`
            } transition-colors`}
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className={`px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-300'} transition-colors`}
              >
                1
              </button>
              {startPage > 2 && <span className={darkMode ? 'text-gray-600' : 'text-gray-400'}>...</span>}
            </>
          )}

          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPage === number
                  ? 'text-white shadow-md'
                  : `${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`
              }`}
              style={currentPage === number ? {
                background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
              } : {}}
            >
              {number}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className={darkMode ? 'text-gray-600' : 'text-gray-400'}>...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className={`px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-300'} transition-colors`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-lg ${
              currentPage === totalPages
                ? `${darkMode ? 'bg-gray-800 text-gray-600' : 'bg-gray-100 text-gray-400'} cursor-not-allowed`
                : `${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`
            } transition-colors`}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`${darkMode ? 'bg-gray-950' : 'bg-gray-50'} min-h-screen transition-colors duration-300`}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      
      <Sidebar 
        darkMode={darkMode} 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed}
      />

      <Header 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        sidebarCollapsed={sidebarCollapsed}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
      />

      <main 
        className="transition-all duration-300 pt-24 px-6 pb-6"
        style={{ marginLeft: sidebarCollapsed ? '5rem' : '18rem' }}
      >
        {/* ─── EN-TÊTE ─── */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Gestion Fournisseurs & Inventaire
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Gérez vos fournisseurs, outils et pièces détachées avec alertes de stock
          </p>
        </div>

        {/* ─── STATISTIQUES ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {activeFilter === 'fournisseurs' && (
            <>
              <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl p-6 border shadow-sm`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                      Total Fournisseurs
                    </p>
                    <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stats.total}
                    </h3>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <i className="bi bi-building text-2xl text-blue-600 dark:text-blue-400"></i>
                  </div>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl p-6 border shadow-sm`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                      Fournisseurs Actifs
                    </p>
                    <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stats.actifs}
                    </h3>
                  </div>
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <i className="bi bi-check-circle text-2xl text-green-600 dark:text-green-400"></i>
                  </div>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl p-6 border shadow-sm`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                      Pièces détachées
                    </p>
                    <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stats.pieces}
                    </h3>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                    <i className="bi bi-box-seam text-2xl text-purple-600 dark:text-purple-400"></i>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeFilter === 'outils' && (
            <>
              <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl p-6 border shadow-sm`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                      Total Outils
                    </p>
                    <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stats.total}
                    </h3>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                    <i className="bi bi-tools text-2xl text-orange-600 dark:text-orange-400"></i>
                  </div>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl p-6 border shadow-sm`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                      État OK
                    </p>
                    <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stats.ok}
                    </h3>
                  </div>
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <i className="bi bi-check-circle text-2xl text-green-600 dark:text-green-400"></i>
                  </div>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl p-6 border shadow-sm`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                      En Maintenance
                    </p>
                    <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stats.maintenance}
                    </h3>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                    <i className="bi bi-wrench text-2xl text-yellow-600 dark:text-yellow-400"></i>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeFilter === 'pieces' && (
            <>
              <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl p-6 border shadow-sm`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                      Total Pièces
                    </p>
                    <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stats.total}
                    </h3>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <i className="bi bi-box-seam text-2xl text-blue-600 dark:text-blue-400"></i>
                  </div>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl p-6 border shadow-sm`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                      Stock Faible
                    </p>
                    <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stats.stockFaible}
                    </h3>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                    <i className="bi bi-exclamation-triangle text-2xl text-orange-600 dark:text-orange-400"></i>
                  </div>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl p-6 border shadow-sm`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                      Stock Épuisé
                    </p>
                    <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stats.epuise}
                    </h3>
                  </div>
                  <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                    <i className="bi bi-x-circle text-2xl text-red-600 dark:text-red-400"></i>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ─── FILTRES ET ACTIONS ─── */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl p-6 border shadow-sm mb-6`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filtres */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter('fournisseurs')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeFilter === 'fournisseurs'
                    ? 'text-white shadow-md'
                    : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
                }`}
                style={activeFilter === 'fournisseurs' ? {
                  background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
                } : {}}
              >
                <i className="bi bi-building"></i>
                Fournisseurs
              </button>

              <button
                onClick={() => setActiveFilter('outils')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeFilter === 'outils'
                    ? 'text-white shadow-md'
                    : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
                }`}
                style={activeFilter === 'outils' ? {
                  background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
                } : {}}
              >
                <i className="bi bi-tools"></i>
                Outils
              </button>

              <button
                onClick={() => setActiveFilter('pieces')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeFilter === 'pieces'
                    ? 'text-white shadow-md'
                    : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
                }`}
                style={activeFilter === 'pieces' ? {
                  background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
                } : {}}
              >
                <i className="bi bi-box-seam"></i>
                Pièces détachées
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <div className="relative">
                <i className={`bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}></i>
                <input 
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 w-64`}
                  style={{ '--tw-ring-color': theme.primary }}
                />
              </div>

              <button
                onClick={() => handleOpenModal('create')}
                className="px-4 py-2 rounded-lg text-white font-medium transition-all hover:opacity-90 hover:shadow-md flex items-center gap-2"
                style={{
                  background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
                }}
              >
                <i className="bi bi-plus-lg"></i>
                Nouveau
              </button>
            </div>
          </div>
        </div>

        {/* ─── TABLE ─── */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                <tr>
                  {activeFilter === 'fournisseurs' && (
                    <>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nom</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Contact</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Téléphone</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Type</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Statut</th>
                      <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actions</th>
                    </>
                  )}
                  {activeFilter === 'outils' && (
                    <>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nom</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Type</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Catégorie</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>État</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Emplacement</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Dernier contrôle</th>
                      <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actions</th>
                    </>
                  )}
                  {activeFilter === 'pieces' && (
                    <>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pièce</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Type</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Stock</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Alerte</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Prix unitaire</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fournisseur</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Statut</th>
                      <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-gray-900 divide-gray-800' : 'bg-white divide-gray-200'} divide-y`}>
                {renderTable()}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {renderPagination()}
        </div>

        {/* Footer */}
        <div className={`mt-8 py-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center justify-center">
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              © 2026 SGS Tous droits réservés - Version 1.0
            </p>
          </div>
        </div>
      </main>

      {/* ============================================================================ */}
      {/* MODAL CRUD */}
      {/* ============================================================================ */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
              onClick={handleCloseModal}
            ></div>

            {/* Modal */}
            <div className={`inline-block align-bottom ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full`}>
              <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {modalMode === 'create' ? 'Créer' : 'Modifier'} - {
                      activeFilter === 'fournisseurs' ? 'Fournisseur' :
                      activeFilter === 'outils' ? 'Outil' :
                      'Pièce détachée'
                    }
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                  {renderFormFields()}

                  {(activeFilter === 'fournisseurs' || activeFilter === 'pieces') && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="est_actif"
                        checked={formData.est_actif}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className={`ml-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Actif
                      </label>
                    </div>
                  )}
                </div>

                <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-800 bg-gray-850' : 'border-gray-200 bg-gray-50'} flex justify-end gap-3`}>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className={`px-4 py-2 rounded-lg font-medium ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors`}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-white font-medium transition-all hover:opacity-90 hover:shadow-md"
                    style={{
                      background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
                    }}
                  >
                    {modalMode === 'create' ? 'Créer' : 'Modifier'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FournisseursOutils;