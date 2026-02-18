import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Swal from 'sweetalert2';

const Sidebar = ({ darkMode, sidebarCollapsed, setSidebarCollapsed }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // ── Déconnexion avec confirmation SweetAlert2 ──
  const handleLogout = () => {
    Swal.fire({
      background: darkMode ? '#111827' : '#ffffff',
      color: darkMode ? '#f1f5f9' : '#111827',
      icon: 'question',
      iconColor: theme.primary,
      title: 'Déconnexion',
      text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      showCancelButton: true,
      confirmButtonText: 'Oui, me déconnecter',
      cancelButtonText: 'Annuler',
      confirmButtonColor: theme.primary,
      cancelButtonColor: darkMode ? '#374151' : '#9ca3af',
      customClass: {
        popup: 'swal-logout-popup',
        confirmButton: 'swal-logout-confirm',
        cancelButton: 'swal-logout-cancel',
      },
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Nettoyer le localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('remember_me');
        localStorage.removeItem('expires_at');

        Swal.fire({
          background: darkMode ? '#111827' : '#ffffff',
          color: darkMode ? '#f1f5f9' : '#111827',
          icon: 'success',
          iconColor: '#22c55e',
          title: 'À bientôt !',
          text: 'Vous avez été déconnecté avec succès.',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
          customClass: { popup: 'swal-logout-popup' },
        }).then(() => {
          navigate('/');
        });
      }
    });
  };

  const [openMenus, setOpenMenus] = useState({
    configuration: false,
    audit: false,
    analyses: false
  });

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const isActive = (path) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const menuItems = [
    {
      items: [
        { 
          icon: 'bi-speedometer2', 
          label: 'Tableau de bord',
          onClick: () => navigate('/Admin/Navigation/Dashboard'),
          path: '/Admin/Navigation/Dashboard'
        },
        { 
          icon: 'bi-car-front-fill', 
          label: 'Gestion des véhicules',
          path: '/Admin/Navigation/Vehicules',
          onClick: () => navigate('/Admin/Navigation/Vehicules')
        },
      ]
    },
    {
      items: [
        { 
          icon: 'bi-people-fill', 
          label: 'Gestion des utilisateurs',
          path: '/Admin/Navigation/Utilisateurs',
          onClick: () => navigate('/Admin/Navigation/Utilisateurs')
        }
      ]
    },
    {
      items: [
        {
          icon: 'bi-person-badge-fill', 
          label: 'Gestion des chauffeurs',
          path: '/Admin/Navigation/Chauffeurs',
          onClick: () => navigate('/Admin/Navigation/Chauffeurs')
        }
      ]
    },
    {
      items: [
        { 
          icon: 'bi-clipboard-check-fill', 
          label: 'Interventions',
          path: '/Admin/Navigation/Interventions',
          onClick: () => navigate('/Admin/Navigation/Interventions')
        }
      ]
    },
    {
      items: [
        { 
          icon: 'bi-wrench-adjustable-circle-fill', 
          label: 'Inspection de véhicules',
          path: '/Admin/Navigation/InspectionVehicules',
          onClick: () => navigate('/Admin/Navigation/InspectionVehicules')
        }
      ]
    },
    {
      items: [
        {
          icon: 'bi-box-seam-fill',
          label: 'Fournisseurs & Outils',
          path: '/Admin/Navigation/FournisseursOutils',
          onClick: () => navigate('/Admin/Navigation/FournisseursOutils')
        }
      ]
    },
    {
      section: 'AUDIT & LOGS',
      items: [
        { 
          icon: 'bi-shield-fill-check', 
          label: 'Audit & Logs',
          hasSubmenu: true,
          key: 'audit',
          submenu: [
            { 
              label: 'Sécurité',
              icon: 'bi-shield-lock-fill',
              path: '/Admin/Navigation/Securite',
              onClick: () => navigate('/Admin/Navigation/Securite')
            },
            { 
              label: 'Sauvegardes',
              icon: 'bi-cloud-arrow-up-fill',
              path: '/Admin/Navigation/Sauvegardes',
              onClick: () => navigate('/Admin/Navigation/Sauvegardes')
            },
            {
              label: 'Historique de connexion',
              icon: 'bi-clock-fill',
              path: '/Admin/Navigation/HistoriqueConnexion',
              onClick: () => navigate('/Admin/Navigation/HistoriqueConnexion')
            },
          ]
        }
      ]
    },
    {
      section: 'ANALYSES & EXPORTS',
      items: [
        { 
          icon: 'bi-bar-chart-fill', 
          label: 'Statistiques',
          hasSubmenu: true,
          key: 'analyses',
          submenu: [
            {
              label: 'Missions',
              icon: 'bi-briefcase-fill',
              path: '/Admin/Navigation/Missions',
              onClick: () => navigate('/Admin/Navigation/Missions')
            },
            { 
              label: 'Accidents',
              icon: 'bi-cone-striped',
              path: '/Admin/Navigation/Accidents',
              onClick: () => navigate('/Admin/Navigation/Accidents')
            },
            { 
              label: 'Rapports standards',
              icon: 'bi-file-earmark-bar-graph-fill',
              path: '/Admin/Navigation/RapportsStandards',
              onClick: () => navigate('/Admin/Navigation/RapportsStandards')
            }
          ]
        }
      ]
    },
    {
      section: 'CONFIGURATION',
      items: [
        { 
          icon: 'bi-gear-fill', 
          label: 'Configuration',
          hasSubmenu: true,
          key: 'configuration',
          submenu: [
            { 
              label: 'Notifications',
              icon: 'bi-bell-fill',
              path: '/Admin/Configuration/Notifications',
              onClick: () => navigate('/Admin/Configuration/Notifications')
            },
            { 
              label: 'Paramètres',
              icon: 'bi-gear-fill',
              path: '/Admin/Configuration/Parametres',
              onClick: () => navigate('/Admin/Configuration/Parametres')
            },
            {
              icon: 'bi-palette-fill', 
              label: 'Thème',
              path: '/Admin/Navigation/Theme',
              onClick: () => navigate('/Admin/Navigation/Theme')
            }
          ]
        }
      ]
    },
  ];

  return (
    <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-r transition-all duration-300 flex flex-col h-screen fixed left-0 top-0 z-40`}>

      <style>{`
        .swal-logout-popup { border-radius: 16px !important; }
        .swal-logout-confirm { border-radius: 10px !important; font-weight: 600 !important; padding: 10px 24px !important; }
        .swal-logout-cancel { border-radius: 10px !important; font-weight: 500 !important; padding: 10px 24px !important; color: ${darkMode ? '#d1d5db' : '#374151'} !important; }
        .swal2-timer-progress-bar { background: #22c55e !important; }
      `}</style>

      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-3">
            <div>
              <img 
                src="/logo.png" 
                alt="SGS Fleet Logo" 
                className="w-10 h-auto object-contain"
              />
            </div>
            <div>
              <h1 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>FLeetify Management</h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>GESTION DE PARC AUTO</p>
            </div>
          </div>
        )}
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${sidebarCollapsed ? 'mx-auto' : ''} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
        >
          {sidebarCollapsed ? <i className="bi bi-list text-xl"></i> : <i className="bi bi-x-lg text-xl"></i>}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>
          {`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            {!sidebarCollapsed && section.section && (
              <p className={`text-xs font-semibold ${darkMode ? 'text-gray-500' : 'text-gray-400'} px-3 mb-2`}>
                {section.section}
              </p>
            )}
            {section.items.map((item, itemIdx) => {
              const itemIsActive = isActive(item.path);
              
              return (
                <div key={itemIdx}>
                  <button
                    onClick={() => {
                      if (item.hasSubmenu) {
                        toggleMenu(item.key);
                      } else if (item.onClick) {
                        item.onClick();
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all ${
                      itemIsActive
                        ? 'text-white shadow-md' 
                        : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
                    }`}
                    style={itemIsActive ? {
                      background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
                    } : {}}
                  >
                    <i className={`${item.icon} ${sidebarCollapsed ? 'mx-auto' : ''}`} style={{ fontSize: '1.25rem' }}></i>
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                        {item.hasSubmenu && (
                          <i className={`bi bi-chevron-down text-sm transition-transform ${openMenus[item.key] ? 'rotate-180' : ''}`}></i>
                        )}
                      </>
                    )}
                  </button>
                  {!sidebarCollapsed && item.hasSubmenu && openMenus[item.key] && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.submenu.map((subitem, subIdx) => {
                        const subitemIsActive = isActive(subitem.path);
                        
                        return (
                          <button 
                            key={subIdx}
                            onClick={() => {
                              if (subitem.onClick) subitem.onClick();
                            }}
                            className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 transition-all ${
                              subitemIsActive
                                ? 'text-white shadow-sm font-medium'
                                : `${darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                            }`}
                            style={subitemIsActive ? {
                              background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
                            } : {}}
                          >
                            {subitem.icon && (
                              <i className={`${subitem.icon}`} style={{ fontSize: '0.95rem' }}></i>
                            )}
                            {subitem.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Bas de la sidebar : avatar + déconnexion ── */}
      <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className={`flex items-center gap-3 mb-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ background: `linear-gradient(to bottom right, ${theme.primary}, ${theme.primaryDark})` }}
          >
            HD
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1">
              <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Hulas DJYEMBI</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>administrateur</p>
            </div>
          )}
        </div>

        {/* Bouton déconnexion — version étendue */}
        {!sidebarCollapsed && (
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-md"
            style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` }}
          >
            <i className="bi bi-box-arrow-right" style={{ fontSize: '1rem' }}></i>
            <span>Déconnexion</span>
          </button>
        )}

        {/* Bouton déconnexion — version collapsed */}
        {sidebarCollapsed && (
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2 rounded-lg text-white transition-all hover:opacity-90 hover:shadow-md"
            title="Déconnexion"
            style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` }}
          >
            <i className="bi bi-box-arrow-right" style={{ fontSize: '1.25rem' }}></i>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;