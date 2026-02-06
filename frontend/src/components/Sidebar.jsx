import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = ({ darkMode, sidebarCollapsed, setSidebarCollapsed }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation(); // ← Pour détecter l'URL actuelle
  
  const [openMenus, setOpenMenus] = useState({
    configuration: false,
    audit: false,
    analyses: false
  });

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  // ============================================================================
  // FONCTION POUR VÉRIFIER SI UN ITEM EST ACTIF
  // ============================================================================
  const isActive = (path) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const menuItems = [
    {
      items: [
        { 
          icon: 'bi-speedometer2', 
          label: 'Tableau de bord ',    onClick: () => navigate('/Admin/Navigation/Dashboard'),
          path: '/Admin/Navigation/Dashboard' // ← Ajout du path
        },
        { 
          icon: 'bi-car-front-fill', 
          label: 'Véhicules',
          path: '/Admin/Navigation/Vehicules',
          onClick: () => navigate('/Admin/Navigation/Vehicules')
        },
      ]
    },
    {
      items: [
        { 
          icon: 'bi-people-fill', 
          label: 'Utilisateurs',
          path: '/Admin/Navigation/Utilisateurs',
          onClick: () => navigate('/Admin/Navigation/Utilisateurs')
        }
      ]
    },
    {
      items: [
        { 
          icon: 'bi-clipboard-check-fill', 
          label: 'Inteventions',
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
      items :[
        {
          icon : 'bi-box-seam-fill',
          label : 'Fournisseurs & Outils',
          path: '/Admin/Navigation/FournisseursOutils', onClick: () => navigate('/Admin/Navigation/FournisseursOutils')
        }
      ]
    },
    {
      items: [
        {
          icon: 'bi-clock-fill', 
          label: 'Historique de connexion',
          path: '/Admin/Navigation/Historique',
          onClick: () => navigate('/Admin/Navigation/Historique')
        }
      ]
    },
    {
      section: 'AUDIT & SÉCURITÉ',
      items: [
        { 
          icon: 'bi-shield-fill-check', 
          label: 'Audit & Logs',
          hasSubmenu: true,
          key: 'audit',
          submenu: [
            { label: 'Sécurité' },
            { label: 'Sauvegardes' }
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
            { label: 'Exports' }
          ]
        }
      ]
    },
    {
      section: 'PERSONNALISATION',
      items: [
        { 
          icon: 'bi-palette-fill', 
          label: 'Thème',
          path: '/Admin/Navigation/Theme',
          onClick: () => navigate('/Admin/Navigation/Theme')
        }
      ]
    },
    {
      section: 'COMPTE',
      items: [
        { 
          icon: 'bi-person-circle', 
          label: 'Mon Profil',
          path: '/Admin/Navigation/Profil'
        }
      ]
    }
  ];

  return (
    <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-r transition-all duration-300 flex flex-col h-screen fixed left-0 top-0 z-40`}>
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
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>GESTION DE PARCK AUTO</p>
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
              // ============================================================================
              // VÉRIFIER SI CET ITEM EST ACTIF EN FONCTION DE L'URL
              // ============================================================================
              const itemIsActive = isActive(item.path);
              
              return (
                <div key={itemIdx}>
                  <button
                    onClick={() => {
                      if (item.onClick) {
                        item.onClick();
                      } else if (item.hasSubmenu) {
                        toggleMenu(item.key);
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
                      {item.submenu.map((subitem, subIdx) => (
                        <button 
                          key={subIdx}
                          className={`w-full text-left px-3 py-2 rounded text-sm ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          {subitem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className={`flex items-center gap-3 mb-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{
              background: `linear-gradient(to bottom right, ${theme.primary}, ${theme.primaryDark})`
            }}
          >
            HD
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1">
              <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Jean Dupont</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Super Admin</p>
            </div>
          )}
        </div>
        {!sidebarCollapsed && (
          <button 
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-md"
            style={{
              background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
            }}
          >
            <i className="bi bi-box-arrow-right" style={{ fontSize: '1rem' }}></i>
            <span>Déconnexion</span>
          </button>
        )}
        {sidebarCollapsed && (
          <button 
            className="w-full flex items-center justify-center p-2 rounded-lg text-white transition-all hover:opacity-90 hover:shadow-md"
            title="Déconnexion"
            style={{
              background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
            }}
          >
            <i className="bi bi-box-arrow-right" style={{ fontSize: '1.25rem' }}></i>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;