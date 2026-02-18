import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

// ============================================================================
// IMPORTS DES COMPOSANTS SÉPARÉS - SIDEBAR ET HEADER
// ============================================================================
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
// ============================================================================

const Chauffeurs = () => {
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
  const [activeTab, setActiveTab] = useState('chauffeurs'); // 'chauffeurs' | 'documents'
  
  // ── États pour Chauffeurs ──
  const [chauffeurs, setChauffeurs] = useState([]);
  const [filteredChauffeurs, setFilteredChauffeurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDirection, setFilterDirection] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  // ── États pour Documents ──
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchDocTerm, setSearchDocTerm] = useState('');
  const [filterTypeDoc, setFilterTypeDoc] = useState('all');
  const [filterStatutDoc, setFilterStatutDoc] = useState('all');
  const [currentDocPage, setCurrentDocPage] = useState(1);
  const [showDocFilterMenu, setShowDocFilterMenu] = useState(false);
  
  // ── États pour Modals ──
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit' | 'view'
  const [selectedChauffeur, setSelectedChauffeur] = useState(null);
  
  // ── États pour Actions Menu ──
  const [showActionMenu, setShowActionMenu] = useState(null);
  
  const [showDocModal, setShowDocModal] = useState(false);
  const [docModalMode, setDocModalMode] = useState('add');
  const [selectedDocument, setSelectedDocument] = useState(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('chauffeur'); // 'chauffeur' | 'document'

  const { theme } = useTheme();
  const navigate = useNavigate();

  // ══════════════════════════════════════════════════════════════════════
  // DONNÉES SIMULÉES - CHAUFFEURS (20 éléments pour pagination)
  // ══════════════════════════════════════════════════════════════════════
  const mockChauffeurs = [
    { id: 1, nom: 'Jean Mbourou', email: 'jean.mbourou@sgs-gabon.com', telephone: '+241 06 12 34 56', direction: 'Dir. Générale', statut: 'actif', dateEmbauche: '2020-03-15', permis: 'B, C, E', dateCreation: '2020-03-15', initiales: 'JM', couleur: '#f59e0b' },
    { id: 2, nom: 'Paul Nzong', email: 'paul.nzong@sgs-gabon.com', telephone: '+241 06 23 45 67', direction: 'Dir. Technique', statut: 'actif', dateEmbauche: '2019-07-22', permis: 'B, C', dateCreation: '2019-07-22', initiales: 'PN', couleur: '#3b82f6' },
    { id: 3, nom: 'Marie Essono', email: 'marie.essono@sgs-gabon.com', telephone: '+241 06 34 56 78', direction: 'Transport Fonds', statut: 'actif', dateEmbauche: '2021-01-10', permis: 'B, C, E', dateCreation: '2021-01-10', initiales: 'ME', couleur: '#10b981' },
    { id: 4, nom: 'Albert Bongo', email: 'albert.bongo@sgs-gabon.com', telephone: '+241 06 45 67 89', direction: 'Dir. Commerciale', statut: 'actif', dateEmbauche: '2018-11-05', permis: 'B', dateCreation: '2018-11-05', initiales: 'AB', couleur: '#8b5cf6' },
    { id: 5, nom: 'Sophie Mba', email: 'sophie.mba@sgs-gabon.com', telephone: '+241 06 56 78 90', direction: 'Dir. Générale', statut: 'inactif', dateEmbauche: '2022-04-18', permis: 'B, C', dateCreation: '2022-04-18', initiales: 'SM', couleur: '#ef4444' },
    { id: 6, nom: 'David Okome', email: 'david.okome@sgs-gabon.com', telephone: '+241 06 67 89 01', direction: 'Dir. Technique', statut: 'actif', dateEmbauche: '2020-09-12', permis: 'B, C, E', dateCreation: '2020-09-12', initiales: 'DO', couleur: '#ec4899' },
    { id: 7, nom: 'Claire Moussavou', email: 'claire.moussavou@sgs-gabon.com', telephone: '+241 06 78 90 12', direction: 'Transport Fonds', statut: 'actif', dateEmbauche: '2019-05-20', permis: 'B, C', dateCreation: '2019-05-20', initiales: 'CM', couleur: '#14b8a6' },
    { id: 8, nom: 'Michel Obame', email: 'michel.obame@sgs-gabon.com', telephone: '+241 06 89 01 23', direction: 'Dir. Générale', statut: 'actif', dateEmbauche: '2021-08-30', permis: 'B, C, E', dateCreation: '2021-08-30', initiales: 'MO', couleur: '#f97316' },
    { id: 9, nom: 'Sandrine Nguema', email: 'sandrine.nguema@sgs-gabon.com', telephone: '+241 06 90 12 34', direction: 'Dir. Commerciale', statut: 'actif', dateEmbauche: '2020-02-14', permis: 'B', dateCreation: '2020-02-14', initiales: 'SN', couleur: '#06b6d4' },
    { id: 10, nom: 'François Ondimba', email: 'francois.ondimba@sgs-gabon.com', telephone: '+241 06 01 23 45', direction: 'Dir. Technique', statut: 'actif', dateEmbauche: '2018-12-03', permis: 'B, C', dateCreation: '2018-12-03', initiales: 'FO', couleur: '#84cc16' },
    { id: 11, nom: 'Juliette Boungou', email: 'juliette.boungou@sgs-gabon.com', telephone: '+241 06 12 34 57', direction: 'Transport Fonds', statut: 'actif', dateEmbauche: '2021-06-25', permis: 'B, C, E', dateCreation: '2021-06-25', initiales: 'JB', couleur: '#a855f7' },
    { id: 12, nom: 'Patrick Mabika', email: 'patrick.mabika@sgs-gabon.com', telephone: '+241 06 23 45 68', direction: 'Dir. Générale', statut: 'inactif', dateEmbauche: '2019-10-08', permis: 'B, C', dateCreation: '2019-10-08', initiales: 'PM', couleur: '#6b7280' },
    { id: 13, nom: 'Nathalie Mengue', email: 'nathalie.mengue@sgs-gabon.com', telephone: '+241 06 34 56 79', direction: 'Dir. Commerciale', statut: 'actif', dateEmbauche: '2020-11-19', permis: 'B', dateCreation: '2020-11-19', initiales: 'NM', couleur: '#eab308' },
  ];

  // ══════════════════════════════════════════════════════════════════════
  // DONNÉES SIMULÉES - DOCUMENTS (20 éléments pour pagination)
  // ══════════════════════════════════════════════════════════════════════
  const mockDocuments = [
    { id: 1, chauffeurId: 1, chauffeurNom: 'Jean Mbourou', typeDocument: 'Permis de conduire', numeroPermis: 'PC123456', categoriesPermis: 'B, C, E', dateDelivrance: '2018-05-10', dateExpiration: '2028-05-10', statut: 'valide', fichier: 'permis_jean.pdf' },
    { id: 2, chauffeurId: 2, chauffeurNom: 'Paul Nzong', typeDocument: 'Permis de conduire', numeroPermis: 'PC234567', categoriesPermis: 'B, C', dateDelivrance: '2017-03-15', dateExpiration: '2027-03-15', statut: 'valide', fichier: 'permis_paul.pdf' },
    { id: 3, chauffeurId: 3, chauffeurNom: 'Marie Essono', typeDocument: 'Permis de conduire', numeroPermis: 'PC345678', categoriesPermis: 'B, C, E', dateDelivrance: '2019-01-20', dateExpiration: '2029-01-20', statut: 'valide', fichier: 'permis_marie.pdf' },
    { id: 4, chauffeurId: 4, chauffeurNom: 'Albert Bongo', typeDocument: 'Permis de conduire', numeroPermis: 'PC456789', categoriesPermis: 'B', dateDelivrance: '2016-11-08', dateExpiration: '2026-11-08', statut: 'expire_bientot', fichier: 'permis_albert.pdf' },
    { id: 5, chauffeurId: 5, chauffeurNom: 'Sophie Mba', typeDocument: 'Permis de conduire', numeroPermis: 'PC567890', categoriesPermis: 'B, C', dateDelivrance: '2020-02-25', dateExpiration: '2030-02-25', statut: 'valide', fichier: 'permis_sophie.pdf' },
    { id: 6, chauffeurId: 1, chauffeurNom: 'Jean Mbourou', typeDocument: 'Certificat médical', numeroPermis: 'CM001', categoriesPermis: '-', dateDelivrance: '2025-01-15', dateExpiration: '2026-01-15', statut: 'valide', fichier: 'medical_jean.pdf' },
    { id: 7, chauffeurId: 6, chauffeurNom: 'David Okome', typeDocument: 'Permis de conduire', numeroPermis: 'PC678901', categoriesPermis: 'B, C, E', dateDelivrance: '2018-09-12', dateExpiration: '2028-09-12', statut: 'valide', fichier: 'permis_david.pdf' },
    { id: 8, chauffeurId: 7, chauffeurNom: 'Claire Moussavou', typeDocument: 'Permis de conduire', numeroPermis: 'PC789012', categoriesPermis: 'B, C', dateDelivrance: '2017-05-20', dateExpiration: '2027-05-20', statut: 'valide', fichier: 'permis_claire.pdf' },
    { id: 9, chauffeurId: 8, chauffeurNom: 'Michel Obame', typeDocument: 'Permis de conduire', numeroPermis: 'PC890123', categoriesPermis: 'B, C, E', dateDelivrance: '2019-08-30', dateExpiration: '2029-08-30', statut: 'valide', fichier: 'permis_michel.pdf' },
    { id: 10, chauffeurId: 9, chauffeurNom: 'Sandrine Nguema', typeDocument: 'Permis de conduire', numeroPermis: 'PC901234', categoriesPermis: 'B', dateDelivrance: '2018-02-14', dateExpiration: '2028-02-14', statut: 'valide', fichier: 'permis_sandrine.pdf' },
    { id: 11, chauffeurId: 2, chauffeurNom: 'Paul Nzong', typeDocument: 'Certificat médical', numeroPermis: 'CM002', categoriesPermis: '-', dateDelivrance: '2024-12-10', dateExpiration: '2025-12-10', statut: 'valide', fichier: 'medical_paul.pdf' },
    { id: 12, chauffeurId: 10, chauffeurNom: 'François Ondimba', typeDocument: 'Permis de conduire', numeroPermis: 'PC012345', categoriesPermis: 'B, C', dateDelivrance: '2016-12-03', dateExpiration: '2026-12-03', statut: 'expire_bientot', fichier: 'permis_francois.pdf' },
    { id: 13, chauffeurId: 11, chauffeurNom: 'Juliette Boungou', typeDocument: 'Permis de conduire', numeroPermis: 'PC123457', categoriesPermis: 'B, C, E', dateDelivrance: '2019-06-25', dateExpiration: '2029-06-25', statut: 'valide', fichier: 'permis_juliette.pdf' },
  ];

  // ══════════════════════════════════════════════════════════════════════
  // INITIALISATION DES DONNÉES
  // ══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    setChauffeurs(mockChauffeurs);
    setFilteredChauffeurs(mockChauffeurs);
    setDocuments(mockDocuments);
    setFilteredDocuments(mockDocuments);
  }, []);

  // ══════════════════════════════════════════════════════════════════════
  // FILTRAGE CHAUFFEURS
  // ══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    let filtered = chauffeurs;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.telephone.includes(searchTerm)
      );
    }

    // Filtre par direction
    if (filterDirection !== 'all') {
      filtered = filtered.filter(c => c.direction === filterDirection);
    }

    // Filtre par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.statut === filterStatus);
    }

    setFilteredChauffeurs(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterDirection, filterStatus, chauffeurs]);

  // ══════════════════════════════════════════════════════════════════════
  // FILTRAGE DOCUMENTS
  // ══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    let filtered = documents;

    // Filtre par recherche
    if (searchDocTerm) {
      filtered = filtered.filter(d => 
        d.chauffeurNom.toLowerCase().includes(searchDocTerm.toLowerCase()) ||
        d.numeroPermis.toLowerCase().includes(searchDocTerm.toLowerCase())
      );
    }

    // Filtre par type
    if (filterTypeDoc !== 'all') {
      filtered = filtered.filter(d => d.typeDocument === filterTypeDoc);
    }

    // Filtre par statut
    if (filterStatutDoc !== 'all') {
      filtered = filtered.filter(d => d.statut === filterStatutDoc);
    }

    setFilteredDocuments(filtered);
    setCurrentDocPage(1);
  }, [searchDocTerm, filterTypeDoc, filterStatutDoc, documents]);

  // ══════════════════════════════════════════════════════════════════════
  // PAGINATION CHAUFFEURS
  // ══════════════════════════════════════════════════════════════════════
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentChauffeurs = filteredChauffeurs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredChauffeurs.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ══════════════════════════════════════════════════════════════════════
  // PAGINATION DOCUMENTS
  // ══════════════════════════════════════════════════════════════════════
  const indexOfLastDoc = currentDocPage * itemsPerPage;
  const indexOfFirstDoc = indexOfLastDoc - itemsPerPage;
  const currentDocuments = filteredDocuments.slice(indexOfFirstDoc, indexOfLastDoc);
  const totalDocPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  const paginateDoc = (pageNumber) => setCurrentDocPage(pageNumber);

  // ══════════════════════════════════════════════════════════════════════
  // GESTION CHAUFFEURS - CRUD
  // ══════════════════════════════════════════════════════════════════════
  const handleAddChauffeur = () => {
    setModalMode('add');
    setSelectedChauffeur({
      nom: '',
      email: '',
      telephone: '',
      direction: 'Dir. Générale',
      statut: 'actif',
      dateEmbauche: '',
      permis: ''
    });
    setShowModal(true);
  };

  const handleEditChauffeur = (chauffeur) => {
    setModalMode('edit');
    setSelectedChauffeur({ ...chauffeur });
    setShowModal(true);
    setShowActionMenu(null);
  };

  const handleViewChauffeur = (chauffeur) => {
    setModalMode('view');
    setSelectedChauffeur(chauffeur);
    setShowModal(true);
    setShowActionMenu(null);
  };

  const handleSaveChauffeur = () => {
    if (modalMode === 'add') {
      const newChauffeur = {
        ...selectedChauffeur,
        id: chauffeurs.length + 1,
        dateCreation: new Date().toISOString().split('T')[0],
        initiales: selectedChauffeur.nom.split(' ').map(n => n[0]).join(''),
        couleur: '#' + Math.floor(Math.random()*16777215).toString(16)
      };
      setChauffeurs([...chauffeurs, newChauffeur]);
      alert('✅ Chauffeur ajouté avec succès !');
    } else if (modalMode === 'edit') {
      setChauffeurs(chauffeurs.map(c => c.id === selectedChauffeur.id ? selectedChauffeur : c));
      alert('✅ Chauffeur modifié avec succès !');
    }
    setShowModal(false);
    setSelectedChauffeur(null);
  };

  const handleDeleteChauffeur = (chauffeur) => {
    setItemToDelete(chauffeur);
    setDeleteType('chauffeur');
    setShowDeleteModal(true);
    setShowActionMenu(null);
  };

  const confirmDelete = () => {
    if (deleteType === 'chauffeur') {
      setChauffeurs(chauffeurs.filter(c => c.id !== itemToDelete.id));
      alert('✅ Chauffeur supprimé avec succès !');
    } else if (deleteType === 'document') {
      setDocuments(documents.filter(d => d.id !== itemToDelete.id));
      alert('✅ Document supprimé avec succès !');
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  // ══════════════════════════════════════════════════════════════════════
  // GESTION DOCUMENTS - CRUD
  // ══════════════════════════════════════════════════════════════════════
  const handleAddDocument = () => {
    setDocModalMode('add');
    setSelectedDocument({
      chauffeurId: '',
      chauffeurNom: '',
      typeDocument: 'Permis de conduire',
      numeroPermis: '',
      categoriesPermis: '',
      dateDelivrance: '',
      dateExpiration: '',
      statut: 'valide',
      fichier: ''
    });
    setShowDocModal(true);
  };

  const handleEditDocument = (document) => {
    setDocModalMode('edit');
    setSelectedDocument({ ...document });
    setShowDocModal(true);
    setShowActionMenu(null);
  };

  const handleViewDocument = (document) => {
    setDocModalMode('view');
    setSelectedDocument(document);
    setShowDocModal(true);
    setShowActionMenu(null);
  };

  const handleSaveDocument = () => {
    if (docModalMode === 'add') {
      const newDocument = {
        ...selectedDocument,
        id: documents.length + 1
      };
      setDocuments([...documents, newDocument]);
      alert('✅ Document ajouté avec succès !');
    } else if (docModalMode === 'edit') {
      setDocuments(documents.map(d => d.id === selectedDocument.id ? selectedDocument : d));
      alert('✅ Document modifié avec succès !');
    }
    setShowDocModal(false);
    setSelectedDocument(null);
  };

  const handleDeleteDocument = (document) => {
    setItemToDelete(document);
    setDeleteType('document');
    setShowDeleteModal(true);
    setShowActionMenu(null);
  };

  // ══════════════════════════════════════════════════════════════════════
  // STATS CARDS
  // ══════════════════════════════════════════════════════════════════════
  const getStatsForTab = () => {
    if (activeTab === 'chauffeurs') {
      return [
        { 
          title: 'Total Chauffeurs', 
          value: chauffeurs.length.toString(), 
          subtitle: 'chauffeurs enregistrés',
          icon: 'bi-people-fill',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          iconBg: 'bg-blue-100 dark:bg-blue-800',
          textColor: 'text-blue-600 dark:text-blue-400'
        },
        { 
          title: 'Actifs', 
          value: chauffeurs.filter(c => c.statut === 'actif').length.toString(), 
          subtitle: 'chauffeurs actifs',
          icon: 'bi-check-circle-fill',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          iconBg: 'bg-green-100 dark:bg-green-800',
          textColor: 'text-green-600 dark:text-green-400'
        },
        { 
          title: 'Inactifs', 
          value: chauffeurs.filter(c => c.statut === 'inactif').length.toString(), 
          subtitle: 'chauffeurs inactifs',
          icon: 'bi-x-circle-fill',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          iconBg: 'bg-red-100 dark:bg-red-800',
          textColor: 'text-red-600 dark:text-red-400'
        },
        { 
          title: 'Documents', 
          value: documents.length.toString(), 
          subtitle: 'documents enregistrés',
          icon: 'bi-file-earmark-text-fill',
          bgColor: 'bg-purple-50 dark:bg-purple-900/20',
          iconBg: 'bg-purple-100 dark:bg-purple-800',
          textColor: 'text-purple-600 dark:text-purple-400'
        }
      ];
    } else {
      return [
        { 
          title: 'Total Documents', 
          value: documents.length.toString(), 
          subtitle: 'documents enregistrés',
          icon: 'bi-file-earmark-text-fill',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          iconBg: 'bg-blue-100 dark:bg-blue-800',
          textColor: 'text-blue-600 dark:text-blue-400'
        },
        { 
          title: 'Valides', 
          value: documents.filter(d => d.statut === 'valide').length.toString(), 
          subtitle: 'documents valides',
          icon: 'bi-check-circle-fill',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          iconBg: 'bg-green-100 dark:bg-green-800',
          textColor: 'text-green-600 dark:text-green-400'
        },
        { 
          title: 'Expire bientôt', 
          value: documents.filter(d => d.statut === 'expire_bientot').length.toString(), 
          subtitle: 'à renouveler',
          icon: 'bi-exclamation-triangle-fill',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          iconBg: 'bg-yellow-100 dark:bg-yellow-800',
          textColor: 'text-yellow-600 dark:text-yellow-400'
        },
        { 
          title: 'Permis de conduire', 
          value: documents.filter(d => d.typeDocument === 'Permis de conduire').length.toString(), 
          subtitle: 'permis enregistrés',
          icon: 'bi-credit-card-fill',
          bgColor: 'bg-purple-50 dark:bg-purple-900/20',
          iconBg: 'bg-purple-100 dark:bg-purple-800',
          textColor: 'text-purple-600 dark:text-purple-400'
        }
      ];
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-950' : 'bg-gray-50'} min-h-screen transition-colors duration-300`}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      
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
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ONGLETS DE NAVIGATION */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm mb-6 p-2`}>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('chauffeurs')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'chauffeurs'
                  ? 'text-white shadow-md'
                  : `${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'}`
              }`}
              style={activeTab === 'chauffeurs' ? {
                background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
              } : {}}
            >
              <i className="bi bi-people-fill text-xl"></i>
              <span>Chauffeurs</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'chauffeurs'
                  ? 'bg-white/20'
                  : `${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`
              }`}>
                {chauffeurs.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'documents'
                  ? 'text-white shadow-md'
                  : `${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'}`
              }`}
              style={activeTab === 'documents' ? {
                background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
              } : {}}
            >
              <i className="bi bi-file-earmark-text-fill text-xl"></i>
              <span>Documents</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'documents'
                  ? 'bg-white/20'
                  : `${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`
              }`}>
                {documents.length}
              </span>
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* STATS GRID */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {getStatsForTab().map((card, idx) => (
            <div 
              key={idx}
              className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl p-6 border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                    {card.title}
                  </p>
                  <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                    {card.value}
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {card.subtitle}
                  </p>
                </div>
                <div className={`${card.iconBg} ${card.textColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                  <i className={card.icon} style={{ fontSize: '1.5rem' }}></i>
                </div>
              </div>
            </div>
          ))}
        </div>

      {activeTab === 'chauffeurs' && (
  <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm overflow-hidden`}>
    <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Liste des Chauffeurs
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {filteredChauffeurs.length} chauffeur{filteredChauffeurs.length > 1 ? 's' : ''} trouvé{filteredChauffeurs.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
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

          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              } transition-colors`}
            >
              <i className="bi bi-funnel"></i>
              <span className="text-sm font-medium">Filtres</span>
            </button>

            {showFilterMenu && (
              <div className={`absolute right-0 mt-2 w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-xl z-50 p-4`}>
                <div className="mb-4">
                  <label className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2 block`}>
                    Direction
                  </label>
                  <select
                    value={filterDirection}
                    onChange={(e) => setFilterDirection(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-900 border-gray-700 text-white' 
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    } text-sm`}
                  >
                    <option value="all">Toutes les directions</option>
                    <option value="Dir. Générale">Dir. Générale</option>
                    <option value="Dir. Technique">Dir. Technique</option>
                    <option value="Transport Fonds">Transport Fonds</option>
                    <option value="Dir. Commerciale">Dir. Commerciale</option>
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2 block`}>
                    Statut
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-900 border-gray-700 text-white' 
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    } text-sm`}
                  >
                    <option value="all">Tous</option>
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            } transition-colors`}
          >
            <i className="bi bi-download"></i>
            <span className="text-sm font-medium">Exporter</span>
          </button>

          <button
            onClick={handleAddChauffeur}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90 shadow-md hover:shadow-lg"
            style={{
              background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
            }}
          >
            <i className="bi bi-plus-lg"></i>
            <span>Ajouter</span>
          </button>
        </div>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">

        {/* ✅ THEAD — vraie couleur du thème actif */}
        <thead
          style={{
            background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`,
          }}
        >
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Chauffeur
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Direction
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Permis
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        {/* ✅ TBODY — lignes alternées : bleu pastel / gris pastel */}
        <tbody>
          {currentChauffeurs.map((chauffeur, index) => (
            <tr
              key={chauffeur.id}
              style={{
                backgroundColor: index % 2 === 0
                  ? darkMode ? '#1a2535' : '#eef2ff'
                  : darkMode ? '#1c1f2b' : '#f3f4f6',
                borderBottom: darkMode ? '1px solid #1e293b' : '1px solid #e5e7eb',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = darkMode ? `${theme.primary}30` : `${theme.primary}18`}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = index % 2 === 0
                ? darkMode ? '#1a2535' : '#eef2ff'
                : darkMode ? '#1c1f2b' : '#f3f4f6'
              }
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: chauffeur.couleur }}
                  >
                    {chauffeur.initiales}
                  </div>
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {chauffeur.nom}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Embauché le {new Date(chauffeur.dateEmbauche).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {chauffeur.email}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  {chauffeur.telephone}
                </p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {chauffeur.direction}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  darkMode 
                    ? 'bg-blue-900/30 text-blue-400' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {chauffeur.permis}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  chauffeur.statut === 'actif' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {chauffeur.statut === 'actif' ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="relative">
                  <button
                    onClick={() => setShowActionMenu(showActionMenu === chauffeur.id ? null : chauffeur.id)}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                  >
                    <i className={`bi bi-three-dots-vertical ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}></i>
                  </button>

                  {showActionMenu === chauffeur.id && (
                    <div className={`absolute right-0 mt-2 w-48 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-xl z-50`}>
                      <button
                        onClick={() => handleViewChauffeur(chauffeur)}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}
                      >
                        <i className="bi bi-eye-fill text-blue-500"></i>
                        <span>Voir détails</span>
                      </button>
                      <button
                        onClick={() => handleEditChauffeur(chauffeur)}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}
                      >
                        <i className="bi bi-pencil-fill text-yellow-500"></i>
                        <span>Modifier</span>
                      </button>
                      <button
                        onClick={() => handleDeleteChauffeur(chauffeur)}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-50'} transition-colors`}
                      >
                        <i className="bi bi-trash-fill"></i>
                        <span>Supprimer</span>
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
      <div className="flex items-center justify-between">
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Affichage de {filteredChauffeurs.length} chauffeurs
        </p>
      </div>
    </div>
  </div>
)}

    {activeTab === 'documents' && (
  <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm overflow-hidden`}>
    <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Liste des Documents
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {filteredDocuments.length} document{filteredDocuments.length > 1 ? 's' : ''} trouvé{filteredDocuments.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <i className={`bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}></i>
            <input 
              type="text"
              placeholder="Rechercher..."
              value={searchDocTerm}
              onChange={(e) => setSearchDocTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 w-64`}
              style={{ '--tw-ring-color': theme.primary }}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowDocFilterMenu(!showDocFilterMenu)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              } transition-colors`}
            >
              <i className="bi bi-funnel"></i>
              <span className="text-sm font-medium">Filtres</span>
            </button>

            {showDocFilterMenu && (
              <div className={`absolute right-0 mt-2 w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-xl z-50 p-4`}>
                <div className="mb-4">
                  <label className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2 block`}>
                    Type
                  </label>
                  <select
                    value={filterTypeDoc}
                    onChange={(e) => setFilterTypeDoc(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-900 border-gray-700 text-white' 
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    } text-sm`}
                  >
                    <option value="all">Tous les types</option>
                    <option value="Permis de conduire">Permis de conduire</option>
                    <option value="Certificat médical">Certificat médical</option>
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2 block`}>
                    Statut
                  </label>
                  <select
                    value={filterStatutDoc}
                    onChange={(e) => setFilterStatutDoc(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-900 border-gray-700 text-white' 
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    } text-sm`}
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="valide">Valide</option>
                    <option value="expire_bientot">Expire bientôt</option>
                    <option value="expire">Expiré</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            } transition-colors`}
          >
            <i className="bi bi-download"></i>
            <span className="text-sm font-medium">Exporter</span>
          </button>

          <button
            onClick={handleAddDocument}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90 shadow-md hover:shadow-lg"
            style={{
              background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
            }}
          >
            <i className="bi bi-plus-lg"></i>
            <span>Ajouter</span>
          </button>
        </div>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">

        {/* ✅ THEAD — vraie couleur du thème actif */}
        <thead
          style={{
            background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`,
          }}
        >
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Chauffeur
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              N° Document
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Catégories
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Expiration
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        {/* ✅ TBODY — lignes alternées : bleu pastel / gris pastel */}
        <tbody>
          {currentDocuments.map((doc, index) => (
            <tr
              key={doc.id}
              style={{
                backgroundColor: index % 2 === 0
                  ? darkMode ? '#1a2535' : '#eef2ff'
                  : darkMode ? '#1c1f2b' : '#f3f4f6',
                borderBottom: darkMode ? '1px solid #1e293b' : '1px solid #e5e7eb',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = darkMode ? `${theme.primary}30` : `${theme.primary}18`}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = index % 2 === 0
                ? darkMode ? '#1a2535' : '#eef2ff'
                : darkMode ? '#1c1f2b' : '#f3f4f6'
              }
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {doc.chauffeurNom}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <i className={`bi ${doc.typeDocument === 'Permis de conduire' ? 'bi-credit-card text-blue-500' : 'bi-file-medical text-green-500'}`}></i>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {doc.typeDocument}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {doc.numeroPermis}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {doc.categoriesPermis}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {new Date(doc.dateExpiration).toLocaleDateString('fr-FR')}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  doc.statut === 'valide'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : doc.statut === 'expire_bientot'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {doc.statut === 'valide' ? 'Valide' : doc.statut === 'expire_bientot' ? 'Expire bientôt' : 'Expiré'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="relative">
                  <button
                    onClick={() => setShowActionMenu(showActionMenu === `doc-${doc.id}` ? null : `doc-${doc.id}`)}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                  >
                    <i className={`bi bi-three-dots-vertical ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}></i>
                  </button>

                  {showActionMenu === `doc-${doc.id}` && (
                    <div className={`absolute right-0 mt-2 w-48 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-xl z-50`}>
                      <button
                        onClick={() => handleViewDocument(doc)}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}
                      >
                        <i className="bi bi-eye-fill text-blue-500"></i>
                        <span>Voir détails</span>
                      </button>
                      <button
                        onClick={() => handleEditDocument(doc)}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}
                      >
                        <i className="bi bi-pencil-fill text-yellow-500"></i>
                        <span>Modifier</span>
                      </button>
                      <button
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}
                      >
                        <i className="bi bi-download text-green-500"></i>
                        <span>Télécharger</span>
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc)}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-50'} transition-colors`}
                      >
                        <i className="bi bi-trash-fill"></i>
                        <span>Supprimer</span>
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
      <div className="flex items-center justify-between">
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Affichage de {filteredDocuments.length} documents
        </p>
      </div>
    </div>
  </div>
)}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* MODAL CHAUFFEUR (ADD/EDIT/VIEW) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
              {/* Header */}
              <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {modalMode === 'add' ? 'Ajouter un chauffeur' : modalMode === 'edit' ? 'Modifier le chauffeur' : 'Détails du chauffeur'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
                  >
                    <i className={`bi bi-x-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}></i>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={selectedChauffeur?.nom || ''}
                      onChange={(e) => setSelectedChauffeur({ ...selectedChauffeur, nom: e.target.value })}
                      disabled={modalMode === 'view'}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 disabled:opacity-50`}
                      style={{ '--tw-ring-color': theme.primary }}
                      placeholder="Jean Dupont"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={selectedChauffeur?.email || ''}
                      onChange={(e) => setSelectedChauffeur({ ...selectedChauffeur, email: e.target.value })}
                      disabled={modalMode === 'view'}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 disabled:opacity-50`}
                      style={{ '--tw-ring-color': theme.primary }}
                      placeholder="jean.dupont@sgs-gabon.com"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={selectedChauffeur?.telephone || ''}
                      onChange={(e) => setSelectedChauffeur({ ...selectedChauffeur, telephone: e.target.value })}
                      disabled={modalMode === 'view'}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 disabled:opacity-50`}
                      style={{ '--tw-ring-color': theme.primary }}
                      placeholder="+241 06 12 34 56"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Direction <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedChauffeur?.direction || ''}
                      onChange={(e) => setSelectedChauffeur({ ...selectedChauffeur, direction: e.target.value })}
                      disabled={modalMode === 'view'}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 disabled:opacity-50`}
                      style={{ '--tw-ring-color': theme.primary }}
                    >
                      <option value="">Sélectionner une direction</option>
                      <option value="Dir. Générale">Dir. Générale</option>
                      <option value="Dir. Technique">Dir. Technique</option>
                      <option value="Transport Fonds">Transport Fonds</option>
                      <option value="Dir. Commerciale">Dir. Commerciale</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Date d'embauche <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={selectedChauffeur?.dateEmbauche || ''}
                      onChange={(e) => setSelectedChauffeur({ ...selectedChauffeur, dateEmbauche: e.target.value })}
                      disabled={modalMode === 'view'}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 disabled:opacity-50`}
                      style={{ '--tw-ring-color': theme.primary }}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Catégories permis <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: B, C, E"
                      value={selectedChauffeur?.permis || ''}
                      onChange={(e) => setSelectedChauffeur({ ...selectedChauffeur, permis: e.target.value })}
                      disabled={modalMode === 'view'}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 disabled:opacity-50`}
                      style={{ '--tw-ring-color': theme.primary }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Statut <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedChauffeur?.statut || ''}
                      onChange={(e) => setSelectedChauffeur({ ...selectedChauffeur, statut: e.target.value })}
                      disabled={modalMode === 'view'}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 disabled:opacity-50`}
                      style={{ '--tw-ring-color': theme.primary }}
                    >
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={`p-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex justify-end gap-3`}>
                <button
                  onClick={() => setShowModal(false)}
                  className={`px-6 py-2 rounded-lg border ${
                    darkMode 
                      ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                >
                  {modalMode === 'view' ? 'Fermer' : 'Annuler'}
                </button>
                {modalMode !== 'view' && (
                  <button
                    onClick={handleSaveChauffeur}
                    className="px-6 py-2 rounded-lg text-white font-medium transition-all hover:opacity-90"
                    style={{
                      background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
                    }}
                  >
                    {modalMode === 'add' ? 'Ajouter' : 'Modifier'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* MODAL DOCUMENT (ADD/EDIT/VIEW) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {showDocModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
              {/* Header */}
              <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {docModalMode === 'add' ? 'Ajouter un document' : docModalMode === 'edit' ? 'Modifier le document' : 'Détails du document'}
                  </h3>
                  <button
                    onClick={() => setShowDocModal(false)}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
                  >
                    <i className={`bi bi-x-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}></i>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Chauffeur <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedDocument?.chauffeurId || ''}
                      onChange={(e) => {
                        const chauffeur = chauffeurs.find(c => c.id === parseInt(e.target.value));
                        setSelectedDocument({ 
                          ...selectedDocument, 
                          chauffeurId: parseInt(e.target.value),
                          chauffeurNom: chauffeur?.nom || ''
                        });
                      }}
                      disabled={docModalMode === 'view'}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 disabled:opacity-50`}
                      style={{ '--tw-ring-color': theme.primary }}
                    >
                      <option value="">Sélectionner un chauffeur</option>
                      {chauffeurs.map(c => (
                        <option key={c.id} value={c.id}>{c.nom}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Type de document <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedDocument?.typeDocument || ''}
                      onChange={(e) => setSelectedDocument({ ...selectedDocument, typeDocument: e.target.value })}
                      disabled={docModalMode === 'view'}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 disabled:opacity-50`}
                      style={{ '--tw-ring-color': theme.primary }}
                    >
                      <option value="Permis de conduire">Permis de conduire</option>
                      <option value="Certificat médical">Certificat médical</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Numéro du document <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={selectedDocument?.numeroPermis || ''}
                      onChange={(e) => setSelectedDocument({ ...selectedDocument, numeroPermis: e.target.value })}
                      disabled={docModalMode === 'view'}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 disabled:opacity-50`}
                      style={{ '--tw-ring-color': theme.primary }}
                      placeholder="PC123456"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Catégories (pour permis)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: B, C, E"
                      value={selectedDocument?.categoriesPermis || ''}
                      onChange={(e) => setSelectedDocument({ ...selectedDocument, categoriesPermis: e.target.value })}
                      disabled={docModalMode === 'view'}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 disabled:opacity-50`}
                      style={{ '--tw-ring-color': theme.primary }}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Date de délivrance <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={selectedDocument?.dateDelivrance || ''}
                      onChange={(e) => setSelectedDocument({ ...selectedDocument, dateDelivrance: e.target.value })}
                      disabled={docModalMode === 'view'}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 disabled:opacity-50`}
                      style={{ '--tw-ring-color': theme.primary }}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Date d'expiration <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={selectedDocument?.dateExpiration || ''}
                      onChange={(e) => setSelectedDocument({ ...selectedDocument, dateExpiration: e.target.value })}
                      disabled={docModalMode === 'view'}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 disabled:opacity-50`}
                      style={{ '--tw-ring-color': theme.primary }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Fichier
                    </label>
                    <input
                      type="file"
                      disabled={docModalMode === 'view'}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 disabled:opacity-50`}
                      style={{ '--tw-ring-color': theme.primary }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={`p-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex justify-end gap-3`}>
                <button
                  onClick={() => setShowDocModal(false)}
                  className={`px-6 py-2 rounded-lg border ${
                    darkMode 
                      ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                >
                  {docModalMode === 'view' ? 'Fermer' : 'Annuler'}
                </button>
                {docModalMode !== 'view' && (
                  <button
                    onClick={handleSaveDocument}
                    className="px-6 py-2 rounded-lg text-white font-medium transition-all hover:opacity-90"
                    style={{
                      background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
                    }}
                  >
                    {docModalMode === 'add' ? 'Ajouter' : 'Modifier'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* MODAL DE CONFIRMATION DE SUPPRESSION */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-2xl max-w-md w-full`}>
              <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <i className="bi bi-exclamation-triangle-fill text-2xl text-red-600 dark:text-red-400"></i>
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Confirmer la suppression
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      Cette action est irréversible
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Êtes-vous sûr de vouloir supprimer {deleteType === 'chauffeur' ? 'ce chauffeur' : 'ce document'} ?
                  {deleteType === 'chauffeur' && itemToDelete && (
                    <span className="block mt-2 font-semibold">{itemToDelete.nom}</span>
                  )}
                </p>
              </div>

              <div className={`p-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex justify-end gap-3`}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={`px-6 py-2 rounded-lg border ${
                    darkMode 
                      ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                >
                  Supprimer
                </button>
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

export default Chauffeurs;