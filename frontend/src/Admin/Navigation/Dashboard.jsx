import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

// ============================================================================
// IMPORTS DES COMPOSANTS SÉPARÉS - SIDEBAR ET HEADER
// ============================================================================
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
// ============================================================================

const Dashboard = () => {
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
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [hoveredInterventionBar, setHoveredInterventionBar] = useState(null);
  const [hoveredDayBar, setHoveredDayBar] = useState(null);
  const [hoveredRoleBar, setHoveredRoleBar] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [animateCharts, setAnimateCharts] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // Reset vers false pour que la transition 0 → valeur se déclenche
    setAnimateCharts(false);
    // Attendre deux frames (requestAnimationFrame imbriqué) puis activer
    const id = requestAnimationFrame(() => {
      const id2 = requestAnimationFrame(() => {
        setAnimateCharts(true);
      });
      return () => cancelAnimationFrame(id2);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Stats Cards Data
  const statsCards = [
    { 
      title: 'Total Véhicules', 
      value: '45', 
      subtitle: 'dans le parc',
      trend: '+2.5% vs mois dernier',
      icon: 'bi-car-front-fill',
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-blue-100 dark:bg-blue-800',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      title: 'Disponibles', 
      value: '32', 
      subtitle: 'prêts à partir',
      trend: '',
      icon: 'bi-check-circle-fill',
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconBg: 'bg-green-100 dark:bg-green-800',
      textColor: 'text-green-600 dark:text-green-400'
    },
    { 
      title: 'En Maintenance', 
      value: '8', 
      subtitle: 'à l\'atelier',
      trend: '',
      icon: 'bi-tools',
      color: 'orange',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconBg: 'bg-orange-100 dark:bg-orange-800',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
    { 
      title: 'Missions Actives', 
      value: '12', 
      subtitle: 'en cours aujourd\'hui',
      trend: '',
      icon: 'bi-geo-alt-fill',
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-blue-100 dark:bg-blue-800',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      title: 'Kilométrage Total', 
      value: '1.2M km', 
      subtitle: 'ce mois',
      trend: '+8.3% vs mois dernier',
      icon: 'bi-speedometer2',
      color: 'purple',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconBg: 'bg-purple-100 dark:bg-purple-800',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    { 
      title: 'Consommation', 
      value: '6,800 L', 
      subtitle: 'carburant ce mois',
      trend: '',
      icon: 'bi-fuel-pump-fill',
      color: 'yellow',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconBg: 'bg-yellow-100 dark:bg-yellow-800',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    { 
      title: 'Coût Maintenance', 
      value: '2.5M CFA', 
      subtitle: 'ce trimestre',
      trend: '',
      icon: 'bi-currency-dollar',
      color: 'orange',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconBg: 'bg-orange-100 dark:bg-orange-800',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
    { 
      title: 'Alertes', 
      value: '3', 
      subtitle: 'actions requises',
      trend: '',
      icon: 'bi-exclamation-triangle-fill',
      color: 'red',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      iconBg: 'bg-red-100 dark:bg-red-800',
      textColor: 'text-red-600 dark:text-red-400'
    },
    { 
      title: 'Temps Moyen Réparation', 
      value: '2.5h', 
      subtitle: 'par intervention',
      trend: '-12% vs mois dernier',
      icon: 'bi-clock-history',
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-blue-100 dark:bg-blue-800',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      title: 'Temps Moyen Résolution', 
      value: '4.2h', 
      subtitle: 'par ticket',
      trend: '-8% vs mois dernier',
      icon: 'bi-hourglass-split',
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconBg: 'bg-green-100 dark:bg-green-800',
      textColor: 'text-green-600 dark:text-green-400'
    },
    { 
      title: 'Total Missions', 
      value: '156', 
      subtitle: 'ce mois',
      trend: '+15% vs mois dernier',
      icon: 'bi-flag-fill',
      color: 'purple',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconBg: 'bg-purple-100 dark:bg-purple-800',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    { 
      title: 'Interventions', 
      value: '89', 
      subtitle: 'en cours ce mois',
      trend: '+5% vs mois dernier',
      icon: 'bi-wrench',
      color: 'orange',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconBg: 'bg-orange-100 dark:bg-orange-800',
      textColor: 'text-orange-600 dark:text-orange-400'
    }
  ];

  // Donut Chart Data
  const donutData = [
    { label: 'Dir. Générale', value: 30, color: '#10b981', percentage: 30 },
    { label: 'Dir. Technique', value: 24, color: '#3b82f6', percentage: 24 },
    { label: 'Transport Fonds', value: 10, color: '#8b5cf6', percentage: 10 },
    { label: 'Dir. Commerciale', value: 6, color: '#f59e0b', percentage: 6 },
    { label: 'Autres', value: 30, color: '#9ca3af', percentage: 30 }
  ];

  // Bar Chart — État du Parc
  const barChartData = [
    { month: 'Jan', disponible: 28, enMission: 10, maintenance: 7 },
    { month: 'Fév', disponible: 32, enMission: 8, maintenance: 5 },
    { month: 'Mar', disponible: 26, enMission: 12, maintenance: 7 },
    { month: 'Avr', disponible: 30, enMission: 10, maintenance: 5 },
    { month: 'Mai', disponible: 28, enMission: 11, maintenance: 6 },
    { month: 'Jun', disponible: 30, enMission: 10, maintenance: 5 },
    { month: 'Jul', disponible: 27, enMission: 12, maintenance: 6 },
    { month: 'Aoû', disponible: 32, enMission: 9, maintenance: 4 },
    { month: 'Sep', disponible: 29, enMission: 11, maintenance: 5 },
    { month: 'Oct', disponible: 31, enMission: 10, maintenance: 4 },
    { month: 'Nov', disponible: 27, enMission: 13, maintenance: 5 }
  ];

  // Line Chart — Consommation & Économies
  const lineChartData = [
    { month: 'Jan', consommation: 4000, economies: 150000 },
    { month: 'Mar', consommation: 4500, economies: 170000 },
    { month: 'Avr', consommation: 4800, economies: 185000 },
    { month: 'Mai', consommation: 5200, economies: 200000 },
    { month: 'Jun', consommation: 5500, economies: 215000 },
    { month: 'Jul', consommation: 5800, economies: 230000 },
    { month: 'Sep', consommation: 6000, economies: 250000 },
    { month: 'Oct', consommation: 6200, economies: 270000 },
    { month: 'Nov', consommation: 6800, economies: 300000 },
    { month: 'Déc', consommation: 7000, economies: 330000 }
  ];

  // Interventions Créées vs Résolues (12 mois)
  const interventionsData = [
    { month: 'Jan', creees: 38, resolues: 35 },
    { month: 'Fév', creees: 42, resolues: 38 },
    { month: 'Mar', creees: 45, resolues: 40 },
    { month: 'Avr', creees: 48, resolues: 45 },
    { month: 'Mai', creees: 52, resolues: 48 },
    { month: 'Jun', creees: 48, resolues: 46 },
    { month: 'Jul', creees: 50, resolues: 48 },
    { month: 'Aoû', creees: 46, resolues: 44 },
    { month: 'Sep', creees: 49, resolues: 47 },
    { month: 'Oct', creees: 51, resolues: 49 },
    { month: 'Nov', creees: 53, resolues: 50 },
    { month: 'Déc', creees: 48, resolues: 47 }
  ];

  // Interventions / Jour (semaine en cours)
  const interventionsJourData = [
    { day: 'Lun', count: 12 },
    { day: 'Mar', count: 15 },
    { day: 'Mer', count: 18 },
    { day: 'Jeu', count: 14 },
    { day: 'Ven', count: 20 },
    { day: 'Sam', count: 16 },
    { day: 'Dim', count: 8 }
  ];

  // Users by Role
  const usersRoleData = [
    { role: 'Admin', count: 3, color: '#ef4444' },
    { role: 'Chef Parc', count: 5, color: '#f59e0b' },
    { role: 'Chauffeurs', count: 28, color: '#10b981' },
    { role: 'Chef TF', count: 4, color: '#3b82f6' },
    { role: 'Mécanicien', count: 8, color: '#8b5cf6' },
    { role: 'Chef PC Radio', count: 2, color: '#ec4899' }
  ];

  // Missions Data
  const missions = [
    { id: 'AB-1234-GA', route: 'Franceville - J. Mbourou', time: '08:30', status: 'En cours', icon: 'bi-car-front-fill' },
    { id: 'CD-5678-GA', route: 'Port-Gentil - P. Nzong', time: '07:15', status: 'Terminée', icon: 'bi-truck' },
    { id: 'GH-3456-GA', route: 'Oyem - M. Essono', time: '09:00', status: 'En cours', icon: 'bi-taxi-front-fill' },
    { id: 'MN-5678-GA', route: 'Lambaréné - A. Bongo', time: '06:45', status: 'En cours', icon: 'bi-car-front-fill' }
  ];

  // Alerts Data
  const alerts = [
    { 
      type: 'error', 
      title: 'Assurance expire bientôt', 
      vehicle: 'AB-1234-GA - Toyota Land Cruiser',
      status: 'Dj restants',
      days: '15',
      date: 'Déc 2025',
      icon: 'bi-exclamation-circle-fill'
    },
    { 
      type: 'warning', 
      title: 'Visite technique à renouveler', 
      vehicle: 'CD-5678-GA - Nissan Patrol',
      status: 'Dj restants',
      days: '18',
      date: '22 Déc 2025',
      icon: 'bi-exclamation-triangle-fill'
    },
    { 
      type: 'info', 
      title: 'Vidange à prévoir', 
      vehicle: 'EF-9012-GA - Toyota Hilux',
      status: 'Dj restants',
      days: '20',
      date: 'Dans 800 km',
      icon: 'bi-info-circle-fill'
    }
  ];

  // ──────────────────────────────────────────
  // SHARED CARD WRAPPER — uniform styling for every chart card
  // ──────────────────────────────────────────
  const ChartCard = ({ children, className = '' }) => (
    <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm overflow-hidden ${className}`} style={{ minHeight: '280px' }}>
      <div className="p-5 flex flex-col h-full">
        {children}
      </div>
    </div>
  );

  // ──────────────────────────────────────────
  // SHARED CHART TITLE
  // ──────────────────────────────────────────
  const ChartTitle = ({ children }) => (
    <h3 className={`text-sm font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {children}
    </h3>
  );

  // ──────────────────────────────────────────
  // SHARED LEGEND ROW
  // ──────────────────────────────────────────
  const LegendRow = ({ items }) => (
    <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }}></div>
          <span className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`${darkMode ? 'bg-gray-950' : 'bg-gray-50'} min-h-screen transition-colors duration-300`}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      
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

      <main 
        className="transition-all duration-300 pt-24 px-6 pb-6"
        style={{ marginLeft: sidebarCollapsed ? '5rem' : '18rem' }}
      >
        {/* ─── STATS GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statsCards.map((card, idx) => (
            <div 
              key={idx}
              className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl p-6 border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group`}
              style={{
                animation: animateCharts ? `fadeInUp 0.5s ease-out ${idx * 0.1}s both` : 'none'
              }}
            >
              <style>
                {`
                  @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                  }
                `}
              </style>
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
              {card.trend && (
                <div className={`flex items-center gap-1 text-xs ${card.trend.includes('-') ? 'text-red-600' : 'text-green-600'}`}>
                  <i className={card.trend.includes('-') ? 'bi bi-graph-down-arrow' : 'bi bi-graph-up-arrow'}></i>
                  <span>{card.trend}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ─── ROW 1 : Donut  |  État du Parc  |  Interventions Créées vs Résolues (span 1 each in 3-col) ─── */}
        {/* We use a custom layout: 1fr 1fr 1.4fr so Interventions gets more room */}
        <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: '1fr 1fr 1.4fr' }}>

          {/* ── Donut — Véhicules par Direction ── */}
          <ChartCard>
            <ChartTitle>Véhicules par Direction</ChartTitle>
            <div className="flex-1 flex items-center justify-center relative">
              <svg width="140" height="140" viewBox="0 0 200 200">
                {/* Dir. Générale 30% */}
                <circle cx="100" cy="100" r="70" fill="none" stroke="#10b981" strokeWidth="32"
                  strokeDasharray="131.95 439.82"
                  strokeDashoffset={animateCharts ? 0 : 439.82}
                  onMouseEnter={() => setHoveredSegment('generale')}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className="transition-all duration-200 hover:stroke-opacity-80 cursor-pointer"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
                {/* Dir. Technique 24% */}
                <circle cx="100" cy="100" r="70" fill="none" stroke="#3b82f6" strokeWidth="32"
                  strokeDasharray="105.56 439.82"
                  strokeDashoffset={animateCharts ? -131.95 : -439.82}
                  onMouseEnter={() => setHoveredSegment('technique')}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className="transition-all duration-200 hover:stroke-opacity-80 cursor-pointer"
                  style={{ transition: 'stroke-dashoffset 1s ease-out 0.2s' }}
                />
                {/* Transport Fonds 10% */}
                <circle cx="100" cy="100" r="70" fill="none" stroke="#8b5cf6" strokeWidth="32"
                  strokeDasharray="43.98 439.82"
                  strokeDashoffset={animateCharts ? -237.51 : -439.82}
                  onMouseEnter={() => setHoveredSegment('transport')}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className="transition-all duration-200 hover:stroke-opacity-80 cursor-pointer"
                  style={{ transition: 'stroke-dashoffset 1s ease-out 0.4s' }}
                />
                {/* Dir. Commerciale 6% */}
                <circle cx="100" cy="100" r="70" fill="none" stroke="#f59e0b" strokeWidth="32"
                  strokeDasharray="26.39 439.82"
                  strokeDashoffset={animateCharts ? -281.49 : -439.82}
                  onMouseEnter={() => setHoveredSegment('commerciale')}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className="transition-all duration-200 hover:stroke-opacity-80 cursor-pointer"
                  style={{ transition: 'stroke-dashoffset 1s ease-out 0.6s' }}
                />
                {/* Autres 30% */}
                <circle cx="100" cy="100" r="70" fill="none" stroke="#9ca3af" strokeWidth="32"
                  strokeDasharray="131.95 439.82"
                  strokeDashoffset={animateCharts ? -307.88 : -439.82}
                  onMouseEnter={() => setHoveredSegment('autres')}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className="transition-all duration-200 hover:stroke-opacity-80 cursor-pointer"
                  style={{ transition: 'stroke-dashoffset 1s ease-out 0.8s' }}
                />
              </svg>

              {hoveredSegment && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg shadow-lg text-sm font-bold pointer-events-none z-10">
                  {hoveredSegment === 'generale' && '30%'}
                  {hoveredSegment === 'technique' && '24%'}
                  {hoveredSegment === 'transport' && '10%'}
                  {hoveredSegment === 'commerciale' && '6%'}
                  {hoveredSegment === 'autres' && '30%'}
                </div>
              )}
            </div>

            <div className="space-y-1">
              {donutData.map((item, idx) => (
                <div key={idx} className={`flex items-center justify-between px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.label}</span>
                  </div>
                  <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.percentage}%</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* ── Stacked Bar — État du Parc  (all axes INSIDE SVG) ── */}
          <ChartCard>
            <ChartTitle>État du Parc</ChartTitle>
            <div className="flex-1 flex flex-col justify-center">
              {/* SVG: viewBox includes left Y-axis (40px) and bottom X labels (18px) */}
              <svg width="100%" viewBox="0 0 260 175" className="overflow-visible">
                {/* Y-axis labels — rendered INSIDE the SVG at x=0..35 */}
                {[45, 30, 15, 0].map((val, i) => (
                  <text key={`y-${i}`} x="30" y={22 + i * 38} textAnchor="end" fontSize="9" fill={darkMode ? '#6b7280' : '#9ca3af'}>
                    {val === 0 ? '0' : val}
                  </text>
                ))}

                {/* horizontal grid lines */}
                {[0, 1, 2, 3].map(i => (
                  <line key={`grid-${i}`} x1="36" y1={22 + i * 38} x2="256" y2={22 + i * 38} stroke={darkMode ? '#374151' : '#e5e7eb'} strokeWidth="0.7" />
                ))}

                {/* bars */}
                {barChartData.map((data, idx) => {
                  const maxVal = 45;
                  const chartH = 114; // total height of bar area (3 * 38)
                  const barW = 14;
                  const totalBarAreaW = 220; // 256 - 36
                  const slotW = totalBarAreaW / barChartData.length;
                  const centerX = 36 + slotW * idx + slotW / 2;
                  const x = centerX - barW / 2;
                  const baseY = 136; // bottom of chart area (22 + 3*38)

                  const dH = animateCharts ? (data.disponible / maxVal) * chartH : 0;
                  const mH = animateCharts ? (data.enMission / maxVal) * chartH : 0;
                  const mtH = animateCharts ? (data.maintenance / maxVal) * chartH : 0;

                  return (
                    <g key={idx}
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                      className="cursor-pointer"
                    >
                      {/* Maintenance (bottom) – orange */}
                      <rect x={x} y={baseY - mtH} width={barW} height={mtH} fill="#f97316" rx="2"
                        style={{ transition: `height 0.8s ease-out ${idx*0.07}s, y 0.8s ease-out ${idx*0.07}s` }}
                      />
                      {/* En Mission (middle) – purple */}
                      <rect x={x} y={baseY - mtH - mH} width={barW} height={mH} fill="#a855f7"
                        style={{ transition: `height 0.8s ease-out ${idx*0.07+0.15}s, y 0.8s ease-out ${idx*0.07+0.15}s` }}
                      />
                      {/* Disponible (top) – blue */}
                      <rect x={x} y={baseY - mtH - mH - dH} width={barW} height={dH} fill="#3b82f6" rx="2 2 0 0"
                        style={{ transition: `height 0.8s ease-out ${idx*0.07+0.3}s, y 0.8s ease-out ${idx*0.07+0.3}s` }}
                      />

                      {/* X label */}
                      <text x={centerX} y="158" textAnchor="middle" fontSize="9" fill={darkMode ? '#6b7280' : '#9ca3af'}>
                        {data.month}
                      </text>

                      {/* Tooltip */}
                      {hoveredBar === idx && (
                        <g>
                          <rect x={centerX - 38} y={baseY - mtH - mH - dH - 62} width="76" height="56" rx="6" fill="#1f2937" />
                          <text x={centerX} y={baseY - mtH - mH - dH - 48} textAnchor="middle" fontSize="9" fill="#fff" fontWeight="600">{data.month}</text>
                          <circle cx={centerX - 28} cy={baseY - mtH - mH - dH - 36} r="3" fill="#3b82f6" />
                          <text x={centerX - 22} y={baseY - mtH - mH - dH - 33} fontSize="8" fill="#d1d5db">Disp: {data.disponible}</text>
                          <circle cx={centerX - 28} cy={baseY - mtH - mH - dH - 22} r="3" fill="#a855f7" />
                          <text x={centerX - 22} y={baseY - mtH - mH - dH - 19} fontSize="8" fill="#d1d5db">Miss: {data.enMission}</text>
                          <circle cx={centerX - 28} cy={baseY - mtH - mH - dH - 10} r="3" fill="#f97316" />
                          <text x={centerX - 22} y={baseY - mtH - mH - dH - 7} fontSize="8" fill="#d1d5db">Maint: {data.maintenance}</text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <LegendRow items={[
              { label: 'Disponible', color: '#3b82f6' },
              { label: 'En Mission', color: '#a855f7' },
              { label: 'Maintenance', color: '#f97316' }
            ]} />
          </ChartCard>

          {/* ── Line — Interventions Créées vs Résolues (larger chart area) ── */}
          <ChartCard>
            <ChartTitle>Interventions Créées vs Résolues</ChartTitle>
            <div className="flex-1 flex flex-col justify-center">
              {/*
                SVG layout:
                  Left axis labels  : x = 0..28
                  Chart area        : x = 32 … 340  (width 308)
                  Bottom x-labels   : y = 148..160
                  viewBox height    : 165
              */}
              <svg width="100%" viewBox="0 0 345 165" className="overflow-visible">
                {/* Y-axis labels */}
                {[60, 45, 30, 15, 0].map((val, i) => (
                  <text key={`y-${i}`} x="26" y={18 + i * 30} textAnchor="end" fontSize="9" fill={darkMode ? '#6b7280' : '#9ca3af'}>
                    {val}
                  </text>
                ))}

                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
                  <line key={`g-${i}`} x1="30" y1={18 + i * 30} x2="340" y2={18 + i * 30} stroke={darkMode ? '#374151' : '#e5e7eb'} strokeWidth="0.7" />
                ))}

                {/* helpers */}
                {(() => {
                  const chartLeft = 32;
                  const chartW = 308;
                  const slotW = chartW / (interventionsData.length - 1);
                  const baseY = 138; // bottom grid line  (18 + 4*30)
                  const chartH = 120; // 4 * 30
                  const maxVal = 60;

                  const getX = (i) => chartLeft + i * slotW;
                  const getY = (val) => baseY - (val / maxVal) * chartH;

                  // Créées path
                  const pathC = interventionsData.map((d, i) =>
                    (i === 0 ? 'M' : 'L') + ` ${getX(i)},${getY(d.creees)}`
                  ).join(' ');

                  // Résolues path
                  const pathR = interventionsData.map((d, i) =>
                    (i === 0 ? 'M' : 'L') + ` ${getX(i)},${getY(d.resolues)}`
                  ).join(' ');

                  return (
                    <>
                      {/* Area fill – Créées */}
                      <path
                        d={pathC + ` L ${getX(interventionsData.length - 1)},${baseY} L ${getX(0)},${baseY} Z`}
                        fill="#06b6d4" fillOpacity="0.08"
                      />
                      {/* Area fill – Résolues */}
                      <path
                        d={pathR + ` L ${getX(interventionsData.length - 1)},${baseY} L ${getX(0)},${baseY} Z`}
                        fill="#8b5cf6" fillOpacity="0.08"
                      />

                      {/* Line – Créées */}
                      <path d={pathC} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        style={{
                          strokeDasharray: animateCharts ? '0' : '1000',
                          strokeDashoffset: animateCharts ? '0' : '1000',
                          transition: 'stroke-dashoffset 1.5s ease-out'
                        }}
                      />
                      {/* Line – Résolues */}
                      <path d={pathR} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        style={{
                          strokeDasharray: animateCharts ? '0' : '1000',
                          strokeDashoffset: animateCharts ? '0' : '1000',
                          transition: 'stroke-dashoffset 1.5s ease-out 0.3s'
                        }}
                      />

                      {/* Dots + X labels */}
                      {interventionsData.map((d, i) => {
                        const x = getX(i);
                        const yC = getY(d.creees);
                        const yR = getY(d.resolues);
                        return (
                          <g key={i}
                            onMouseEnter={() => setHoveredInterventionBar(i)}
                            onMouseLeave={() => setHoveredInterventionBar(null)}
                            className="cursor-pointer"
                          >
                            <circle cx={x} cy={yC} r="3.5" fill="#06b6d4" style={{ opacity: animateCharts ? 1 : 0, transition: `opacity 0.3s ease-out ${i*0.08+1}s` }} />
                            <circle cx={x} cy={yR} r="3.5" fill="#8b5cf6" style={{ opacity: animateCharts ? 1 : 0, transition: `opacity 0.3s ease-out ${i*0.08+1.2}s` }} />
                            {/* X label */}
                            <text x={x} y="155" textAnchor="middle" fontSize="9" fill={darkMode ? '#6b7280' : '#9ca3af'}>{d.month}</text>
                          </g>
                        );
                      })}

                      {/* Tooltip */}
                      {hoveredInterventionBar !== null && (() => {
                        const i = hoveredInterventionBar;
                        const d = interventionsData[i];
                        const tx = getX(i);
                        const ty = Math.min(getY(d.creees), getY(d.resolues)) - 50;
                        return (
                          <g>
                            <rect x={tx - 38} y={ty} width="76" height="42" rx="6" fill="#1f2937" />
                            <text x={tx} y={ty + 14} textAnchor="middle" fontSize="9" fill="#fff" fontWeight="600">{d.month}</text>
                            <circle cx={tx - 28} cy={ty + 26} r="3" fill="#06b6d4" />
                            <text x={tx - 22} y={ty + 29} fontSize="8" fill="#d1d5db">C: {d.creees}</text>
                            <circle cx={tx + 6} cy={ty + 26} r="3" fill="#8b5cf6" />
                            <text x={tx + 12} y={ty + 29} fontSize="8" fill="#d1d5db">R: {d.resolues}</text>
                          </g>
                        );
                      })()}
                    </>
                  );
                })()}
              </svg>
            </div>

            <LegendRow items={[
              { label: 'Créées', color: '#06b6d4' },
              { label: 'Résolues', color: '#8b5cf6' }
            ]} />
          </ChartCard>
        </div>

        {/* ─── ROW 2 : Interventions/Jour  |  Utilisateurs par Rôle  |  Consommation & Économies ─── */}
        <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: '1fr 1fr 1.4fr' }}>

          {/* ── Bar — Interventions / Jour ── */}
          <ChartCard>
            <ChartTitle>Interventions / Jour</ChartTitle>
            <div className="flex-1 flex flex-col justify-center">
              <svg width="100%" viewBox="0 0 200 155" className="overflow-visible">
                {/* Y-axis labels */}
                {[20, 15, 10, 5, 0].map((val, i) => (
                  <text key={`y-${i}`} x="22" y={16 + i * 28} textAnchor="end" fontSize="9" fill={darkMode ? '#6b7280' : '#9ca3af'}>
                    {val}
                  </text>
                ))}
                {/* Grid */}
                {[0,1,2,3,4].map(i => (
                  <line key={`g-${i}`} x1="26" y1={16 + i*28} x2="196" y2={16 + i*28} stroke={darkMode ? '#374151' : '#e5e7eb'} strokeWidth="0.7" />
                ))}

                {(() => {
                  const chartLeft = 28;
                  const chartW = 168;
                  const slotW = chartW / interventionsJourData.length;
                  const baseY = 128; // 16 + 4*28
                  const chartH = 112; // 4*28
                  const maxVal = 22;

                  return interventionsJourData.map((d, idx) => {
                    const centerX = chartLeft + slotW * idx + slotW / 2;
                    const barW = 10;
                    const x = centerX - barW / 2;
                    const h = animateCharts ? (d.count / maxVal) * chartH : 0;

                    return (
                      <g key={idx}
                        onMouseEnter={() => setHoveredDayBar(idx)}
                        onMouseLeave={() => setHoveredDayBar(null)}
                        className="cursor-pointer"
                      >
                        <defs>
                          <linearGradient id={`dayGrad-${idx}`} x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                        </defs>
                        <rect x={x} y={baseY - h} width={barW} height={h} fill={`url(#dayGrad-${idx})`} rx="3"
                          style={{ transition: `height 0.8s ease-out ${idx*0.1}s, y 0.8s ease-out ${idx*0.1}s` }}
                        />
                        <text x={centerX} y="147" textAnchor="middle" fontSize="9" fill={darkMode ? '#6b7280' : '#9ca3af'}>{d.day}</text>

                        {hoveredDayBar === idx && (
                          <g>
                            <rect x={centerX - 28} y={baseY - h - 34} width="56" height="26" rx="5" fill="#1f2937" />
                            <text x={centerX} y={baseY - h - 20} textAnchor="middle" fontSize="8" fill="#fff" fontWeight="600">{d.day}</text>
                            <text x={centerX} y={baseY - h - 9} textAnchor="middle" fontSize="8" fill="#d1d5db">{d.count} interv.</text>
                          </g>
                        )}
                      </g>
                    );
                  });
                })()}
              </svg>
            </div>

            <LegendRow items={[{ label: 'Interventions', color: '#06b6d4' }]} />
          </ChartCard>

          {/* ── Bar — Utilisateurs par Rôle  (ALL 6 legends) ── */}
          <ChartCard>
            <ChartTitle>Utilisateurs par Rôle</ChartTitle>
            <div className="flex-1 flex flex-col justify-center">
              <svg width="100%" viewBox="0 0 220 155" className="overflow-visible">
                {/* Y-axis labels */}
                {[30, 22, 15, 8, 0].map((val, i) => (
                  <text key={`y-${i}`} x="22" y={16 + i*28} textAnchor="end" fontSize="9" fill={darkMode ? '#6b7280' : '#9ca3af'}>
                    {val}
                  </text>
                ))}
                {/* Grid */}
                {[0,1,2,3,4].map(i => (
                  <line key={`g-${i}`} x1="26" y1={16 + i*28} x2="216" y2={16 + i*28} stroke={darkMode ? '#374151' : '#e5e7eb'} strokeWidth="0.7" />
                ))}

                {(() => {
                  const chartLeft = 28;
                  const chartW = 188;
                  const slotW = chartW / usersRoleData.length;
                  const baseY = 128;
                  const chartH = 112;
                  const maxVal = 30;

                  return usersRoleData.map((d, idx) => {
                    const centerX = chartLeft + slotW * idx + slotW / 2;
                    const barW = 12;
                    const x = centerX - barW / 2;
                    const h = animateCharts ? (d.count / maxVal) * chartH : 0;

                    return (
                      <g key={idx}
                        onMouseEnter={() => setHoveredRoleBar(idx)}
                        onMouseLeave={() => setHoveredRoleBar(null)}
                        className="cursor-pointer"
                      >
                        <rect x={x} y={baseY - h} width={barW} height={h} fill={d.color} rx="3"
                          style={{ transition: `height 0.8s ease-out ${idx*0.1}s, y 0.8s ease-out ${idx*0.1}s` }}
                        />
                        {/* X-label – short version */}
                        <text x={centerX} y="147" textAnchor="middle" fontSize="7.5" fill={darkMode ? '#6b7280' : '#9ca3af'}>
                          {d.role.length > 8 ? d.role.slice(0, 7) + '…' : d.role}
                        </text>

                        {hoveredRoleBar === idx && (
                          <g>
                            <rect x={centerX - 36} y={baseY - h - 34} width="72" height="26" rx="5" fill="#1f2937" />
                            <text x={centerX} y={baseY - h - 20} textAnchor="middle" fontSize="8" fill="#fff" fontWeight="600">{d.role}</text>
                            <text x={centerX} y={baseY - h - 9} textAnchor="middle" fontSize="8" fill="#d1d5db">{d.count} utilisateurs</text>
                          </g>
                        )}
                      </g>
                    );
                  });
                })()}
              </svg>
            </div>

            {/* ALL 6 roles shown — split into 2 rows of 3 for readability */}
            <div className="flex flex-col gap-1.5 mt-3">
              <div className="flex items-center justify-center gap-3">
                {usersRoleData.slice(0, 3).map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }}></div>
                    <span className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{d.role}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-3">
                {usersRoleData.slice(3).map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }}></div>
                    <span className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{d.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          {/* ── Combined Bar+Line — Consommation & Économies ── */}
          <ChartCard>
            <ChartTitle>Consommation & Économies</ChartTitle>
            <div className="flex-1 flex flex-col justify-center">
              {/*
                Layout:
                  Left Y  (consommation) : x 0..32
                  Right Y (économies)    : x 310..345
                  Chart area             : 34..308
                  Bottom labels          : y 148..162
              */}
              <svg width="100%" viewBox="0 0 350 165" className="overflow-visible">
                {/* Left Y labels – consommation */}
                {[8000, 6000, 4000, 2000, 0].map((val, i) => (
                  <text key={`ly-${i}`} x="30" y={18 + i*30} textAnchor="end" fontSize="9" fill={darkMode ? '#6b7280' : '#9ca3af'}>
                    {val}
                  </text>
                ))}
                {/* Right Y labels – économies */}
                {['400k','300k','200k','100k','0'].map((val, i) => (
                  <text key={`ry-${i}`} x="342" y={18 + i*30} textAnchor="start" fontSize="9" fill={darkMode ? '#6b7280' : '#9ca3af'}>
                    {val}
                  </text>
                ))}
                {/* Grid */}
                {[0,1,2,3,4].map(i => (
                  <line key={`g-${i}`} x1="34" y1={18+i*30} x2="308" y2={18+i*30} stroke={darkMode ? '#374151' : '#e5e7eb'} strokeWidth="0.7" />
                ))}

                {(() => {
                  const chartLeft = 36;
                  const chartW = 272;
                  const slotW = chartW / lineChartData.length;
                  const baseY = 138;
                  const chartH = 120;

                  const getBarX = (i) => chartLeft + slotW * i + slotW / 2 - 5;
                  const getLineX = (i) => chartLeft + slotW * i + slotW / 2;
                  const getBarY = (val) => baseY - (val / 8000) * chartH;
                  const getLineY = (val) => baseY - (val / 400000) * chartH;

                  // Économies line path
                  const econPath = lineChartData.map((d, i) =>
                    (i === 0 ? 'M' : 'L') + ` ${getLineX(i)},${getLineY(d.economies)}`
                  ).join(' ');

                  return (
                    <>
                      {/* Green bars */}
                      {lineChartData.map((d, i) => {
                        const x = getBarX(i);
                        const h = animateCharts ? (d.consommation / 8000) * chartH : 0;
                        return (
                          <rect key={`bar-${i}`}
                            x={x} y={baseY - h} width={10} height={h} fill="#10b981" rx="2"
                            onMouseEnter={() => setHoveredMonth(i)}
                            onMouseLeave={() => setHoveredMonth(null)}
                            className="cursor-pointer hover:fill-emerald-600 transition-colors"
                            style={{ transition: `height 0.8s ease-out ${i*0.08}s, y 0.8s ease-out ${i*0.08}s` }}
                          />
                        );
                      })}

                      {/* Orange line */}
                      <path d={econPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        style={{
                          strokeDasharray: animateCharts ? '0' : '1000',
                          strokeDashoffset: animateCharts ? '0' : '1000',
                          transition: 'stroke-dashoffset 1.5s ease-out 0.5s'
                        }}
                      />

                      {/* Orange dots + X labels */}
                      {lineChartData.map((d, i) => {
                        const x = getLineX(i);
                        const y = getLineY(d.economies);
                        return (
                          <g key={`dot-${i}`}
                            onMouseEnter={() => setHoveredMonth(i)}
                            onMouseLeave={() => setHoveredMonth(null)}
                            className="cursor-pointer"
                          >
                            <circle cx={x} cy={y} r="3.5" fill="#f59e0b"
                              style={{ opacity: animateCharts ? 1 : 0, transition: `opacity 0.3s ease-out ${i*0.08+1.5}s` }}
                            />
                            <text x={x} y="155" textAnchor="middle" fontSize="9" fill={darkMode ? '#6b7280' : '#9ca3af'}>{d.month}</text>
                          </g>
                        );
                      })}

                      {/* Tooltip */}
                      {hoveredMonth !== null && (() => {
                        const i = hoveredMonth;
                        const d = lineChartData[i];
                        const tx = getLineX(i);
                        const ty = getBarY(d.consommation) - 48;
                        return (
                          <g>
                            <rect x={tx - 44} y={ty} width="88" height="42" rx="6" fill="#1f2937" />
                            <text x={tx} y={ty + 14} textAnchor="middle" fontSize="9" fill="#fff" fontWeight="600">{d.month}</text>
                            <circle cx={tx - 36} cy={ty + 28} r="3" fill="#10b981" />
                            <text x={tx - 30} y={ty + 31} fontSize="8" fill="#d1d5db">{d.consommation} L</text>
                            <circle cx={tx + 4} cy={ty + 28} r="3" fill="#f59e0b" />
                            <text x={tx + 10} y={ty + 31} fontSize="8" fill="#d1d5db">{(d.economies/1000).toFixed(0)}k</text>
                          </g>
                        );
                      })()}
                    </>
                  );
                })()}
              </svg>
            </div>

            <LegendRow items={[
              { label: 'Consommation (L)', color: '#10b981' },
              { label: 'Économies (CFA)', color: '#f59e0b' }
            ]} />
          </ChartCard>
        </div>

        {/* ─── BOTTOM ROW : Missions du Jour  |  Alertes ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Missions du Jour */}
          <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl p-6 border shadow-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                <i className="bi bi-pin-map-fill text-blue-500"></i>
                Missions du Jour
              </h3>
              <span className={`text-sm px-3 py-1 rounded-full ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                4 missions
              </span>
            </div>
            <div className="space-y-3">
              {missions.map((mission, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'
                  } transition-all cursor-pointer group`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <i className={mission.icon} style={{ fontSize: '2rem' }}></i>
                    </div>
                    <div>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {mission.id}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {mission.route}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <i className={`bi bi-clock ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}></i>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {mission.time}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      mission.status === 'En cours' 
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' 
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {mission.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alertes */}
          <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl p-6 border shadow-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                <i className="bi bi-exclamation-triangle-fill text-red-500"></i>
                Alertes
              </h3>
              <span className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </div>
            <div className="space-y-3">
              {alerts.map((alert, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.type === 'error' 
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                      : alert.type === 'warning'
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  } hover:scale-[1.02] transition-transform cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <i 
                      className={`${alert.icon} ${
                        alert.type === 'error' 
                          ? 'text-red-500' 
                          : alert.type === 'warning'
                          ? 'text-yellow-500'
                          : 'text-blue-500'
                      }`}
                      style={{ fontSize: '1.5rem' }}
                    ></i>
                    <div className="flex-1">
                      <p className={`font-semibold text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {alert.title}
                      </p>
                      <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {alert.vehicle}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          alert.type === 'error' 
                            ? 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200' 
                            : alert.type === 'warning'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                        }`}>
                          {alert.days} {alert.status}
                        </span>
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {alert.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className={`w-full mt-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
              darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors`}>
              Voir toutes les alertes
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-8 py-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center justify-center">
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              © 2026 SGS Tous droits reservés - Version 1.0
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;