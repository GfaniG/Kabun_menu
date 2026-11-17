import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RotateCcw,
  Save,
  Wifi,
  Type,
  Palette,
  MapPin,
  Clock,
  Phone,
  MessageSquareQuote,
  Check,
} from 'lucide-react';
import { SiteSettings } from '../../types/menu';
import { useSiteSettings, useUpdateSiteSettings, useResetSiteSettings } from '../../hooks/useMenu';
import { Button } from '../ui/Button';
import { Input, TextArea } from '../ui/Input';
import { Modal } from '../ui/Modal';

export const SiteSettingsCMS: React.FC = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSettings();
  const resetMutation = useResetSiteSettings();

  const [formData, setFormData] = useState<Partial<SiteSettings>>({});
  const [activeTab, setActiveTab] = useState<'branding' | 'wifi' | 'story' | 'contact' | 'appearance'>('branding');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMutation.mutateAsync(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = async () => {
    await resetMutation.mutateAsync();
    setIsResetConfirmOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-[#A1A1AA]">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#FFBD18] animate-spin mx-auto mb-2" />
        <p className="font-headline text-xs uppercase tracking-wider">Loading Site Settings...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] border border-[#222222] rounded-2xl p-4 sm:p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
      {/* CMS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <h3 className="font-headline text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FFBD18]" />
            <span>Customer Menu CMS &amp; Live Customization</span>
          </h3>
          <p className="font-body text-xs text-[#A1A1AA] mt-1">
            Edit all texts, hero titles, Wi-Fi passwords, brand colors, fonts, and topics live on the customer page.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsResetConfirmOpen(true)}
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-[#A1A1AA]" />}
            disabled={resetMutation.isPending}
            className="flex-1 sm:flex-none justify-center"
          >
            Restore to Default
          </Button>

          <Button
            variant="yellow"
            size="sm"
            onClick={handleSave}
            isLoading={updateMutation.isPending}
            leftIcon={saveSuccess ? <Check className="w-4 h-4 text-black" /> : <Save className="w-4 h-4 text-black font-bold" />}
            className="flex-1 sm:flex-none justify-center font-extrabold"
          >
            {saveSuccess ? 'Saved Live!' : 'Save Live Changes'}
          </Button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-[#222222] pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2 rounded-xl text-xs font-headline uppercase tracking-wider font-bold transition-all shrink-0 ${
            activeTab === 'branding'
              ? 'bg-white text-black font-extrabold'
              : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
          }`}
        >
          Hero &amp; Headlines
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wifi')}
          className={`px-4 py-2 rounded-xl text-xs font-headline uppercase tracking-wider font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'wifi'
              ? 'bg-white text-black font-extrabold'
              : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
          }`}
        >
          <Wifi className="w-3.5 h-3.5" />
          <span>Wi-Fi Network</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('story')}
          className={`px-4 py-2 rounded-xl text-xs font-headline uppercase tracking-wider font-bold transition-all shrink-0 ${
            activeTab === 'story'
              ? 'bg-white text-black font-extrabold'
              : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
          }`}
        >
          Story &amp; Quotes
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-xl text-xs font-headline uppercase tracking-wider font-bold transition-all shrink-0 ${
            activeTab === 'contact'
              ? 'bg-white text-black font-extrabold'
              : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
          }`}
        >
          Contact, Hours &amp; Social
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('appearance')}
          className={`px-4 py-2 rounded-xl text-xs font-headline uppercase tracking-wider font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'appearance'
              ? 'bg-white text-black font-extrabold'
              : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Colors &amp; Fonts</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: Hero & Branding */}
        {activeTab === 'branding' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Roastery / Café Name"
                value={formData.restaurantName || ''}
                onChange={(e) => handleChange('restaurantName', e.target.value)}
                placeholder="KABUN COFFEE + ROASTERY"
              />
              <Input
                label="Subtitle Tagline"
                value={formData.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="SPECIALTY COFFEE • ROASTERY • BISTRO"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Hero Title Line 1"
                value={formData.heroTitle1 || ''}
                onChange={(e) => handleChange('heroTitle1', e.target.value)}
                placeholder="CRAFTED FROM"
              />
              <Input
                label="Hero Title Line 2"
                value={formData.heroTitle2 || ''}
                onChange={(e) => handleChange('heroTitle2', e.target.value)}
                placeholder="COFFEE"
              />
            </div>

            <TextArea
              label="Hero Welcome Description"
              value={formData.heroDescription || ''}
              onChange={(e) => handleChange('heroDescription', e.target.value)}
              placeholder="Upscale specialty coffee roastery in Mekelle..."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary Button Text"
                value={formData.primaryCtaText || ''}
                onChange={(e) => handleChange('primaryCtaText', e.target.value)}
                placeholder="EXPLORE ROASTERY MENU"
              />
              <Input
                label="Secondary Button Text"
                value={formData.secondaryCtaText || ''}
                onChange={(e) => handleChange('secondaryCtaText', e.target.value)}
                placeholder="OUR ROASTERY CRAFT"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Wi-Fi Settings */}
        {activeTab === 'wifi' && (
          <div className="space-y-4 animate-in fade-in max-w-xl">
            <p className="text-xs text-[#A1A1AA]">
              Customers can tap &quot;Guest Wi-Fi&quot; in the navigation header or scan table cards to view and copy this password.
            </p>

            <Input
              label="Wi-Fi Network Name (SSID)"
              value={formData.wifiSsid || ''}
              onChange={(e) => handleChange('wifiSsid', e.target.value)}
              placeholder="Kabun_Guest_WiFi"
              leftIcon={<Wifi className="w-4 h-4 text-[#71717A]" />}
            />

            <Input
              label="Wi-Fi Password"
              value={formData.wifiPassword || ''}
              onChange={(e) => handleChange('wifiPassword', e.target.value)}
              placeholder="craftedfromcoffee"
            />
          </div>
        )}

        {/* Tab 3: Story & Quotes */}
        {activeTab === 'story' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Philosophy Section Eyebrow"
                value={formData.philosophyEyebrow || ''}
                onChange={(e) => handleChange('philosophyEyebrow', e.target.value)}
                placeholder="Our Roastery Craft"
              />
              <Input
                label="Philosophy Section Title"
                value={formData.philosophyTitle || ''}
                onChange={(e) => handleChange('philosophyTitle', e.target.value)}
                placeholder="BORN IN ETHIOPIA. CRAFTED WITH OBSESSIVE PASSION."
              />
            </div>

            <TextArea
              label="Philosophy Description"
              value={formData.philosophyDescription || ''}
              onChange={(e) => handleChange('philosophyDescription', e.target.value)}
              placeholder="Kabun is more than a café — it is a sanctuary for coffee lovers..."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Featured Quote"
                value={formData.manifestoQuote || ''}
                onChange={(e) => handleChange('manifestoQuote', e.target.value)}
                placeholder="Every great conversation begins with an exceptional roast."
                leftIcon={<MessageSquareQuote className="w-4 h-4 text-[#71717A]" />}
              />
              <Input
                label="Quote Attribution / Author"
                value={formData.manifestoAuthor || ''}
                onChange={(e) => handleChange('manifestoAuthor', e.target.value)}
                placeholder="The Roaster's Manifesto"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input
                label="Atmosphere Gallery Title"
                value={formData.galleryTitle || ''}
                onChange={(e) => handleChange('galleryTitle', e.target.value)}
                placeholder="ATMOSPHERE & ARTISAN ROASTS"
              />
              <Input
                label="Gallery Description"
                value={formData.galleryDescription || ''}
                onChange={(e) => handleChange('galleryDescription', e.target.value)}
                placeholder="A glimpse into our warm wood interiors, illuminated night storefront..."
              />
            </div>
          </div>
        )}

        {/* Tab 4: Contact, Hours & Social */}
        {activeTab === 'contact' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Address Line 1"
                value={formData.addressLine1 || ''}
                onChange={(e) => handleChange('addressLine1', e.target.value)}
                placeholder="Mekelle, Tigray, Ethiopia"
                leftIcon={<MapPin className="w-4 h-4 text-[#71717A]" />}
              />
              <Input
                label="Address Line 2 / Landmark"
                value={formData.addressLine2 || ''}
                onChange={(e) => handleChange('addressLine2', e.target.value)}
                placeholder="ካቡን ኮፊ እና ሮስተሪ (Kebele 17 / Main Roastery)"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Roastery Operating Hours"
                value={formData.openingHours || ''}
                onChange={(e) => handleChange('openingHours', e.target.value)}
                placeholder="7:00 AM – 10:30 PM"
                leftIcon={<Clock className="w-4 h-4 text-[#71717A]" />}
              />
              <Input
                label="Primary Phone Number"
                value={formData.phone1 || ''}
                onChange={(e) => handleChange('phone1', e.target.value)}
                placeholder="0914000000"
                leftIcon={<Phone className="w-4 h-4 text-[#71717A]" />}
              />
              <Input
                label="Secondary Phone Number"
                value={formData.phone2 || ''}
                onChange={(e) => handleChange('phone2', e.target.value)}
                placeholder="0920000000"
                leftIcon={<Phone className="w-4 h-4 text-[#71717A]" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input
                label="Instagram Handle"
                value={formData.instagramHandle || ''}
                onChange={(e) => handleChange('instagramHandle', e.target.value)}
                placeholder="@MEREBA_FRIENDS_GARDEN"
              />
              <Input
                label="Instagram Profile Link"
                value={formData.instagramUrl || ''}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                placeholder="https://www.instagram.com/mereba_friends_garden/"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="TikTok Handle"
                value={formData.tiktokHandle || ''}
                onChange={(e) => handleChange('tiktokHandle', e.target.value)}
                placeholder="@FRIENDS_GARDEN"
              />
              <Input
                label="TikTok Profile Link"
                value={formData.tiktokUrl || ''}
                onChange={(e) => handleChange('tiktokUrl', e.target.value)}
                placeholder="https://www.tiktok.com/@friends_garden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Facebook Title"
                value={formData.facebookHandle || ''}
                onChange={(e) => handleChange('facebookHandle', e.target.value)}
                placeholder="FB: FRIENDS GARDEN - መረባ ፍሬንድስ"
              />
              <Input
                label="Facebook Page Link"
                value={formData.facebookUrl || ''}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                placeholder="https://www.facebook.com/..."
              />
            </div>
          </div>
        )}

        {/* Tab 5: Colors & Fonts */}
        {activeTab === 'appearance' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Default QR Scanner Theme */}
            <div className="bg-[#0a0a0a] border border-[#222222] p-5 rounded-xl space-y-3">
              <div>
                <label className="block text-xs font-headline uppercase tracking-wider font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E5CFAF]" />
                  <span>Default Ambiance for First-Time QR Scanners</span>
                </label>
                <p className="text-[11px] text-[#A1A1AA] mt-0.5">
                  Choose which visual theme loads by default when guests scan your table QR tents. Guests can toggle anytime.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* Midnight Roastery */}
                <button
                  type="button"
                  onClick={() => handleChange('defaultTheme', 'dark')}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                    (formData.defaultTheme || 'dark') === 'dark'
                      ? 'bg-[#0E2F2C] border-[#E5CFAF] shadow-[0_0_15px_rgba(229,207,175,0.25)]'
                      : 'bg-[#121212] border-[#222222] hover:border-[#333333]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#081E1C] border border-[#1D4D47] flex items-center justify-center shrink-0 text-[#E5CFAF] text-sm">
                    🌙
                  </div>
                  <div>
                    <p className="font-headline text-xs font-bold text-white uppercase tracking-wider">
                      Midnight Roastery (Dark Teal)
                    </p>
                    <p className="text-[11px] text-[#C5D5D3] mt-0.5 leading-relaxed">
                      Deep Roastery Forest Teal canvas with warm roasted cream accents. Ideal for cozy evening ambiance and signature night roastery aesthetics.
                    </p>
                  </div>
                </button>

                {/* Roastery Cream */}
                <button
                  type="button"
                  onClick={() => handleChange('defaultTheme', 'cream')}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                    formData.defaultTheme === 'cream'
                      ? 'bg-[#F5EBDD] border-[#0E2F2C] text-[#0E2F2C] shadow-[0_0_15px_rgba(14,47,44,0.2)]'
                      : 'bg-[#121212] border-[#222222] hover:border-[#333333]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#EADAC3] border border-[#DFC9AA] flex items-center justify-center shrink-0 text-[#0E2F2C] text-sm">
                    ☀️
                  </div>
                  <div>
                    <p className={`font-headline text-xs font-bold uppercase tracking-wider ${formData.defaultTheme === 'cream' ? 'text-[#0E2F2C]' : 'text-white'}`}>
                      Roastery Cream (Warm Light)
                    </p>
                    <p className={`text-[11px] mt-0.5 leading-relaxed ${formData.defaultTheme === 'cream' ? 'text-[#3D524F]' : 'text-[#A1A1AA]'}`}>
                      Warm Roasted Oat parchment background with deep forest teal typography and crisp ivory cards. Perfect for sunlit morning café dining.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Accent Color */}
              <div className="bg-[#0a0a0a] border border-[#222222] p-4 rounded-xl space-y-2">
                <label className="block text-xs font-headline uppercase tracking-wider font-bold text-white">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.accentColor || '#E5CFAF'}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={formData.accentColor || '#E5CFAF'}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="bg-[#121212] text-white text-xs font-mono px-3 py-2 rounded-lg border border-[#222222] flex-1"
                  />
                </div>
                <p className="text-[10px] text-[#A1A1AA]">
                  Warm Roasted Oat / Parchment Cream accent (#E5CFAF).
                </p>
              </div>

              {/* Background Color */}
              <div className="bg-[#0a0a0a] border border-[#222222] p-4 rounded-xl space-y-2">
                <label className="block text-xs font-headline uppercase tracking-wider font-bold text-white">
                  Page Background
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.backgroundColor || '#0E2F2C'}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={formData.backgroundColor || '#0E2F2C'}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="bg-[#121212] text-white text-xs font-mono px-3 py-2 rounded-lg border border-[#222222] flex-1"
                  />
                </div>
                <p className="text-[10px] text-[#A1A1AA]">
                  Deep Roastery Forest Teal canvas background (#0E2F2C).
                </p>
              </div>

              {/* Card Color */}
              <div className="bg-[#0a0a0a] border border-[#222222] p-4 rounded-xl space-y-2">
                <label className="block text-xs font-headline uppercase tracking-wider font-bold text-white">
                  Menu Card Surface
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.cardColor || '#143834'}
                    onChange={(e) => handleChange('cardColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={formData.cardColor || '#143834'}
                    onChange={(e) => handleChange('cardColor', e.target.value)}
                    className="bg-[#121212] text-white text-xs font-mono px-3 py-2 rounded-lg border border-[#222222] flex-1"
                  />
                </div>
                <p className="text-[10px] text-[#A1A1AA]">
                  Surface tint for coffee and bakery cards (#143834).
                </p>
              </div>
            </div>

            {/* Typography Selection */}
            <div className="bg-[#0a0a0a] border border-[#222222] p-5 rounded-xl space-y-3">
              <label className="block text-xs font-headline uppercase tracking-wider font-bold text-white flex items-center gap-2">
                <Type className="w-4 h-4 text-white" />
                <span>Primary Headline Font Family</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Plus Jakarta Sans', label: 'Modern Sans (Plus Jakarta Sans)' },
                  { name: 'Outfit', label: 'Bold Display (Outfit)' },
                  { name: 'Cinzel', label: 'Luxury Editorial Serif (Cinzel)' },
                ].map((f) => (
                  <button
                    key={f.name}
                    type="button"
                    onClick={() => handleChange('fontFamily', f.name)}
                    className={`p-3.5 rounded-xl text-left border transition-all ${
                      formData.fontFamily === f.name
                        ? 'bg-white text-black font-extrabold border-white'
                        : 'bg-[#121212] text-[#A1A1AA] hover:text-white border-[#222222]'
                    }`}
                  >
                    <p className="text-sm font-bold">{f.name}</p>
                    <p className="text-[10px] opacity-75 mt-0.5">{f.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-[#222222]">
          <p className="text-xs text-[#A1A1AA]">
            Changes apply instantly to the digital customer menu.
          </p>

          <Button
            variant="yellow"
            type="submit"
            size="md"
            isLoading={updateMutation.isPending}
            leftIcon={saveSuccess ? <Check className="w-4 h-4 text-black" /> : <Save className="w-4 h-4 text-black font-bold" />}
          >
            {saveSuccess ? 'Saved Live!' : 'Save Live Changes'}
          </Button>
        </div>
      </form>

      {/* Confirmation Modal: Restore to Default */}
      <Modal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        title="Restore All Settings to Kabun Default?"
        subtitle="This will reset all custom texts, topics, colors, and Wi-Fi credentials back to Kabun Coffee defaults"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#A1A1AA]">
            Are you sure you want to revert all site customizations back to Kabun Coffee + Roastery defaults? Menu items and sections will be preserved.
          </p>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="secondary" onClick={() => setIsResetConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="yellow"
              onClick={handleReset}
              isLoading={resetMutation.isPending}
              leftIcon={<RotateCcw className="w-4 h-4 text-black" />}
            >
              Restore to Default
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

