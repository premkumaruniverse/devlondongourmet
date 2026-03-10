import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "../ui/use-toast";
import { Plus, MapPin, Info, Sparkles } from "lucide-react";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  function handleManageAddress(event) {
    event.preventDefault();

    const userId = user?.id || user?._id;

    if (!userId) {
      toast({
        title: "Session Error",
        description: "Your session identity could not be verified. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "Max Limit Reached",
        description: "You can manifest up to 3 delivery locations.",
        variant: "destructive",
      });
      return;
    }

    currentEditedId !== null
      ? dispatch(
          editaAddress({
            userId: user?.id || user?._id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id || user?._id));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            setShowAddressForm(false);
            toast({
              title: "Coordinate Refined",
              description: "The delivery destination has been updated.",
            });
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user?.id || user?._id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id || user?._id));
            setFormData(initialAddressFormData);
            setShowAddressForm(false);
            toast({
              title: "Location Manifested",
              description: "New delivery coordinates added to your archive.",
            });
          }
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id || user?._id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id || user?._id));
        toast({
          title: "Coordinate Dissolved",
          description: "Location removed from your archive.",
        });
      }
    });
  }

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      ...formData,
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      phone: getCurrentAddress?.phone,
      pincode: getCurrentAddress?.pincode,
      notes: getCurrentAddress?.notes,
    });
    setShowAddressForm(true);
  }

  function isFormValid() {
    // Only essential fields for manifestation
    return formData.address.trim() !== "" && 
           formData.city.trim() !== "" && 
           formData.phone.trim() !== "" && 
           formData.pincode.trim() !== "";
  }

  useEffect(() => {
    const userId = user?.id || user?._id;
    if (userId) {
      dispatch(fetchAllAddresses(userId));
    }
  }, [dispatch, user?.id, user?._id]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Existing Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addressList && addressList.length > 0 ? (
          addressList.map((singleAddressItem) => (
            <AddressCard
              key={singleAddressItem._id}
              selectedId={selectedId}
              handleDeleteAddress={handleDeleteAddress}
              addressInfo={singleAddressItem}
              handleEditAddress={handleEditAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          ))
        ) : !showAddressForm ? (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-stone-200 dark:border-white/5 rounded-[2.5rem] bg-white dark:bg-white/[0.02] shadow-inner">
            <div className="flex justify-center mb-6 opacity-20 text-stone-400 dark:text-white"><MapPin size={48} /></div>
            <p className="text-stone-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px]">No delivery coordinates found in archive.</p>
          </div>
        ) : null}

        {/* Add New Address Trigger */}
        {!showAddressForm && addressList.length < 3 && (
          <button 
            onClick={() => {
              setShowAddressForm(true);
              setCurrentEditedId(null);
              setFormData(initialAddressFormData);
            }}
            className="flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 border-dashed border-stone-200 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/[0.05] hover:border-amber-500/40 transition-all text-stone-400 dark:text-gray-500 hover:text-amber-500 group min-h-[160px] shadow-sm hover:shadow-lg"
          >
            <div className="p-3 rounded-2xl bg-stone-100 dark:bg-white/5 group-hover:bg-amber-500 group-hover:text-[#1a0505] transition-all mb-4 shadow-sm">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[3px]">Manifest New Location</span>
          </button>
        )}
      </div>

      {/* Address Form Section */}
      {showAddressForm && (
        <div className="bg-white dark:bg-[#1a0606] p-10 rounded-[3rem] border-2 border-stone-200 dark:border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] dark:shadow-none animate-in slide-in-from-bottom-10 space-y-10">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/5 pb-8">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-amber-500 text-[#1a0505] rounded-2xl shadow-lg shadow-amber-500/20">
                  <Sparkles className="w-5 h-5" />
               </div>
               <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-[#1a0505] dark:text-white italic">
                    {currentEditedId !== null ? "Refine Coordinate" : "New Manifestation"}
                  </h3>
                  <p className="text-[9px] font-black uppercase tracking-[2px] text-stone-400 dark:text-gray-500 italic">Aligning delivery protocols</p>
               </div>
            </div>
            <button 
              onClick={() => setShowAddressForm(false)}
              className="text-[10px] font-black uppercase tracking-[2px] text-stone-400 dark:text-gray-500 hover:text-amber-500 transition-colors"
            >
              Cancel
            </button>
          </div>

          <CardContent className="p-0">
            <CommonForm
              formControls={addressFormControls}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Save Manifestation" : "Initialize Location"}
              onSubmit={handleManageAddress}
              isBtnDisabled={!isFormValid()}
            />
          </CardContent>
        </div>
      )}
    </div>
  );
}

export default Address;
