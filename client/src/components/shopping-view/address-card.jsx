import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { MapPin, Phone, Hash, ChevronRight, Edit2, Trash2, Check } from "lucide-react";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <div
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`group relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer overflow-hidden ${
        isSelected
          ? 'border-amber-500 bg-amber-500/5 shadow-2xl shadow-amber-500/10'
          : 'border-stone-100 dark:border-white/5 bg-white dark:bg-white/[0.03] hover:border-amber-500/20 hover:bg-stone-50/50 dark:hover:bg-white/[0.06] shadow-sm hover:shadow-xl'
      }`}
    >
      {/* Selection Glow */}
      {isSelected && (
        <div className="absolute top-0 right-0 p-5 animate-in zoom-in duration-500">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-[#1a0505] flex items-center justify-center shadow-xl shadow-amber-500/30">
            <Check className="w-4 h-4 stroke-[4]" />
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl transition-all duration-500 shadow-md ${isSelected ? 'bg-amber-500 text-[#1a0505] scale-110' : 'bg-stone-100 dark:bg-white/5 text-stone-400 dark:text-gray-500'}`}>
            <MapPin className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase tracking-[3px] text-stone-400 dark:text-gray-600 italic">Location Protocol</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-black text-xl text-[#1a0505] dark:text-white leading-[1.1] uppercase tracking-tighter italic line-clamp-2">
            {addressInfo?.address}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-stone-400 dark:text-gray-500 uppercase tracking-widest">{addressInfo?.city}</span>
            <div className="w-1 h-1 rounded-full bg-stone-200 dark:bg-white/10" />
            <span className="text-[10px] font-bold text-stone-400 dark:text-gray-500 tracking-widest">{addressInfo?.pincode}</span>
          </div>
        </div>

        <div className="pt-6 flex items-center justify-between border-t border-stone-100 dark:border-white/5">
          <div className="flex items-center gap-3 text-stone-400 dark:text-gray-600">
            <Phone className="w-4 h-4" />
            <span className="text-[11px] font-black tabular-nums tracking-[2px]">{addressInfo?.phone}</span>
          </div>
          
          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleEditAddress(addressInfo);
              }}
              className="p-3 rounded-xl bg-stone-100 dark:bg-white/10 hover:bg-amber-500 hover:text-[#1a0505] transition-all text-stone-400 dark:text-gray-400 shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteAddress(addressInfo);
              }}
              className="p-3 rounded-xl bg-stone-100 dark:bg-white/10 hover:bg-red-500 hover:text-white transition-all text-stone-400 dark:text-gray-400 shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressCard;
