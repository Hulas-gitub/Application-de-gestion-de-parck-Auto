
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

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
// UTILITAIRES D'EXPORT
// ============================================================================
const exportToExcel = (data, filename, headers) => {
  let csv = '\uFEFF'; // BOM UTF-8
  csv += headers.join(';') + '\n';
  data.forEach(row => {
    csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';') + '\n';
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

const exportToPDF = (title, headers, data, orientation = 'landscape') => {
  const win = window.open('', '_blank');
  if (!win) return;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
  <style>
    @page { size: ${orientation}; margin: 20mm; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; padding: 20px; }
    h1 { color: #1a1a2e; font-size: 22px; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px; }
    .meta { color: #64748b; font-size: 12px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #1e3a5f; color: #fff; padding: 10px 12px; text-align: left; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
    td { padding: 8px 12px; border-bottom: 1px solid #e2e8f0; }
    tr:nth-child(odd) td { background: #f0f4ff; }
    tr:nth-child(even) td { background: #f8fafc; }
    .footer { margin-top: 30px; text-align: center; color: #94a3b8; font-size: 11px; border-top: 1px solid #e2e8f0; padding-top: 10px; }
  </style></head><body>
  <h1>${title}</h1>
  <div class="meta">Export le ${new Date().toLocaleDateString('fr-FR')} a ${new Date().toLocaleTimeString('fr-FR')}</div>
  <table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
  <tbody>${data.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table>
  <div class="footer">SGS - Systeme de Gestion des Vehicules - ${new Date().getFullYear()}</div>
  <script>window.onload=function(){window.print();}</script></body></html>`;
  win.document.write(html);
  win.document.close();
};

const exportChartToPDF = (title, chartData, chartType) => {
  const win = window.open('', '_blank');
  if (!win) return;
  const tableRows = chartData.map(d => `<tr><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:500;">${d.name || d.label}</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right;">${d.value !== undefined ? d.value : ''}</td></tr>`).join('');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1a1a2e; }
    h1 { font-size: 22px; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
    .meta { color: #64748b; font-size: 12px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #1e3a5f; color: #fff; padding: 10px 12px; text-align: left; }
    .footer { margin-top: 30px; text-align: center; color: #94a3b8; font-size: 11px; border-top: 1px solid #e2e8f0; padding-top: 10px; }
  </style></head><body>
  <h1>${title}</h1>
  <div class="meta">Type: ${chartType} | Export le ${new Date().toLocaleDateString('fr-FR')}</div>
  <table><thead><tr><th>Element</th><th style="text-align:right;">Valeur</th></tr></thead><tbody>${tableRows}</tbody></table>
  <div class="footer">SGS - Systeme de Gestion des Vehicules</div>
  <script>window.onload=function(){window.print();}</script></body></html>`;
  win.document.write(html);
  win.document.close();
};

const exportChartToExcel = (title, chartData) => {
  const headers = ['Element', 'Valeur'];
  const rows = chartData.map(d => [d.name || d.label, d.value !== undefined ? d.value : '']);
  exportToExcel(rows, title, headers);
};

// ============================================================================
// CHART EXPORT DROPDOWN COMPONENT
// ============================================================================
const ChartExportButton = ({ title, chartData, chartType, darkMode, theme }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
        title="Exporter ce graphique">
        <i className="bi bi-download"></i>
      </button>
      {open && (
        <div className={`absolute right-0 top-full mt-1 z-50 rounded-lg shadow-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} py-1 min-w-[140px]`}>
          <button onClick={() => { exportChartToExcel(title, chartData); setOpen(false); }}
            className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}>
            <i className="bi bi-file-earmark-spreadsheet text-green-500"></i> Excel (CSV)
          </button>
          <button onClick={() => { exportChartToPDF(title, chartData, chartType); setOpen(false); }}
            className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}>
            <i className="bi bi-file-earmark-pdf text-red-500"></i> PDF
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MINI SVG BAR CHART COMPONENT (barres groupees)
// ============================================================================
const BarChartGrouped = ({ data, colors, darkMode, theme, title }) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const barWidth = data.length > 6 ? 32 : 44;
  const gap = data.length > 6 ? 12 : 18;
  const chartW = data.length * (barWidth + gap) + gap;
  const chartH = 220;
  const padTop = 20;
  const padBottom = 50;
  const padLeft = 50;
  const drawH = chartH - padTop - padBottom;

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="relative w-full overflow-x-auto">
      <svg ref={svgRef} width={Math.max(chartW + padLeft + 20, 300)} height={chartH} className="w-full" viewBox={`0 0 ${Math.max(chartW + padLeft + 20, 300)} ${chartH}`} preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {gridLines.map((pct, i) => {
          const y = padTop + drawH - drawH * pct;
          return (
            <g key={i}>
              <line x1={padLeft} y1={y} x2={Math.max(chartW + padLeft, 280)} y2={y} stroke={darkMode ? '#374151' : '#e5e7eb'} strokeWidth="1" strokeDasharray={i === 0 ? '0' : '4,4'} />
              <text x={padLeft - 8} y={y + 4} textAnchor="end" fill={darkMode ? '#9ca3af' : '#6b7280'} fontSize="10" fontFamily="sans-serif">
                {Math.round(maxVal * pct)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const barH = (d.value / maxVal) * drawH;
          const x = padLeft + gap + i * (barWidth + gap);
          const y = padTop + drawH - barH;
          const isHovered = hoveredBar === i;
          return (
            <g key={i}
              onMouseEnter={(e) => {
                setHoveredBar(i);
                const rect = svgRef.current.getBoundingClientRect();
                setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
              }}
              onMouseMove={(e) => {
                const rect = svgRef.current.getBoundingClientRect();
                setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
              }}
              onMouseLeave={() => setHoveredBar(null)}
              style={{ cursor: 'pointer' }}
            >
              <defs>
                <linearGradient id={`bar-grad-${title}-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors[i % colors.length]} stopOpacity="1" />
                  <stop offset="100%" stopColor={colors[i % colors.length]} stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <rect
                x={x} y={y} width={barWidth} height={barH}
                rx="4" ry="4"
                fill={`url(#bar-grad-${title}-${i})`}
                opacity={isHovered ? 1 : 0.85}
                style={{ transition: 'opacity 0.2s, filter 0.2s', filter: isHovered ? 'brightness(1.2) drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'none' }}
              />
              {/* Value on top of bar */}
              <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fill={darkMode ? '#d1d5db' : '#374151'} fontSize="10" fontWeight="600" fontFamily="sans-serif">
                {d.value}
              </text>
              {/* Label below */}
              <text x={x + barWidth / 2} y={chartH - padBottom + 16} textAnchor="middle" fill={darkMode ? '#9ca3af' : '#6b7280'} fontSize="9" fontFamily="sans-serif"
                transform={`rotate(-20, ${x + barWidth / 2}, ${chartH - padBottom + 16})`}>
                {d.name.length > 8 ? d.name.slice(0, 8) + '..' : d.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredBar !== null && data[hoveredBar] && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{ left: tooltipPos.x + 12, top: tooltipPos.y - 50 }}
        >
          <div className={`px-3 py-2 rounded-lg shadow-xl border text-xs ${darkMode ? 'bg-gray-900 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
            style={{ borderLeft: `3px solid ${colors[hoveredBar % colors.length]}` }}>
            <p className="font-bold">{data[hoveredBar].name}</p>
            <p style={{ color: colors[hoveredBar % colors.length] }} className="font-semibold mt-0.5">{data[hoveredBar].value} {data[hoveredBar].unit || ''}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// DONUT / PIE CHART COMPONENT
// ============================================================================
const DonutChart = ({ data, colors, darkMode, theme, title, size = 180 }) => {
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 8;
  const innerR = outerR * 0.55;

  let cumAngle = -90;
  const slices = data.map((d, i) => {
    const angle = total > 0 ? (d.value / total) * 360 : 0;
    const start = cumAngle;
    cumAngle += angle;
    return { ...d, startAngle: start, endAngle: start + angle, color: colors[i % colors.length] };
  });

  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (cx, cy, r, startAngle, endAngle) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  };

  return (
    <div className="flex items-center gap-4" ref={containerRef}>
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {slices.map((slice, i) => {
            if (slice.endAngle - slice.startAngle < 0.5) return null;
            const isHov = hoveredSlice === i;
            // Full arc path
            const s1 = polarToCartesian(cx, cy, outerR, slice.startAngle);
            const e1 = polarToCartesian(cx, cy, outerR, slice.endAngle);
            const s2 = polarToCartesian(cx, cy, innerR, slice.endAngle);
            const e2 = polarToCartesian(cx, cy, innerR, slice.startAngle);
            const large = slice.endAngle - slice.startAngle > 180 ? 1 : 0;
            const d = `M ${s1.x} ${s1.y} A ${outerR} ${outerR} 0 ${large} 1 ${e1.x} ${e1.y} L ${s2.x} ${s2.y} A ${innerR} ${innerR} 0 ${large} 0 ${e2.x} ${e2.y} Z`;
            return (
              <path key={i} d={d} fill={slice.color}
                opacity={isHov ? 1 : 0.85}
                style={{ transition: 'opacity 0.2s, transform 0.2s, filter 0.2s', filter: isHov ? 'brightness(1.2) drop-shadow(0 2px 8px rgba(0,0,0,0.3))' : 'none', transformOrigin: `${cx}px ${cy}px`, transform: isHov ? 'scale(1.05)' : 'scale(1)' }}
                onMouseEnter={(e) => {
                  setHoveredSlice(i);
                  const rect = containerRef.current.getBoundingClientRect();
                  setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
                onMouseMove={(e) => {
                  const rect = containerRef.current.getBoundingClientRect();
                  setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
                onMouseLeave={() => setHoveredSlice(null)}
                cursor="pointer"
              />
            );
          })}
          {/* Center text */}
          <text x={cx} y={cy - 6} textAnchor="middle" fill={darkMode ? '#fff' : '#1f2937'} fontSize="14" fontWeight="700" fontFamily="sans-serif">Total</text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill={darkMode ? '#9ca3af' : '#6b7280'} fontSize="18" fontWeight="800" fontFamily="sans-serif">{total}</text>
        </svg>

        {/* Tooltip */}
        {hoveredSlice !== null && data[hoveredSlice] && (
          <div className="absolute z-50 pointer-events-none" style={{ left: tooltipPos.x + 12, top: tooltipPos.y - 50 }}>
            <div className={`px-3 py-2 rounded-lg shadow-xl border text-xs ${darkMode ? 'bg-gray-900 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
              style={{ borderLeft: `3px solid ${colors[hoveredSlice % colors.length]}` }}>
              <p className="font-bold">{data[hoveredSlice].name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span style={{ color: colors[hoveredSlice % colors.length] }} className="font-semibold">{data[hoveredSlice].value}</span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>({total > 0 ? ((data[hoveredSlice].value / total) * 100).toFixed(1) : 0}%)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-1.5">
        {data.map((d, i) => (
          <div key={i} className={`flex items-center gap-2 text-xs ${hoveredSlice === i ? 'opacity-100' : 'opacity-80'} transition-opacity cursor-pointer`}
            onMouseEnter={() => setHoveredSlice(i)}
            onMouseLeave={() => setHoveredSlice(null)}>
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: colors[i % colors.length] }}></div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{d.name}:</span>
            <span className="font-bold" style={{ color: colors[i % colors.length] }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// RADIAL BAR CHART COMPONENT
// ============================================================================
const RadialBarChart = ({ data, colors, darkMode, size = 170 }) => {
  const [hovered, setHovered] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const cx = size / 2;
  const cy = size / 2;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const barW = data.length <= 3 ? 14 : 10;
  const gapR = data.length <= 3 ? 4 : 3;
  const baseR = size / 2 - 10;

  const polarToCartesian = (cx, cy, r, deg) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  return (
    <div className="flex items-center gap-4" ref={containerRef}>
      <div className="relative">
        <svg width={size} height={size}>
          {data.map((d, i) => {
            const r = baseR - i * (barW + gapR);
            if (r < 15) return null;
            const angle = (d.value / maxVal) * 270;
            const startAngle = -225;
            const endAngle = startAngle + angle;
            const s = polarToCartesian(cx, cy, r, startAngle);
            const e = polarToCartesian(cx, cy, r, endAngle);
            const large = angle > 180 ? 1 : 0;
            const isHov = hovered === i;
            return (
              <g key={i}>
                {/* Background track */}
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={darkMode ? '#1f2937' : '#e5e7eb'} strokeWidth={barW} opacity="0.5" />
                {/* Value arc */}
                <path
                  d={`M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`}
                  fill="none" stroke={colors[i % colors.length]} strokeWidth={barW} strokeLinecap="round"
                  opacity={isHov ? 1 : 0.85}
                  style={{ transition: 'opacity 0.2s, filter 0.2s', filter: isHov ? 'brightness(1.2) drop-shadow(0 2px 6px rgba(0,0,0,0.3))' : 'none' }}
                  onMouseEnter={(e) => {
                    setHovered(i);
                    const rect = containerRef.current.getBoundingClientRect();
                    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                  }}
                  onMouseMove={(e) => {
                    const rect = containerRef.current.getBoundingClientRect();
                    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                  }}
                  onMouseLeave={() => setHovered(null)}
                  cursor="pointer"
                />
              </g>
            );
          })}
          <text x={cx} y={cy - 4} textAnchor="middle" fill={darkMode ? '#fff' : '#1f2937'} fontSize="11" fontWeight="700">Total</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fill={darkMode ? '#9ca3af' : '#6b7280'} fontSize="14" fontWeight="800">{data.reduce((s, d) => s + d.value, 0)}</text>
        </svg>

        {hovered !== null && data[hovered] && (
          <div className="absolute z-50 pointer-events-none" style={{ left: tooltipPos.x + 12, top: tooltipPos.y - 40 }}>
            <div className={`px-3 py-2 rounded-lg shadow-xl border text-xs ${darkMode ? 'bg-gray-900 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
              style={{ borderLeft: `3px solid ${colors[hovered % colors.length]}` }}>
              <p className="font-bold">{data[hovered].name}</p>
              <p style={{ color: colors[hovered % colors.length] }} className="font-semibold mt-0.5">{data[hovered].value}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        {data.map((d, i) => (
          <div key={i} className={`flex items-center gap-2 text-xs ${hovered === i ? 'opacity-100' : 'opacity-80'} transition-opacity cursor-pointer`}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: colors[i % colors.length] }}></div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{d.name}:</span>
            <span className="font-bold" style={{ color: colors[i % colors.length] }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
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
// VEHICLE EXPORT DROPDOWN
// ============================================================================
const VehicleExportDropdown = ({ vehicles, filteredVehicles, darkMode, theme, showToast }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const vHeaders = ['Immatriculation', 'Marque', 'Modele', 'Categorie', 'Annee', 'Kilometrage', 'Statut', 'Chauffeur', 'Direction', 'Carburant', 'Puissance', 'Couleur', 'Date Achat', 'Prix Achat (CFA)'];
  const vToRow = (v) => [v.immatriculation, v.marque, v.modele, v.categorie, v.annee, v.kilometrage, v.statut, v.chauffeur || '-', v.direction, v.carburant, v.puissance, v.couleur, v.dateAchat || '-', v.prixAchat ? v.prixAchat.toLocaleString() : '-'];

  const exportAll = (format) => {
    const rows = filteredVehicles.map(vToRow);
    if (format === 'excel') { exportToExcel(rows, 'Vehicules_Tous', vHeaders); }
    else { exportToPDF('Liste Complete des Vehicules', vHeaders, rows); }
    showToast(`Export ${format === 'excel' ? 'Excel' : 'PDF'} effectue`, 'success');
    setOpen(false);
  };

  const exportByGroup = (groupKey, format) => {
    const groups = {};
    filteredVehicles.forEach(v => {
      const key = v[groupKey];
      if (!groups[key]) groups[key] = [];
      groups[key].push(v);
    });
    const label = { marque: 'Marque', categorie: 'Categorie', modele: 'Modele', statut: 'Statut' }[groupKey];
    Object.entries(groups).forEach(([name, list]) => {
      const rows = list.map(vToRow);
      const titleSuffix = `${label}: ${name} (${list.length} vehicule${list.length > 1 ? 's' : ''})`;
      if (format === 'excel') { exportToExcel(rows, `Vehicules_${label}_${name}`, vHeaders); }
      else { exportToPDF(`Vehicules - ${titleSuffix}`, vHeaders, rows); }
    });
    showToast(`Export par ${label} (${format === 'excel' ? 'Excel' : 'PDF'}) effectue - vehicules detailles inclus`, 'success');
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
        <i className="bi bi-download"></i> Exporter
      </button>
      {open && (
        <div className={`absolute right-0 top-full mt-1 z-50 rounded-xl shadow-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} py-2 min-w-[260px]`}>
          <p className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Tous les vehicules</p>
          <button onClick={() => exportAll('excel')} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2.5 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}>
            <i className="bi bi-file-earmark-spreadsheet text-green-500"></i> Exporter en Excel (CSV)
          </button>
          <button onClick={() => exportAll('pdf')} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2.5 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}>
            <i className="bi bi-file-earmark-pdf text-red-500"></i> Exporter en PDF
          </button>

          <div className={`my-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
          <p className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Par Marque</p>
          <button onClick={() => exportByGroup('marque', 'excel')} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2.5 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}>
            <i className="bi bi-file-earmark-spreadsheet text-green-500"></i> Par Marque - Excel
          </button>
          <button onClick={() => exportByGroup('marque', 'pdf')} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2.5 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}>
            <i className="bi bi-file-earmark-pdf text-red-500"></i> Par Marque - PDF
          </button>

          <div className={`my-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
          <p className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Par Categorie</p>
          <button onClick={() => exportByGroup('categorie', 'excel')} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2.5 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}>
            <i className="bi bi-file-earmark-spreadsheet text-green-500"></i> Par Categorie - Excel
          </button>
          <button onClick={() => exportByGroup('categorie', 'pdf')} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2.5 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}>
            <i className="bi bi-file-earmark-pdf text-red-500"></i> Par Categorie - PDF
          </button>

          <div className={`my-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
          <p className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Par Modele</p>
          <button onClick={() => exportByGroup('modele', 'excel')} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2.5 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}>
            <i className="bi bi-file-earmark-spreadsheet text-green-500"></i> Par Modele - Excel
          </button>
          <button onClick={() => exportByGroup('modele', 'pdf')} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2.5 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}>
            <i className="bi bi-file-earmark-pdf text-red-500"></i> Par Modele - PDF
          </button>

          <div className={`my-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
          <p className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Par Statut</p>
          <button onClick={() => exportByGroup('statut', 'excel')} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2.5 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}>
            <i className="bi bi-file-earmark-spreadsheet text-green-500"></i> Par Statut - Excel
          </button>
          <button onClick={() => exportByGroup('statut', 'pdf')} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2.5 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}>
            <i className="bi bi-file-earmark-pdf text-red-500"></i> Par Statut - PDF
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// TABLE EXPORT BUTTON
// ============================================================================
const TableExportButton = ({ filteredVehicles, darkMode, theme, showToast }) => {
  const handleExport = () => {
    const headers = ['Immatriculation', 'Marque', 'Modele', 'Categorie', 'Annee', 'Kilometrage', 'Statut', 'Chauffeur', 'Direction'];
    const rows = filteredVehicles.map(v => [v.immatriculation, v.marque, v.modele, v.categorie, v.annee, v.kilometrage, v.statut, v.chauffeur || '-', v.direction]);
    exportToExcel(rows, 'Tableau_Vehicules', headers);
    showToast('Tableau exporte en Excel', 'success');
  };

  return (
    <button onClick={handleExport}
      className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${darkMode ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
      title="Exporter le tableau en Excel">
      <i className="bi bi-file-earmark-spreadsheet"></i> Excel
    </button>
  );
};


// ============================================================================
// MAIN COMPONENT
// ============================================================================
const Vehicules = () => {
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

  // ── Gestion des filtres ──
  const [showFilterManagement, setShowFilterManagement] = useState(false);
  const [filterManagementTab, setFilterManagementTab] = useState('categories');
  const [customCategories, setCustomCategories] = useState([...categories]);
  const [customMarques, setCustomMarques] = useState([...marques]);
  const [customModeles, setCustomModeles] = useState({ ...modeles });
  const [newCategory, setNewCategory] = useState('');
  const [newMarque, setNewMarque] = useState('');
  const [selectedMarqueForModel, setSelectedMarqueForModel] = useState('');
  const [newModele, setNewModele] = useState('');

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
  const availableModeles = filterMarque ? customModeles[filterMarque] || [] : [];
  const formAvailableModeles = formData.marque ? customModeles[formData.marque] || [] : [];

  // ── Handlers ──
  const showToast = (message, type) => setToast({ message, type });

  const handleAddVehicle = () => {
    setVehicles([...vehicles, { ...formData, id: Date.now().toString(), image: formData.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400' }]);
    setShowAddModal(false); resetForm();
    showToast('Vehicule ajoute avec succes', 'success');
  };

  const handleEditVehicle = () => {
    if (selectedVehicle) {
      setVehicles(vehicles.map(v => v.id === selectedVehicle.id ? { ...v, ...formData } : v));
      setShowEditModal(false); setSelectedVehicle(null); resetForm();
      showToast('Vehicule modifie avec succes', 'success');
    }
  };

  const handleDeleteVehicle = () => {
    if (vehicleToDelete) {
      setVehicles(vehicles.filter(v => v.id !== vehicleToDelete.id));
      setShowDeleteConfirm(false); setVehicleToDelete(null);
      showToast('Vehicule supprime avec succes', 'success');
    }
  };

  const handleChangeStatut = (vehicle, newStatut) => {
    setVehicles(vehicles.map(v => v.id === vehicle.id ? { ...v, statut: newStatut } : v));
    setActiveMenu(null);
    showToast(`Statut change en "${newStatut}"`, 'success');
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !customCategories.includes(newCategory.trim())) {
      setCustomCategories([...customCategories, newCategory.trim()]);
      setNewCategory('');
      showToast('Categorie ajoutee avec succes', 'success');
    }
  };

  const handleDeleteCategory = (category) => {
    setCustomCategories(customCategories.filter(c => c !== category));
    showToast('Categorie supprimee avec succes', 'success');
  };

  const handleAddMarque = () => {
    if (newMarque.trim() && !customMarques.includes(newMarque.trim())) {
      setCustomMarques([...customMarques, newMarque.trim()]);
      setCustomModeles({ ...customModeles, [newMarque.trim()]: [] });
      setNewMarque('');
      showToast('Marque ajoutee avec succes', 'success');
    }
  };

  const handleDeleteMarque = (marque) => {
    setCustomMarques(customMarques.filter(m => m !== marque));
    const newModeles = { ...customModeles };
    delete newModeles[marque];
    setCustomModeles(newModeles);
    showToast('Marque supprimee avec succes', 'success');
  };

  const handleAddModele = () => {
    if (selectedMarqueForModel && newModele.trim() && !customModeles[selectedMarqueForModel]?.includes(newModele.trim())) {
      setCustomModeles({
        ...customModeles,
        [selectedMarqueForModel]: [...(customModeles[selectedMarqueForModel] || []), newModele.trim()]
      });
      setNewModele('');
      showToast('Modele ajoute avec succes', 'success');
    }
  };

  const handleDeleteModele = (marque, modele) => {
    setCustomModeles({
      ...customModeles,
      [marque]: customModeles[marque].filter(m => m !== modele)
    });
    showToast('Modele supprime avec succes', 'success');
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

  // ============================================================================
  // CHART DATA
  // ============================================================================
  const chartColors = ['#6366f1', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899'];

  // Vehicules par statut
  const statutData = statuts.map(s => ({ name: s, value: vehicles.filter(v => v.statut === s).length }));

  // Vehicules par marque
  const marqueData = [...new Set(vehicles.map(v => v.marque))].map(m => ({
    name: m, value: vehicles.filter(v => v.marque === m).length
  })).sort((a, b) => b.value - a.value);

  // Vehicules par categorie
  const categorieData = [...new Set(vehicles.map(v => v.categorie))].map(c => ({
    name: c, value: vehicles.filter(v => v.categorie === c).length
  })).sort((a, b) => b.value - a.value);

  // Vehicules par direction
  const directionData = [...new Set(vehicles.map(v => v.direction))].map(d => ({
    name: d, value: vehicles.filter(v => v.direction === d).length
  })).sort((a, b) => b.value - a.value);

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

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {(activeMenu || showNotifications || showProfile) && (
        <div className="fixed inset-0 z-30" onClick={() => { setActiveMenu(null); setShowNotifications(false); setShowProfile(false); }} />
      )}

      <main className="transition-all duration-300 pt-24 px-6 pb-6" style={{ marginLeft: sidebarCollapsed ? '5rem' : '18rem' }}>

        {/* ============================================================ */}
        {/* GRAPHIQUES - Remplacement des panneaux stats                 */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Barres groupees : Vehicules par Statut */}
          <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm p-5`}
            style={{ animation: animateCards ? 'fadeInUp 0.5s ease-out 0s both' : 'none' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: theme.primary }}></div>
                <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Vehicules par Statut</h3>
              </div>
              <ChartExportButton title="Vehicules_par_Statut" chartData={statutData} chartType="Barres groupees" darkMode={darkMode} theme={theme} />
            </div>
            <BarChartGrouped data={statutData} colors={['#10b981', '#3b82f6', '#f59e0b', '#ef4444']} darkMode={darkMode} theme={theme} title="statut" />
          </div>

          {/* Diagramme circulaire : Vehicules par Marque */}
          <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm p-5`}
            style={{ animation: animateCards ? 'fadeInUp 0.5s ease-out 0.1s both' : 'none' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: theme.primary }}></div>
                <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Vehicules par Marque</h3>
              </div>
              <ChartExportButton title="Vehicules_par_Marque" chartData={marqueData} chartType="Diagramme circulaire" darkMode={darkMode} theme={theme} />
            </div>
            <div className="flex items-center justify-center py-2">
              <DonutChart data={marqueData} colors={chartColors} darkMode={darkMode} theme={theme} title="marque" />
            </div>
          </div>

          {/* Radial Bar : Vehicules par Categorie */}
          <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm p-5`}
            style={{ animation: animateCards ? 'fadeInUp 0.5s ease-out 0.2s both' : 'none' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: theme.primary }}></div>
                <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Vehicules par Categorie</h3>
              </div>
              <ChartExportButton title="Vehicules_par_Categorie" chartData={categorieData} chartType="Barres radiales" darkMode={darkMode} theme={theme} />
            </div>
            <div className="flex items-center justify-center py-2">
              <RadialBarChart data={categorieData} colors={['#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#ec4899']} darkMode={darkMode} />
            </div>
          </div>

          {/* Barres groupees : Vehicules par Direction */}
          <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm p-5`}
            style={{ animation: animateCards ? 'fadeInUp 0.5s ease-out 0.3s both' : 'none' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: theme.primary }}></div>
                <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Vehicules par Direction</h3>
              </div>
              <ChartExportButton title="Vehicules_par_Direction" chartData={directionData} chartType="Barres groupees" darkMode={darkMode} theme={theme} />
            </div>
            <BarChartGrouped data={directionData} colors={['#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899']} darkMode={darkMode} theme={theme} title="direction" />
          </div>

        </div>

        {/* ─── TOOLBAR ─── */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm p-4 mb-6`}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              <select value={filterCategorie} onChange={(e) => { setFilterCategorie(e.target.value); setCurrentPage(1); }}
                className={`px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                <option value="">Categorie</option>
                {customCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select value={filterMarque} onChange={(e) => { setFilterMarque(e.target.value); setFilterModele(''); setCurrentPage(1); }}
                className={`px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                <option value="">Marque</option>
                {customMarques.map(m => <option key={m} value={m}>{m}</option>)}
              </select>

              <select value={filterModele} onChange={(e) => { setFilterModele(e.target.value); setCurrentPage(1); }} disabled={!filterMarque}
                className={`px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 disabled:opacity-50`} style={{ '--tw-ring-color': theme.primary }}>
                <option value="">Modele</option>
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

            <div className="flex items-center gap-3">
              <VehicleExportDropdown vehicles={vehicles} filteredVehicles={filteredVehicles} darkMode={darkMode} theme={theme} showToast={showToast} />

              <button onClick={() => setShowFilterManagement(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                <i className="bi bi-funnel"></i> Gestion filtres
              </button>

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
                <i className="bi bi-plus-lg"></i> Ajouter un vehicule
              </button>
            </div>
          </div>
        </div>

        {/* ─── TABLE VIEW ─── */}
        {viewMode === 'table' && (
          <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm overflow-hidden`}>
            {/* Table header with export */}
            <div className={`px-5 py-3 flex items-center justify-between border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <i className="bi bi-list-ul mr-2"></i>{filteredVehicles.length} vehicule(s)
              </p>
              <TableExportButton filteredVehicles={filteredVehicles} darkMode={darkMode} theme={theme} showToast={showToast} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` }}>
                    {['Vehicule', 'Categorie', 'Direction', 'Chauffeur', 'Statut', 'Kilometrage', 'Actions'].map((h, i) => (
                      <th key={i} className={`px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-white ${i === 6 ? 'text-center' : ''}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedVehicles.map((vehicle, rowIdx) => (
                    <tr key={vehicle.id}
                      className="transition-all duration-200 hover:brightness-110"
                      style={{
                        backgroundColor: rowIdx % 2 === 0
                          ? (darkMode ? '#0c1929' : '#e8eef6')
                          : (darkMode ? '#162033' : '#f1f4f9'),
                        animation: animateCards ? `fadeInUp 0.4s ease-out ${rowIdx * 0.06}s both` : 'none'
                      }}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={vehicle.image || '/placeholder.svg'} alt={vehicle.marque} className="w-11 h-11 rounded-lg object-cover shadow-sm" />
                          <div>
                            <p className={`font-semibold text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{vehicle.immatriculation}</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{vehicle.marque} {vehicle.modele} - {vehicle.annee}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-5 py-4 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{vehicle.categorie}</td>
                      <td className={`px-5 py-4 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{vehicle.direction}</td>
                      <td className={`px-5 py-4 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{vehicle.chauffeur || '\u2014'}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatutColor(vehicle.statut)}`}>{vehicle.statut}</span>
                      </td>
                      <td className={`px-5 py-4 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{vehicle.kilometrage.toLocaleString()} km</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => openDetailModal(vehicle)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'} transition-colors`} title="Details">
                            <i className="bi bi-eye"></i>
                          </button>
                          <button onClick={() => openEditModal(vehicle)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'} transition-colors`} title="Modifier">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <div className="relative">
                            <button onClick={() => { openDeleteConfirm(vehicle); setActiveMenu(null); }}
                              className={`p-2 rounded-lg text-red-500 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-50'} transition-colors`} title="Supprimer">
                              <i className="bi bi-trash"></i>
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
                  Affichage de {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredVehicles.length)} sur {filteredVehicles.length} vehicules
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
            {/* Grid header with export */}
            <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm p-4 mb-4 flex items-center justify-between`}>
              <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <i className="bi bi-grid-3x3-gap-fill mr-2"></i>{filteredVehicles.length} vehicule(s) - Vue Grille
              </p>
              <TableExportButton filteredVehicles={filteredVehicles} darkMode={darkMode} theme={theme} showToast={showToast} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedVehicles.map((vehicle, idx) => (
                <div key={vehicle.id}
                  className={`rounded-xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group`}
                  style={{
                    backgroundColor: idx % 2 === 0
                      ? (darkMode ? '#0c1929' : '#e8eef6')
                      : (darkMode ? '#162033' : '#f1f4f9'),
                    borderColor: darkMode ? '#374151' : '#e5e7eb',
                    animation: animateCards ? `fadeInUp 0.5s ease-out ${idx * 0.1}s both` : 'none'
                  }}
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
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>{vehicle.marque} {vehicle.modele} - {vehicle.annee}</p>
                    <div className={`flex items-center justify-between text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-4`}>
                      <span><i className="bi bi-speedometer2 mr-1"></i>{vehicle.kilometrage.toLocaleString()} km</span>
                      <span><i className="bi bi-person mr-1"></i>{vehicle.chauffeur || 'Non assigne'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openDetailModal(vehicle)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                        <i className="bi bi-eye"></i> Details
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
                  Precedent
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

        {/* ─── FOOTER ─── */}
        <div className={`mt-8 py-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center justify-center">
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>{'© 2026 SGS Tous droits reserves - Version 1.0'}</p>
          </div>
        </div>
      </main>

      {/* ============================================================ */}
      {/* MODAL -- GESTION DES FILTRES                                 */}
      {/* ============================================================ */}
      {showFilterManagement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl`}>
            <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-between`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Gestion des filtres</h2>
              <button onClick={() => setShowFilterManagement(false)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} transition-colors`}>
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>

            <div className={`border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} px-6 flex gap-1`}>
              {[
                { key: 'categories', label: 'Categories', icon: 'bi-tag' },
                { key: 'marques', label: 'Marques', icon: 'bi-building' },
                { key: 'modeles', label: 'Modeles', icon: 'bi-car-front' }
              ].map(tab => (
                <button key={tab.key} onClick={() => setFilterManagementTab(tab.key)}
                  className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${
                    filterManagementTab === tab.key
                      ? 'border-transparent text-white'
                      : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`
                  }`}
                  style={filterManagementTab === tab.key ? { background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`, borderRadius: '8px 8px 0 0' } : {}}>
                  <i className={tab.icon}></i>{tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {filterManagementTab === 'categories' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Nouvelle categorie"
                      className={`flex-1 px-4 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`}
                      style={{ '--tw-ring-color': theme.primary }}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()} />
                    <button onClick={handleAddCategory}
                      className="px-5 py-2.5 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition-all"
                      style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` }}>
                      <i className="bi bi-plus-lg mr-2"></i>Ajouter
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {customCategories.map(cat => (
                      <div key={cat} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-lg p-3 flex items-center justify-between`}>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{cat}</span>
                        <button onClick={() => handleDeleteCategory(cat)}
                          className={`p-1.5 rounded ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-red-50 text-red-600'} transition-colors`}>
                          <i className="bi bi-trash text-sm"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filterManagementTab === 'marques' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <input type="text" value={newMarque} onChange={(e) => setNewMarque(e.target.value)} placeholder="Nouvelle marque"
                      className={`flex-1 px-4 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`}
                      style={{ '--tw-ring-color': theme.primary }}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddMarque()} />
                    <button onClick={handleAddMarque}
                      className="px-5 py-2.5 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition-all"
                      style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` }}>
                      <i className="bi bi-plus-lg mr-2"></i>Ajouter
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {customMarques.map(marque => (
                      <div key={marque} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-lg p-3 flex items-center justify-between`}>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{marque}</span>
                        <button onClick={() => handleDeleteMarque(marque)}
                          className={`p-1.5 rounded ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-red-50 text-red-600'} transition-colors`}>
                          <i className="bi bi-trash text-sm"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filterManagementTab === 'modeles' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <select value={selectedMarqueForModel} onChange={(e) => setSelectedMarqueForModel(e.target.value)}
                      className={`px-4 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`}
                      style={{ '--tw-ring-color': theme.primary }}>
                      <option value="">Selectionner une marque</option>
                      {customMarques.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <input type="text" value={newModele} onChange={(e) => setNewModele(e.target.value)} placeholder="Nouveau modele" disabled={!selectedMarqueForModel}
                      className={`flex-1 px-4 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 disabled:opacity-50`}
                      style={{ '--tw-ring-color': theme.primary }}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddModele()} />
                    <button onClick={handleAddModele} disabled={!selectedMarqueForModel}
                      className="px-5 py-2.5 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
                      style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` }}>
                      <i className="bi bi-plus-lg mr-2"></i>Ajouter
                    </button>
                  </div>
                  {selectedMarqueForModel && (
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{'Modeles de '}{selectedMarqueForModel}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {(customModeles[selectedMarqueForModel] || []).map(modele => (
                          <div key={modele} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-lg p-3 flex items-center justify-between`}>
                            <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{modele}</span>
                            <button onClick={() => handleDeleteModele(selectedMarqueForModel, modele)}
                              className={`p-1.5 rounded ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-red-50 text-red-600'} transition-colors`}>
                              <i className="bi bi-trash text-sm"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {!selectedMarqueForModel && (
                    <div className="text-center py-12">
                      <i className={`bi bi-car-front text-5xl ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}></i>
                      <p className={`mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Selectionnez une marque pour voir ses modeles</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={`p-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-end`}>
              <button onClick={() => setShowFilterManagement(false)}
                className="px-5 py-2.5 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition-all"
                style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` }}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL -- AJOUTER                                              */}
      {/* ============================================================ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl`}>
            <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-between sticky top-0 ${darkMode ? 'bg-gray-900' : 'bg-white'} z-10`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Ajouter un vehicule</h2>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} transition-colors`}>
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Immatriculation *', key: 'immatriculation', type: 'text', placeholder: 'AB-1234-GA' },
                  { label: 'Annee', key: 'annee', type: 'number' },
                  { label: 'Kilometrage', key: 'kilometrage', type: 'number' },
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

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Categorie *</label>
                  <select value={formData.categorie} onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                    <option value="">Selectionner</option>
                    {customCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Marque *</label>
                  <select value={formData.marque} onChange={(e) => setFormData({ ...formData, marque: e.target.value, modele: '' })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                    <option value="">Selectionner</option>
                    {customMarques.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Modele *</label>
                  <select value={formData.modele} onChange={(e) => setFormData({ ...formData, modele: e.target.value })} disabled={!formData.marque}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 disabled:opacity-50`} style={{ '--tw-ring-color': theme.primary }}>
                    <option value="">Selectionner</option>
                    {formAvailableModeles.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Direction *</label>
                  <select value={formData.direction} onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                    <option value="">Selectionner</option>
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

                <div className="col-span-2">
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Fournisseurs</label>
                  <select value={formData.carburant} onChange={(e) => setFormData({ ...formData, carburant: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                    <option value="Diesel">Toyota</option>
                    <option value="Essence">Bernabe Gabon</option>
                    <option value="Auto Gabon">Auto Gabon</option>
                    <option value="Gabon Meca">Gabon Meca</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={`p-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-end gap-3 sticky bottom-0 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className={`px-5 py-2.5 rounded-lg border text-sm ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-100'} transition-colors`}>Annuler</button>
              <button onClick={handleAddVehicle} disabled={!formData.immatriculation || !formData.marque || !formData.modele || !formData.categorie || !formData.direction}
                className="px-5 py-2.5 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 disabled:opacity-50 transition-all"
                style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` }}>
                Ajouter le vehicule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL -- MODIFIER                                             */}
      {/* ============================================================ */}
      {showEditModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl`}>
            <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-between sticky top-0 ${darkMode ? 'bg-gray-900' : 'bg-white'} z-10`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Modifier le vehicule</h2>
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
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Categorie *</label>
                  <select value={formData.categorie} onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                    {customCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Marque *</label>
                  <select value={formData.marque} onChange={(e) => setFormData({ ...formData, marque: e.target.value, modele: '' })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                    {customMarques.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Modele *</label>
                  <select value={formData.modele} onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2`} style={{ '--tw-ring-color': theme.primary }}>
                    {formAvailableModeles.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Kilometrage</label>
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
      {/* MODAL -- DETAILS (tabbed) - IMAGE GRANDE                      */}
      {/* ============================================================ */}
      {showDetailModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl`}>
            <div className={`border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="relative h-64 overflow-hidden">
                <img src={selectedVehicle.image || '/placeholder.svg'} alt={selectedVehicle.marque} className="w-full h-full object-contain bg-gradient-to-br from-gray-900 to-gray-800" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <button onClick={() => setShowDetailModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-colors">
                  <i className="bi bi-x-lg text-xl"></i>
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-1">{selectedVehicle.immatriculation}</h2>
                      <p className="text-lg text-gray-200">{selectedVehicle.marque} {selectedVehicle.modele} - {selectedVehicle.annee}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm ${getStatutColor(selectedVehicle.statut)}`}>
                      {selectedVehicle.statut}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} px-6 flex gap-1 overflow-x-auto`}>
              {[
                { key: 'general', label: 'General', icon: 'bi-info-circle' },
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

            <div className="flex-1 overflow-y-auto p-6">

              {detailTab === 'general' && (
                <div className="grid grid-cols-3 gap-5">
                  {[
                    { title: 'Informations vehicule', icon: 'bi-car-front', iconColor: 'text-blue-500', bg: darkMode ? 'bg-gray-800' : 'bg-blue-50', fields: [
                      ['Immatriculation', selectedVehicle.immatriculation], ['Marque', selectedVehicle.marque], ['Modele', selectedVehicle.modele],
                      ['Categorie', selectedVehicle.categorie], ['Annee', selectedVehicle.annee], ['Couleur', selectedVehicle.couleur],
                      ['Carburant', selectedVehicle.carburant], ['Puissance', selectedVehicle.puissance], ['Kilometrage', `${selectedVehicle.kilometrage.toLocaleString()} km`]
                    ]},
                    { title: 'Informations financieres', icon: 'bi-currency-dollar', iconColor: 'text-green-500', bg: darkMode ? 'bg-gray-800' : 'bg-green-50', fields: [
                      ["Date d'achat", selectedVehicle.dateAchat ? new Date(selectedVehicle.dateAchat).toLocaleDateString('fr-FR') : '\u2014'],
                      ["Prix d'achat", selectedVehicle.prixAchat ? `${selectedVehicle.prixAchat.toLocaleString()} CFA` : '\u2014']
                    ]},
                    { title: 'Affectation', icon: 'bi-people', iconColor: 'text-purple-500', bg: darkMode ? 'bg-gray-800' : 'bg-purple-50', fields: [
                      ['Direction', selectedVehicle.direction], ['Chauffeur', selectedVehicle.chauffeur || 'Non assigne'], ['Statut', selectedVehicle.statut]
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

                  <div className={`col-span-3 ${darkMode ? 'bg-gray-800' : 'bg-orange-50'} rounded-xl p-5`}>
                    <h3 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <i className="bi bi-calendar-event text-orange-500"></i>Echeances importantes
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Assurance', value: selectedVehicle.assuranceExpire ? new Date(selectedVehicle.assuranceExpire).toLocaleDateString('fr-FR') : '\u2014', icon: 'bi-shield-check' },
                        { label: 'Visite technique', value: selectedVehicle.visiteExpire ? new Date(selectedVehicle.visiteExpire).toLocaleDateString('fr-FR') : '\u2014', icon: 'bi-clipboard-check' }
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

              {detailTab === 'documents' && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Documents du vehicule</h3>
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
                        <p className={`mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aucun document enregistre</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

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
                      <thead>
                        <tr style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` }}>
                          {['Type', 'Date', 'Kilometrage', 'Cout', 'Statut'].map(h => (
                            <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(vehicleMaintenances[selectedVehicle.id] || []).map((m, idx) => (
                          <tr key={m.id} style={{ backgroundColor: idx % 2 === 0 ? (darkMode ? '#0c1929' : '#e8eef6') : (darkMode ? '#162033' : '#f1f4f9') }} className="transition-colors">
                            <td className={`px-5 py-3.5 text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{m.type}</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{new Date(m.date).toLocaleDateString('fr-FR')}</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{m.kilometrage.toLocaleString()} km</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{m.cout.toLocaleString()} CFA</td>
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
                        <p className={`mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aucune maintenance enregistree</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {detailTab === 'missions' && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Historique des missions</h3>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'} rounded-xl border overflow-hidden`}>
                    <table className="w-full">
                      <thead>
                        <tr style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` }}>
                          {['Destination', 'Depart', 'Retour', 'Chauffeur', 'KM', 'Statut'].map(h => (
                            <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(vehicleMissions[selectedVehicle.id] || []).map((m, idx) => (
                          <tr key={m.id} style={{ backgroundColor: idx % 2 === 0 ? (darkMode ? '#0c1929' : '#e8eef6') : (darkMode ? '#162033' : '#f1f4f9') }} className="transition-colors">
                            <td className={`px-5 py-3.5 text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{m.destination}</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{new Date(m.dateDepart).toLocaleDateString('fr-FR')}</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{new Date(m.dateRetour).toLocaleDateString('fr-FR')}</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{m.chauffeur}</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{m.kilometrage > 0 ? `${m.kilometrage.toLocaleString()} km` : '\u2014'}</td>
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
                        <p className={`mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aucune mission enregistree</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

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
                      <thead>
                        <tr style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` }}>
                          {['Date', 'Litres', 'Montant', 'Kilometrage', 'Station'].map(h => (
                            <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(vehicleCarburant[selectedVehicle.id] || []).map((c, idx) => (
                          <tr key={c.id} style={{ backgroundColor: idx % 2 === 0 ? (darkMode ? '#0c1929' : '#e8eef6') : (darkMode ? '#162033' : '#f1f4f9') }} className="transition-colors">
                            <td className={`px-5 py-3.5 text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{new Date(c.date).toLocaleDateString('fr-FR')}</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{c.litres} L</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{c.montant.toLocaleString()} CFA</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{c.kilometrage.toLocaleString()} km</td>
                            <td className={`px-5 py-3.5 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{c.station}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {(!vehicleCarburant[selectedVehicle.id] || vehicleCarburant[selectedVehicle.id].length === 0) && (
                      <div className="text-center py-12">
                        <i className={`bi bi-fuel-pump text-5xl ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}></i>
                        <p className={`mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aucun plein enregistre</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {detailTab === 'statistiques' && (() => {
                const stats = getVehicleStats(selectedVehicle.id);
                const statCards = [
                  { label: 'Total missions', value: stats.totalMissions, icon: 'bi-geo-alt-fill', iconColor: 'text-blue-500', iconBg: 'bg-blue-500/20', bg: darkMode ? 'bg-gray-800' : 'bg-blue-50' },
                  { label: 'KM parcourus', value: stats.totalKmMissions.toLocaleString(), icon: 'bi-speedometer2', iconColor: 'text-green-500', iconBg: 'bg-green-500/20', bg: darkMode ? 'bg-gray-800' : 'bg-green-50' },
                  { label: 'Carburant total', value: `${stats.totalCarburant} L`, icon: 'bi-fuel-pump-fill', iconColor: 'text-yellow-500', iconBg: 'bg-yellow-500/20', bg: darkMode ? 'bg-gray-800' : 'bg-yellow-50' },
                  { label: 'Consommation moy.', value: `${stats.consommationMoyenne} L/100`, icon: 'bi-graph-up', iconColor: 'text-purple-500', iconBg: 'bg-purple-500/20', bg: darkMode ? 'bg-gray-800' : 'bg-purple-50' },
                  { label: 'Cout maintenance', value: `${stats.totalMaintenance.toLocaleString()} CFA`, icon: 'bi-tools', iconColor: 'text-orange-500', iconBg: 'bg-orange-500/20', bg: darkMode ? 'bg-gray-800' : 'bg-orange-50', span: 2 },
                  { label: 'Cout total (carb. + maint.)', value: `${stats.coutTotal.toLocaleString()} CFA`, icon: 'bi-cash-stack', iconColor: 'text-red-500', iconBg: 'bg-red-500/20', bg: darkMode ? 'bg-gray-800' : 'bg-red-50', span: 2 }
                ];
                return (
                  <div>
                    <h3 className={`font-semibold mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Statistiques du vehicule</h3>
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
      {/* MODAL -- CONFIRMATION SUPPRESSION                            */}
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
                {'Etes-vous sur de vouloir supprimer le vehicule '}
                <strong className={darkMode ? 'text-white' : 'text-gray-900'}>{vehicleToDelete.immatriculation}</strong>
                {` (${vehicleToDelete.marque} ${vehicleToDelete.modele}) ? Cette action est irreversible.`}
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
