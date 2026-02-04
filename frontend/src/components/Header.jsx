import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Header = ({ darkMode, setDarkMode, sidebarCollapsed, showNotifications, setShowNotifications, showProfile, setShowProfile }) => {
  const { theme } = useTheme();

  const notifications = [
    { id: 1, type: 'warning', title: 'Maintenance requise', message: 'Véhicule AB-1234-GA nécessite une maintenance', time: 'Il y a 5 min', icon: 'bi-tools' },
    { id: 2, type: 'info', title: 'Nouvelle mission', message: 'Mission assignée à CD-5678-GA', time: 'Il y a 15 min', icon: 'bi-geo-alt-fill' },
    { id: 3, type: 'error', title: 'Alerte carburant', message: 'Niveau de carburant bas pour EF-9012-GA', time: 'Il y a 1h', icon: 'bi-fuel-pump-fill' }
  ];

  return (
    <header className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b px-6 py-4 flex items-center justify-between fixed top-0 right-0 left-0 z-30 transition-all duration-300`}
      style={{ left: sidebarCollapsed ? '5rem' : '18rem' }}>
      <div>
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard Admin</h2>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Vue d'ensemble du parc automobile</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <i className={`bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}></i>
          <input 
            type="text"
            placeholder="Rechercher..."
            className={`pl-10 pr-4 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
            } focus:outline-none focus:ring-2 w-64`}
            style={{ '--tw-ring-color': theme.primary }}
          />
        </div>

        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'} hover:scale-110 transition-transform`}
        >
          {darkMode ? <i className="bi bi-sun-fill text-xl"></i> : <i className="bi bi-moon-fill text-xl"></i>}
        </button>

        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'} hover:scale-110 transition-transform`}
          >
            <i className="bi bi-bell-fill text-xl"></i>
          </button>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            3
          </span>

          {showNotifications && (
            <div className={`absolute right-0 mt-2 w-80 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200`}>
              <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-4 border-b ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'} cursor-pointer transition-colors`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        notif.type === 'error' ? 'bg-red-100 text-red-600' :
                        notif.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <i className={`${notif.icon} text-lg`}></i>
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{notif.title}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{notif.message}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`p-3 text-center border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button className={`text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                  Voir toutes les notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <div 
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-transform shadow-lg"
            style={{
              background: `linear-gradient(to bottom right, ${theme.primary}, ${theme.primaryDark})`
            }}
          >
            JD
          </div>

          {showProfile && (
            <div className={`absolute right-0 mt-2 w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200`}>
              <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{
                      background: `linear-gradient(to bottom right, ${theme.primary}, ${theme.primaryDark})`
                    }}
                  >
                    JD
                  </div>
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Jean Dupont</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>jean.dupont@sgs.com</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}>
                  <i className="bi bi-person-circle text-lg"></i>
                  <span className="text-sm">Mon Profil</span>
                </button>
                <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}>
                  <i className="bi bi-gear-fill text-lg"></i>
                  <span className="text-sm">Paramètres</span>
                </button>
                <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}>
                  <i className="bi bi-question-circle-fill text-lg"></i>
                  <span className="text-sm">Aide</span>
                </button>
              </div>
              <div className={`p-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button 
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
                  style={{
                    background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
                  }}
                >
                  <i className="bi bi-box-arrow-right text-lg"></i>
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;