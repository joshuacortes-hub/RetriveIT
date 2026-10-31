import React, { useState } from 'react';
import { ArrowLeft, Upload, MapPin, Tag, Check, Loader2, Search, Plus, AlertCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBar } from './StatusBar';
import { ItemType, ItemCategory } from '../types';

export const CreatePostScreen: React.FC = () => {
  const { setActiveScreen, addNewPost, isGuest, loginWithGoogle } = useApp();

  const [type, setType] = useState<ItemType>('LOST');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [location, setLocation] = useState('Science Library, 2nd Floor');
  const [locationSearch, setLocationSearch] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  if (isGuest) {
    return (
      <div className="w-full min-h-screen min-h-[100dvh] flex flex-col justify-between bg-[#fcfbf7] text-[#1a1c16] relative overflow-hidden">
        <div className="bg-[#3e462d] text-white pt-[max(0.6rem,env(safe-area-inset-top))] pb-3.5 px-4 shadow-xs">
          <StatusBar dark />
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => setActiveScreen('home')}
              aria-label="Back to home"
              className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} strokeWidth={2.4} />
            </button>
            <h1 className="font-semibold text-sm tracking-wide">Create a New Post</h1>
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-4 border border-amber-200">
            <MapPin size={32} />
          </div>
          <h2 className="text-lg font-bold text-zinc-900">Sign in to Post Items</h2>
          <p className="text-xs text-zinc-600 mt-2 max-w-xs leading-relaxed">
            Only registered and verified community members can post lost or found items to prevent posers and spam listings.
          </p>

          <button
            type="button"
            disabled={googleLoading}
            onClick={async () => {
              setGoogleLoading(true);
              await loginWithGoogle();
              setGoogleLoading(false);
            }}
            className="mt-6 w-full max-w-xs py-3.5 px-4 bg-[#11130e] hover:bg-black text-white rounded-2xl flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm"
          >
            {googleLoading ? (
              <Loader2 size={16} className="animate-spin text-white" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            <span className="font-bold text-xs tracking-wide">Sign in with Google</span>
          </button>

          <button
            onClick={() => setActiveScreen('home')}
            className="mt-4 text-xs text-zinc-500 hover:text-black font-medium underline cursor-pointer"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const campusLocations = [
    'Science Library, 2nd Floor Quiet Study Area',
    'Cafeteria Table 14, North Wing',
    'Engineering Building Room 302',
    'Student Union Lounge (Couches)',
    'Gymnasium Locker Room / Bench A',
    'Campus West Parking Lot B',
    'Main Administration Hallway',
    'Mathematics Hall, Lecture Room 101',
    'Student Center Food Court',
    'Campus Bookstore & Convenience Counter',
    'East Quad Fountain & Benches',
    'Central Bus Stop & Transit Hub',
    'Computer Science Lab 3A',
    'University Sports Complex Bleachers',
    'Arts & Design Gallery Corridor',
    'Medical Clinic Waiting Area',
  ];

  const categories: ItemCategory[] = [
    'Electronics',
    'Wallets & Bags',
    'Keys',
    'Cards & IDs',
    'Jewelry & Watches',
    'Clothing',
    'Books & Notes',
    'Other',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Strictly accept JPG and PNG only
      const isJpgOrPng =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        /\.(jpe?g|png)$/i.test(file.name);

      if (!isJpgOrPng) {
        setUploadError('Only JPG and PNG photo files are accepted.');
        e.target.value = '';
        return;
      }

      setUploadError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredLocations = campusLocations.filter((loc) =>
    loc.toLowerCase().includes(locationSearch.trim().toLowerCase())
  );

  const isExactMatch = campusLocations.some(
    (loc) => loc.toLowerCase() === locationSearch.trim().toLowerCase()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      alert('Please provide details about the item.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addNewPost({
        title: title.trim() || (type === 'FOUND' ? 'Found Item' : 'Lost Item'),
        type,
        details: details.trim(),
        location,
        category,
        imageUrl: imagePreview || undefined,
      });
      setIsSubmitting(false);
      setActiveScreen('home');
    }, 600);
  };

  return (
    <div className="w-full min-h-screen min-h-[100dvh] flex flex-col justify-between bg-[#fcfbf7] text-[#1a1c16] relative overflow-hidden">
      {/* Top Bar with Back Arrow and "Create a New Post" */}
      <div className="bg-[#3e462d] text-white pt-[max(0.6rem,env(safe-area-inset-top))] pb-3.5 px-4 shadow-xs">
        <StatusBar dark />
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => setActiveScreen('home')}
            aria-label="Back to home"
            className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} strokeWidth={2.4} />
          </button>
          <h1 className="font-semibold text-sm tracking-wide">Create a New Post</h1>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col justify-between">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* "Write a comment" / Title input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write a comment / title..."
              className="w-full py-2.5 px-3 bg-white border border-[#dfdbcf] rounded-xl text-sm placeholder:text-zinc-400 focus:outline-none focus:border-[#3e462d] transition-all"
            />
          </div>

          {/* LOST / FOUND Dropdown */}
          <div className="w-48">
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ItemType)}
                className="w-full appearance-none bg-white border border-[#cfc9bb] py-2 px-3 pr-8 rounded-xl text-xs font-bold tracking-wider text-zinc-800 uppercase focus:outline-none focus:border-[#3e462d] cursor-pointer"
              >
                <option value="LOST">LOST ITEM</option>
                <option value="FOUND">FOUND ITEM</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-500">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">Details</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe color, brand, specific marks, time lost or found, condition, etc..."
              rows={5}
              required
              className="w-full p-3.5 bg-white border border-[#dfdbcf] rounded-xl text-xs leading-relaxed placeholder:text-zinc-400 focus:outline-none focus:border-[#3e462d] resize-none"
            />
          </div>

          {/* Preview of Uploaded Image if any */}
          {imagePreview && (
            <div className="relative w-full h-32 bg-zinc-100 rounded-xl overflow-hidden border border-[#dfdbcf] flex items-center justify-center">
              <img src={imagePreview} alt="Item preview" className="h-full object-contain" />
              <button
                type="button"
                onClick={() => setImagePreview('')}
                className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black cursor-pointer"
                title="Remove photo"
              >
                <X size={13} />
              </button>
            </div>
          )}

          {/* Error notice if non-JPG/PNG file was uploaded */}
          {uploadError && (
            <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
              <AlertCircle size={15} className="shrink-0 text-red-600" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Action Buttons: Upload Photos, Location, Category */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            {/* Upload Photos Button (JPG & PNG only) */}
            <label className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-zinc-50 border border-[#dfdbcf] rounded-lg text-xs font-medium text-zinc-700 cursor-pointer shadow-2xs transition-colors">
              <Upload size={14} className="text-zinc-500" />
              <span>Upload Photos</span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Location Button */}
            <button
              type="button"
              onClick={() => {
                setShowLocationPicker(!showLocationPicker);
                setShowCategoryPicker(false);
                setLocationSearch('');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-medium cursor-pointer shadow-2xs transition-colors ${
                showLocationPicker
                  ? 'bg-[#3e462d]/10 border-[#3e462d] text-[#3e462d]'
                  : 'bg-white hover:bg-zinc-50 border-[#dfdbcf] text-zinc-700'
              }`}
            >
              <MapPin size={14} className="text-[#3e462d]" />
              <span className="truncate max-w-[130px]">
                {location ? 'Location: ' + location.split(',')[0] : 'Location'}
              </span>
            </button>

            {/* Category Button */}
            <button
              type="button"
              onClick={() => {
                setShowCategoryPicker(!showCategoryPicker);
                setShowLocationPicker(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-medium cursor-pointer shadow-2xs transition-colors ${
                showCategoryPicker
                  ? 'bg-[#3e462d]/10 border-[#3e462d] text-[#3e462d]'
                  : 'bg-white hover:bg-zinc-50 border-[#dfdbcf] text-zinc-700'
              }`}
            >
              <Tag size={14} className="text-zinc-500" />
              <span>{category}</span>
            </button>
          </div>

          {/* Smart Location Search & Custom Text Typing Drawer */}
          {showLocationPicker && (
            <div className="p-3.5 bg-white rounded-2xl border border-[#dfdbcf] shadow-md flex flex-col gap-2.5 animate-in fade-in-50 duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#3e462d]" />
                  Search or Type Location
                </span>
                <button
                  type="button"
                  onClick={() => setShowLocationPicker(false)}
                  className="text-zinc-400 hover:text-zinc-700 p-0.5 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Live search input + Custom typing */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-zinc-400" />
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (locationSearch.trim()) {
                        setLocation(locationSearch.trim());
                        setShowLocationPicker(false);
                      }
                    }
                  }}
                  placeholder="Type any custom spot or search location..."
                  className="w-full pl-9 pr-8 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#3e462d] focus:bg-white text-zinc-900 placeholder:text-zinc-400"
                  autoFocus
                />
                {locationSearch && (
                  <button
                    type="button"
                    onClick={() => setLocationSearch('')}
                    className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Custom Location Option (when typing custom text not in list) */}
              {locationSearch.trim() && !isExactMatch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocation(locationSearch.trim());
                    setShowLocationPicker(false);
                  }}
                  className="p-2.5 bg-[#3e462d]/5 hover:bg-[#3e462d]/10 border border-[#3e462d]/30 text-[#3e462d] rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Plus size={14} className="shrink-0 text-[#3e462d]" />
                    <span className="truncate">Use custom location: "{locationSearch.trim()}"</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-[#3e462d]/15 rounded">
                    Custom
                  </span>
                </button>
              )}

              {/* Suggestions / Autofill list */}
              <div className="flex flex-col gap-1 max-h-44 overflow-y-auto pr-0.5">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 px-1 pt-1">
                  {locationSearch.trim() ? 'Matching Places' : 'Suggested Locations'}
                </div>
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((loc) => {
                    const isSelected = location === loc;
                    return (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setLocation(loc);
                          setShowLocationPicker(false);
                        }}
                        className={`p-2 text-left text-xs rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#3e462d] text-white font-medium'
                            : 'hover:bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        <span className="truncate pr-2">{loc}</span>
                        {isSelected && <Check size={14} className="shrink-0" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="py-2 px-1 text-xs text-zinc-500">
                    No predefined match. Click "Use custom location" above to save your custom spot!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Category Picker Drawer */}
          {showCategoryPicker && (
            <div className="p-3 bg-white rounded-xl border border-[#dfdbcf] shadow-sm animate-in fade-in-50 duration-150">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-zinc-700">Select Category:</span>
                <button
                  type="button"
                  onClick={() => setShowCategoryPicker(false)}
                  className="text-zinc-400 hover:text-zinc-700 p-0.5 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      setShowCategoryPicker(false);
                    }}
                    className={`p-2 text-left text-xs rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                      category === cat
                        ? 'bg-[#3e462d]/10 text-[#3e462d] font-semibold'
                        : 'hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <span>{cat}</span>
                    {category === cat && <Check size={13} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* Bottom Post Button with safe area */}
        <div className="pt-6 pb-[max(1.25rem,calc(env(safe-area-inset-bottom)+0.75rem))] flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-2.5 bg-[#11130e] hover:bg-[#23261d] active:scale-95 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <span>Post</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
