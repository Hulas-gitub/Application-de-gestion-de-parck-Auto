import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Palette, Check, RefreshCw, Sparkles, Eye, 
  Monitor, Save, X, Wand2, Sliders, Copy, Download, Upload
} from 'lucide-react';

const Theme = () => {
  const { currentTheme, theme, changeTheme, availableThemes } = useTheme();
  const [previewTheme, setPreviewTheme] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customColors, setCustomColors] = useState({
    primary: theme.primary,
    primaryLight: theme.primaryLight,
    primaryDark: theme.primaryDark,
    name: 'Thème Personnalisé'
  });

  // Fonction pour appliquer temporairement un thème (prévisualisation)
  const handlePreview = (themeName) => {
    setPreviewTheme(themeName);
    setShowPreview(true);
    setCustomMode(false);
  };

  // Fonction pour appliquer définitivement le thème
  const handleApplyTheme = (themeName) => {
    changeTheme(themeName);
    setShowPreview(false);
    setPreviewTheme(null);
    setCustomMode(false);
  };

  // Fonction pour annuler la prévisualisation
  const handleCancelPreview = () => {
    setShowPreview(false);
    setPreviewTheme(null);
    setCustomMode(false);
  };

  // Fonction pour activer le mode personnalisation
  const handleCustomMode = () => {
    setCustomMode(true);
    setShowPreview(false);
    setPreviewTheme(null);
    setCustomColors({
      primary: theme.primary,
      primaryLight: theme.primaryLight,
      primaryDark: theme.primaryDark,
      name: 'Thème Personnalisé'
    });
  };

  // Fonction pour changer une couleur personnalisée
  const handleColorChange = (colorType, value) => {
    setCustomColors(prev => ({
      ...prev,
      [colorType]: value
    }));
  };

  // Fonction pour appliquer les couleurs personnalisées
  const handleApplyCustomColors = () => {
    // Ici tu devras ajouter une fonction dans ton ThemeContext pour sauvegarder un thème personnalisé
    console.log('Couleurs personnalisées à appliquer:', customColors);
    // changeTheme('custom', customColors); // À implémenter dans ThemeContext
    alert('Fonctionnalité à implémenter: sauvegarde du thème personnalisé dans le backend');
  };

  // Fonction pour copier le code hexadécimal
  const handleCopyColor = (color) => {
    navigator.clipboard.writeText(color);
    alert(`Couleur ${color} copiée !`);
  };

  // Fonction pour générer des nuances automatiques
  const handleGenerateShades = () => {
    const primary = customColors.primary;
    // Convertir hex en RGB
    const r = parseInt(primary.slice(1, 3), 16);
    const g = parseInt(primary.slice(3, 5), 16);
    const b = parseInt(primary.slice(5, 7), 16);
    
    // Générer teinte claire (ajouter 40 à chaque composante)
    const lightR = Math.min(255, r + 40);
    const lightG = Math.min(255, g + 40);
    const lightB = Math.min(255, b + 40);
    const primaryLight = `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`;
    
    // Générer teinte foncée (soustraire 40 de chaque composante)
    const darkR = Math.max(0, r - 40);
    const darkG = Math.max(0, g - 40);
    const darkB = Math.max(0, b - 40);
    const primaryDark = `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`;
    
    setCustomColors(prev => ({
      ...prev,
      primaryLight,
      primaryDark
    }));
  };

  const activeTheme = customMode ? customColors : (showPreview && previewTheme ? availableThemes[previewTheme] : theme);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Palette className="w-8 h-8" />
            Gestion des Thèmes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Personnalisez l'apparence de votre système de gestion de flotte
          </p>
        </div>
        
        {(showPreview || customMode) && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancelPreview}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
            {customMode && (
              <button
                onClick={handleApplyCustomColors}
                className="px-4 py-2 bg-gradient-to-r text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                style={{
                  backgroundImage: `linear-gradient(to right, ${customColors.primary}, ${customColors.primaryDark})`
                }}
              >
                <Save className="w-4 h-4" />
                Enregistrer le thème
              </button>
            )}
            {showPreview && !customMode && (
              <button
                onClick={() => handleApplyTheme(previewTheme)}
                className="px-4 py-2 bg-gradient-to-r text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                style={{
                  backgroundImage: `linear-gradient(to right, ${availableThemes[previewTheme].primary}, ${availableThemes[previewTheme].primaryDark})`
                }}
              >
                <Save className="w-4 h-4" />
                Appliquer ce thème
              </button>
            )}
          </div>
        )}
      </div>

      {/* Thème actuel */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Thème Actif
          </h2>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-20 h-20 rounded-xl shadow-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`
                }}
              >
                <Check className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {theme.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Appliqué à tout le système
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-white shadow"
                    style={{ backgroundColor: theme.primary }}
                    title={theme.primary}
                  ></div>
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-white shadow"
                    style={{ backgroundColor: theme.primaryLight }}
                    title={theme.primaryLight}
                  ></div>
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-white shadow"
                    style={{ backgroundColor: theme.primaryDark }}
                    title={theme.primaryDark}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Personnalisation */}
      {!customMode && !showPreview && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Wand2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Créer un Thème Personnalisé
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Choisissez vos propres couleurs pour un design unique
                </p>
              </div>
            </div>
            <button
              onClick={handleCustomMode}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
            >
              <Sliders className="w-5 h-5" />
              Personnaliser
            </button>
          </div>
        </div>
      )}

      {/* Éditeur de Couleurs Personnalisées */}
      {customMode && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-6 h-6" />
              Personnalisation des Couleurs
            </h2>
            <button
              onClick={handleGenerateShades}
              className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Wand2 className="w-4 h-4" />
              Générer nuances automatiques
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Couleur Principale */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Couleur Principale
              </label>
              <div className="relative">
                <input
                  type="color"
                  value={customColors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-full h-32 rounded-lg cursor-pointer border-2 border-gray-300 dark:border-gray-600"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded px-3 py-2 flex items-center justify-between">
                  <span className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                    {customColors.primary}
                  </span>
                  <button
                    onClick={() => handleCopyColor(customColors.primary)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={customColors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                placeholder="#3B82F6"
              />
            </div>

            {/* Couleur Claire */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Couleur Claire (Hover/Light)
              </label>
              <div className="relative">
                <input
                  type="color"
                  value={customColors.primaryLight}
                  onChange={(e) => handleColorChange('primaryLight', e.target.value)}
                  className="w-full h-32 rounded-lg cursor-pointer border-2 border-gray-300 dark:border-gray-600"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded px-3 py-2 flex items-center justify-between">
                  <span className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                    {customColors.primaryLight}
                  </span>
                  <button
                    onClick={() => handleCopyColor(customColors.primaryLight)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={customColors.primaryLight}
                onChange={(e) => handleColorChange('primaryLight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                placeholder="#60A5FA"
              />
            </div>

            {/* Couleur Foncée */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Couleur Foncée (Dark)
              </label>
              <div className="relative">
                <input
                  type="color"
                  value={customColors.primaryDark}
                  onChange={(e) => handleColorChange('primaryDark', e.target.value)}
                  className="w-full h-32 rounded-lg cursor-pointer border-2 border-gray-300 dark:border-gray-600"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded px-3 py-2 flex items-center justify-between">
                  <span className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                    {customColors.primaryDark}
                  </span>
                  <button
                    onClick={() => handleCopyColor(customColors.primaryDark)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={customColors.primaryDark}
                onChange={(e) => handleColorChange('primaryDark', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                placeholder="#1E40AF"
              />
            </div>
          </div>

          {/* Nom du Thème */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Nom du Thème
            </label>
            <input
              type="text"
              value={customColors.name}
              onChange={(e) => handleColorChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-medium"
              placeholder="Mon Thème Personnalisé"
            />
          </div>

          {/* Aperçu en Direct */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Aperçu en Direct
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Bouton */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Bouton</p>
                <button 
                  className="w-full px-4 py-3 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all"
                  style={{
                    background: `linear-gradient(to right, ${customColors.primary}, ${customColors.primaryDark})`
                  }}
                >
                  Ajouter
                </button>
              </div>

              {/* Badge */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Badge</p>
                <div className="flex items-center justify-center h-12">
                  <span 
                    className="px-4 py-2 rounded-full text-white font-medium text-sm shadow"
                    style={{ backgroundColor: customColors.primary }}
                  >
                    En cours
                  </span>
                </div>
              </div>

              {/* Menu Item */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Menu Actif</p>
                <div 
                  className="px-4 py-3 rounded-lg text-white shadow-lg flex items-center gap-2 font-medium"
                  style={{
                    background: `linear-gradient(to right, ${customColors.primary}, ${customColors.primaryDark})`
                  }}
                >
                  <Monitor className="w-5 h-5" />
                  Dashboard
                </div>
              </div>

              {/* Gradient Card */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Carte</p>
                <div 
                  className="h-12 rounded-lg shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${customColors.primary}, ${customColors.primaryDark})`
                  }}
                ></div>
              </div>
            </div>

            {/* Dégradé de couleurs */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3">Dégradé complet</p>
              <div 
                className="h-16 rounded-lg shadow-lg"
                style={{
                  background: `linear-gradient(to right, ${customColors.primaryLight}, ${customColors.primary}, ${customColors.primaryDark})`
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Thèmes Prédéfinis */}
      {!customMode && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Palette className="w-6 h-6" />
            Thèmes Prédéfinis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.entries(availableThemes).map(([key, themeOption]) => {
              const isActive = key === currentTheme;
              const isPreviewing = key === previewTheme;
              
              return (
                <div
                  key={key}
                  className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    isActive 
                      ? 'border-green-500 shadow-xl scale-105' 
                      : isPreviewing
                      ? 'border-blue-500 shadow-lg scale-102'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-lg'
                  }`}
                >
                  {/* Gradient Header */}
                  <div 
                    className="h-32 flex items-center justify-center relative"
                    style={{
                      background: `linear-gradient(135deg, ${themeOption.primary}, ${themeOption.primaryDark})`
                    }}
                  >
                    {isActive && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-2 shadow-lg">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    {isPreviewing && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-2 shadow-lg animate-pulse">
                        <Eye className="w-4 h-4" />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Theme Info */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      {themeOption.name}
                    </h3>
                    
                    {/* Color Swatches */}
                    <div className="flex items-center gap-2 mb-4">
                      <div 
                        className="w-6 h-6 rounded border-2 border-white shadow-sm"
                        style={{ backgroundColor: themeOption.primary }}
                        title={themeOption.primary}
                      ></div>
                      <div 
                        className="w-6 h-6 rounded border-2 border-white shadow-sm"
                        style={{ backgroundColor: themeOption.primaryLight }}
                        title={themeOption.primaryLight}
                      ></div>
                      <div 
                        className="w-6 h-6 rounded border-2 border-white shadow-sm"
                        style={{ backgroundColor: themeOption.primaryDark }}
                        title={themeOption.primaryDark}
                      ></div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePreview(key)}
                        className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Aperçu
                      </button>
                      {!isActive && (
                        <button
                          onClick={() => handleApplyTheme(key)}
                          className="flex-1 px-3 py-2 text-white rounded-lg transition-all text-sm font-medium hover:shadow-lg"
                          style={{
                            background: `linear-gradient(to right, ${themeOption.primary}, ${themeOption.primaryDark})`
                          }}
                        >
                          Appliquer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Preview Section */}
      {showPreview && previewTheme && !customMode && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Eye className="w-6 h-6" />
            Aperçu du Thème : {availableThemes[previewTheme].name}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Preview Card 1 - Sidebar Active Item */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Menu Actif</p>
              <div 
                className="p-4 rounded-lg text-white shadow-lg flex items-center gap-3"
                style={{
                  background: `linear-gradient(to right, ${availableThemes[previewTheme].primary}, ${availableThemes[previewTheme].primaryDark})`
                }}
              >
                <Monitor className="w-6 h-6" />
                <span className="font-medium">Tableau de Bord</span>
              </div>
            </div>

            {/* Preview Card 2 - Button */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Bouton Principal</p>
              <button 
                className="w-full p-4 rounded-lg text-white shadow-lg font-medium hover:shadow-xl transition-all"
                style={{
                  background: `linear-gradient(to right, ${availableThemes[previewTheme].primary}, ${availableThemes[previewTheme].primaryDark})`
                }}
              >
                Ajouter un Véhicule
              </button>
            </div>

            {/* Preview Card 3 - Accent */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Badge / Accent</p>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span 
                  className="px-4 py-2 rounded-full text-white font-medium text-sm shadow"
                  style={{ backgroundColor: availableThemes[previewTheme].primary }}
                >
                  En cours
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
              Comment personnaliser votre thème ?
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                <span>Choisissez un <strong>thème prédéfini</strong> ou créez votre propre thème avec le mode personnalisation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                <span>Utilisez les <strong>sélecteurs de couleur</strong> pour choisir précisément vos teintes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                <span>Cliquez sur <strong>"Générer nuances automatiques"</strong> pour créer des variantes claires/foncées automatiquement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                <span>L'aperçu en direct vous montre comment votre thème apparaîtra dans l'interface</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Theme;