import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export const DEFAULT_SETTINGS = {
  business_name: "FURNISETU",
  tagline: "Office, School & Study Furniture Specialists in Agra",
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  email: "contact@furnisetu.in",
  address: "Agra, Uttar Pradesh, India",
  business_hours: "Monday – Saturday: 10:00 AM – 8:00 PM (Sunday by appointment)",
  google_maps_embed_url: "",
  about_short: "FURNISETU is Agra's premier order-based furniture specialist providing high quality office workstations, school desks, teacher tables, study room setups, and institutional furniture.",
  hero_headline: "Premium Office, School & Study Furniture in Agra",
  hero_subheadline: "Direct order-based supply for offices, educational institutions, study spaces & corporate setups. Custom orders arranged directly from top manufacturers.",
  social_links: {
    instagram: "",
    facebook: "",
    linkedin: ""
  }
};

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryModalData, setEnquiryModalData] = useState({
    productId: '',
    productName: '',
    category: ''
  });

  useEffect(() => {
    // Attempt to fetch updated business settings from backend
    api.settings.get()
      .then((res) => {
        if (res.data) {
          setSettings((prev) => ({ ...prev, ...res.data }));
        }
      })
      .catch(() => {
        // Fallback to default configured values if backend is initializing
      });
  }, []);

  const openEnquiry = (product = null) => {
    if (product) {
      setEnquiryModalData({
        productId: product.id || '',
        productName: product.name || '',
        category: product.category || ''
      });
    } else {
      setEnquiryModalData({
        productId: '',
        productName: '',
        category: ''
      });
    }
    setIsEnquiryModalOpen(true);
  };

  const closeEnquiry = () => {
    setIsEnquiryModalOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        setSettings,
        isEnquiryModalOpen,
        enquiryModalData,
        openEnquiry,
        closeEnquiry
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
