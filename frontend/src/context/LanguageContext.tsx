'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'ml';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    nav_dashboard: 'Dashboard',
    nav_farms: 'My Farms',
    nav_crops: 'Crops Catalog',
    nav_calendar: 'Smart Calendar',
    nav_scanner: 'AI Disease Scanner',
    nav_weather: 'Live Weather',
    nav_soil: 'Soil Intelligence',
    nav_market: 'Market Prices',
    nav_advisor: 'Farming Advisor',
    nav_analytics: 'Analytics',
    nav_finance: 'Finance & Profit',
    nav_profile: 'Profile & Settings',
    nav_alerts: 'Smart Alerts',

    // Dashboard
    greeting: 'Good morning,',
    subheading: "Here's what your farm needs today.",
    summary_title: "Today's Farm Summary",
    scan_shortcut: 'Scan Crop Disease',
    active_crops_timeline: 'Active Crop Growth Stage Timeline',
    soil_condition: 'Soil Condition',
    live_market_prices: 'Live Market Crop Prices',
    recent_disease_scans: 'Recent Crop Disease Scans',

    // Crop Health & Status
    health_healthy: 'Healthy',
    health_warning: 'Monitoring Required',
    health_attention: 'Attention Needed',
    water_good: 'Good Moisture',
    water_low: 'Needs Irrigation',

    // Growth Stages
    stage_planting: 'Planting',
    stage_germination: 'Germination',
    stage_vegetative: 'Vegetative Growth',
    stage_flowering: 'Flowering & Fruit Set',
    stage_maturity: 'Maturity',
    stage_harvest: 'Harvest Phase',

    // Scanner
    scan_title: 'AI Crop Disease Scanner',
    scan_subtitle: 'Upload a clear leaf photo for instant diagnosis and safe IPM guidance.',
    upload_button: 'Scan Leaf Image with AI',
    change_photo: 'Choose Different Photo',
    pre_validation_tip: 'Tip for High Confidence: Photograph a single leaf directly in ambient sunlight.',

    // Actions & Buttons
    view_all: 'View All',
    view_details: 'View Details →',
    generate_calendar: 'Generate Schedule',
    complete_task: 'Complete Task',
    system_online: 'System Online',
  },
  ml: {
    // Navigation
    nav_dashboard: 'ഡാഷ്‌ബോർഡ്',
    nav_farms: 'എന്റെ കൃഷിയിടങ്ങൾ',
    nav_crops: 'വിള കാറ്റലോഗ്',
    nav_calendar: 'സ്മാർട്ട് കലണ്ടർ',
    nav_scanner: 'എഐ രോഗ സ്കാനർ',
    nav_weather: 'തത്സമയ കാലാവസ്ഥ',
    nav_soil: 'മണ്ണ് പരിശോധന',
    nav_market: 'വിപണി വിവരങ്ങൾ',
    nav_advisor: 'കൃഷി ഉപദേശകൻ',
    nav_analytics: 'വിശകലനം',
    nav_finance: 'ധനകാര്യം & ലാഭം',
    nav_profile: 'പ്രൊഫൈൽ & ക്രമീകരണങ്ങൾ',
    nav_alerts: 'സ്മാർട്ട് അറിയിപ്പുകൾ',

    // Dashboard
    greeting: 'സുപ്രഭാതം,',
    subheading: 'നിങ്ങളുടെ കൃഷിയിടത്തിന് ഇന്ന് ആവശ്യമായ കാര്യങ്ങൾ.',
    summary_title: 'ഇന്നത്തെ കൃഷി വിവരങ്ങൾ',
    scan_shortcut: 'വിള രോഗം സ്കാൻ ചെയ്യുക',
    active_crops_timeline: 'സജീവ വിള വളർച്ചാ സമയരേഖ',
    soil_condition: 'മണ്ണിന്റെ അവസ്ഥ',
    live_market_prices: 'തത്സമയ വിപണി വിലകൾ',
    recent_disease_scans: 'സമീപകാല രോഗ നിർണ്ണയങ്ങൾ',

    // Crop Health & Status
    health_healthy: 'മികച്ച ആരോഗ്യം',
    health_warning: 'നിരീക്ഷണം ആവശ്യം',
    health_attention: 'ശ്രദ്ധ തിരിക്കേണ്ടത്',
    water_good: 'നല്ല ഈർപ്പം',
    water_low: 'നനയ്ക്കൽ ആവശ്യം',

    // Growth Stages
    stage_planting: 'വിത്തുതൈ നടീൽ',
    stage_germination: 'മുളയ്ക്കൽ',
    stage_vegetative: 'വളർച്ചാ ഘട്ടം',
    stage_flowering: 'പൂവിടൽ ഘട്ടം',
    stage_maturity: 'വിളവെടുപ്പ് ഘട്ടം',
    stage_harvest: 'വിളവെടുപ്പ്',

    // Scanner
    scan_title: 'എഐ വിള രോഗ സ്കാനർ',
    scan_subtitle: 'ഉടനടി രോഗ നിർണ്ണയത്തിനും സസ്യ സംരക്ഷണത്തിനും ഇലയുടെ ചിത്രം നൽകുക.',
    upload_button: 'എഐ ഉപയോഗിച്ച് ഇല സ്കാൻ ചെയ്യുക',
    change_photo: 'മറ്റൊരു ചിത്രം തിരഞ്ഞെടുക്കുക',
    pre_validation_tip: 'കൂടുതൽ കൃത്യതയ്ക്ക്: സൂര്യപ്രകാശത്തിൽ ഒറ്റ ഇലയുടെ ചിത്രം എടുക്കുക.',

    // Actions & Buttons
    view_all: 'എല്ലാം കാണുക',
    view_details: 'വിശദാംശങ്ങൾ കാണുക →',
    generate_calendar: 'കലണ്ടർ ഉണ്ടാക്കുക',
    complete_task: 'പൂർത്തിയായി',
    system_online: 'സിസ്റ്റം സജീവം',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('farmpilot_lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ml')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('farmpilot_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: string) => translations['en']?.[key] || key,
    };
  }
  return context;
};
