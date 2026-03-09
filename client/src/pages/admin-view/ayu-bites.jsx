import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { ayuBiteFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { fetchAllAdminSubscriptions, getAdminSubscriptionAnalytics, updateSubscriptionByAdmin } from "@/store/admin/subscription-slice";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit2, Trash2, Plus, Package, Info } from "lucide-react";

const initialAyuBiteData = {
  title: "",
  description: "",
  category: "ayu-bite",
  price: 0,
  salePrice: 0,
  totalStock: 999,
  isSubscriptionEligible: "true",
  weeklyDiscount: 10,
  monthlyDiscount: 20,
};

function AdminAyuBites() {
  const [openCreateAyuBitesDialog, setOpenCreateAyuBitesDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialAyuBiteData);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const { subscriptionList, analytics } = useSelector((state) => state.adminSubscription);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("inventory");
  const [selectedSub, setSelectedSub] = useState(null);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  const ayuBiteList = productList.filter((item) => item.category === "ayu-bite");

  function onSubmit(event) {
    event.preventDefault();

    const payload = {
      ...formData,
      category: "ayu-bite",
      isSubscriptionEligible: "true",
      frequencies: "weekly,monthly,one-time",
    };

    currentEditedId !== null
      ? dispatch(
        editProduct({
          id: currentEditedId,
          formData: payload,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialAyuBiteData);
          setOpenCreateAyuBitesDialog(false);
          setCurrentEditedId(null);
          toast({ title: "Manifest updated successfully" });
        }
      })
      : dispatch(
        addNewProduct(payload)
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateAyuBitesDialog(false);
          setFormData(initialAyuBiteData);
          toast({ title: "New Wisdom manifested in the catalog" });
        }
      });
  }

  function handleEdit(product) {
    setCurrentEditedId(product._id);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      weeklyDiscount: product.subscriptionOptions?.discounts?.weekly || 10,
      monthlyDiscount: product.subscriptionOptions?.discounts?.monthly || 20,
      category: "ayu-bite",
      isSubscriptionEligible: "true",
      totalStock: 999
    });
    setOpenCreateAyuBitesDialog(true);
  }

  function handleDelete(id) {
    dispatch(deleteProduct(id)).then(() => dispatch(fetchAllProducts()));
  }

  const handleSubUpdate = async (id, status) => {
    await dispatch(updateSubscriptionByAdmin({ id, formData: { status, note: "Updated from Ayu Mgmt" } }));
    dispatch(fetchAllAdminSubscriptions());
    dispatch(getAdminSubscriptionAnalytics());
  };

  const getStatusBadge = (status) => {
    const colors = { active: "bg-amber-500", paused: "bg-yellow-500", cancelled: "bg-red-500", payment_failed: "bg-red-700" };
    return <Badge className={`${colors[status] || "bg-gray-500"} capitalize`}>{status}</Badge>;
  };

  function isFormValid() {
    return (
      formData.title !== "" &&
      formData.description !== "" &&
      formData.price > 0
    );
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllAdminSubscriptions());
    dispatch(getAdminSubscriptionAnalytics());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="bg-[#fcfaf7] dark:bg-[#1a0505] min-h-screen p-8 font-sans antialiased text-[#1a0505] dark:text-white rounded-[2.5rem] border-2 border-[#1a0505]/5 dark:border-white/5 transition-colors duration-500 shadow-xl shadow-[#1a0505]/5">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-amber-500/10 dark:border-white/5 pb-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-[0.9] drop-shadow-sm">Ayu <span className="text-amber-500">Management</span></h1>
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 bg-amber-500"></div>
              <p className="text-[10px] font-black uppercase tracking-[4px] text-stone-500 dark:text-gray-500 italic">Unified Ritual Archiving System</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="inventory" className="w-full" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
            <TabsList className="bg-stone-100 dark:bg-white/5 p-1 rounded-xl h-12 border border-stone-200 dark:border-white/5 shrink-0 shadow-sm">
              <TabsTrigger value="inventory" className="px-8 font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-amber-500 data-[state=active]:text-[#1a0505] rounded-lg transition-all">Inventory Archive</TabsTrigger>
              <TabsTrigger value="subscriptions" className="px-8 font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-amber-500 data-[state=active]:text-[#1a0505] rounded-lg transition-all">Rituals Archiving</TabsTrigger>
            </TabsList>

            {activeTab === "inventory" && (
              <Button
                onClick={() => {
                  setOpenCreateAyuBitesDialog(true);
                  setFormData(initialAyuBiteData);
                  setCurrentEditedId(null);
                }}
                className="h-12 px-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#1a0505] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center gap-3 shadow-md shadow-amber-500/20"
              >
                <Plus className="w-5 h-5" /> Manifest New Item
              </Button>
            )}
          </div>

          <TabsContent value="inventory" className="animate-in slide-in-from-bottom-5 duration-700">
            <div className="grid grid-cols-1 gap-4">
              {ayuBiteList && ayuBiteList.length > 0 ? (
                ayuBiteList.map((product) => (
                  <div
                    key={product._id}
                    className="group bg-white dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5"
                  >
                    <div className="flex items-center gap-8 w-full">
                      <div className="w-16 h-16 rounded-xl bg-[#1a0505] dark:bg-amber-500/10 flex-shrink-0 flex items-center justify-center border-2 border-amber-500/20 shadow-lg overflow-hidden">
                        <Package className="w-8 h-8 text-amber-500" />
                      </div>
                      <div className="space-y-2 overflow-hidden flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-black uppercase tracking-tight text-[#1a0505] dark:text-white leading-none">{product.title}</h3>
                          <Badge className="bg-stone-50 text-stone-400 border-none font-bold text-[8px] uppercase tracking-widest h-5 px-2">Archived Item</Badge>
                        </div>
                        <p className="text-[12px] font-semibold text-stone-500 dark:text-gray-500 max-w-xl leading-relaxed uppercase tracking-tight line-clamp-1">{product.description}</p>
                        <div className="flex flex-wrap items-center gap-10 mt-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black uppercase tracking-[2px] text-amber-500/70">Base price</span>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-black text-[#1a0505] dark:text-white">£{product.price}</span>
                              <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest">/ cycle</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-1 border-l-2 border-stone-100 pl-10 dark:border-white/5">
                            <span className="text-[9px] font-black uppercase tracking-[2px] text-amber-500/70">Ritual Discounts</span>
                            <div className="flex items-center gap-3">
                              <div className="bg-[#1a0505] text-amber-500 px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest">
                                Wk: -{product.subscriptionOptions?.discounts?.weekly || 10}%
                              </div>
                              <div className="bg-[#1a0505] text-amber-500 px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest">
                                Mo: -{product.subscriptionOptions?.discounts?.monthly || 20}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <Button
                        onClick={() => handleEdit(product)}
                        className="h-12 w-12 rounded-xl bg-[#1a0505] dark:bg-white/5 hover:bg-black text-amber-500 dark:text-white p-0 transition-all border border-amber-500/20"
                      >
                        <Edit2 className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(product._id)}
                        className="h-12 w-12 rounded-xl bg-white dark:bg-red-500/10 hover:bg-red-50 text-red-500 dark:text-red-500 p-0 transition-all border border-red-100 dark:border-red-500/20"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-40 text-center border-4 border-dashed border-stone-200 dark:border-white/5 rounded-[5rem] group hover:border-amber-500/30 transition-all bg-white/50 dark:bg-transparent">
                  <div className="mb-8 text-amber-500/20 flex justify-center"><Package size={80} /></div>
                  <h2 className="text-xl font-black uppercase tracking-[8px] text-[#1a0505] dark:text-gray-600 mb-4 italic">Archive is Void</h2>
                  <p className="text-[12px] font-bold text-stone-500 uppercase tracking-widest max-w-sm mx-auto leading-loose">The digital vault awaits the manifestation of your first Ayu ritual product.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="subscriptions" className="animate-in slide-in-from-bottom-5 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white dark:bg-white/5 p-10 rounded-[2.5rem] border border-stone-200 dark:border-white/5 space-y-4 shadow-xl shadow-stone-200/40 dark:shadow-none">
                <p className="text-[10px] font-black uppercase tracking-[3px] text-stone-400 dark:text-gray-500">Active Ritualists</p>
                <p className="text-5xl font-black text-[#1a0505] dark:text-white leading-none">{analytics?.totalActive || 0}</p>
              </div>
              <div className="bg-white dark:bg-white/5 p-10 rounded-[2.5rem] border border-stone-200 dark:border-white/5 space-y-4 shadow-xl shadow-stone-200/40 dark:shadow-none">
                <p className="text-[10px] font-black uppercase tracking-[3px] text-stone-400 dark:text-gray-500">Estimated MRR</p>
                <p className="text-5xl font-black text-amber-500 leading-none">£{analytics?.mrr?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-white dark:bg-white/5 p-10 rounded-[2.5rem] border border-stone-200 dark:border-white/5 space-y-4 shadow-xl shadow-stone-200/40 dark:shadow-none">
                <p className="text-[10px] font-black uppercase tracking-[3px] text-stone-400 dark:text-gray-500">Paused Cycles</p>
                <p className="text-5xl font-black text-yellow-500 leading-none">{analytics?.totalPaused || 0}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded-[3rem] overflow-hidden shadow-2xl shadow-stone-200/60 dark:shadow-none">
              <Table className="border-collapse">
                <TableHeader className="bg-stone-50 dark:bg-[#200808]">
                  <TableRow className="border-stone-200 dark:border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-transparent">
                    <TableHead className="text-[#1a0505] dark:text-white h-20 px-10">Ayu Ritualist</TableHead>
                    <TableHead className="text-[#1a0505] dark:text-white h-20">Ritual Manifest</TableHead>
                    <TableHead className="text-[#1a0505] dark:text-white h-20">Cycle</TableHead>
                    <TableHead className="text-[#1a0505] dark:text-white h-20">Next Protocol</TableHead>
                    <TableHead className="text-[#1a0505] dark:text-white h-20 text-center">Protocol Status</TableHead>
                    <TableHead className="text-[#1a0505] dark:text-white h-20 text-right px-10">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptionList && subscriptionList.map((sub) => (
                    <TableRow key={sub._id} className="border-stone-100 dark:border-white/5 hover:bg-stone-50/50 dark:hover:bg-white/[0.03] transition-colors">
                      <TableCell className="px-10 py-8">
                        <div className="text-[15px] font-bold text-[#1a0505] dark:text-white">{sub.userId?.userName}</div>
                        <div className="text-[11px] text-stone-500 dark:text-gray-500 font-medium">{sub.userId?.email}</div>
                      </TableCell>
                      <TableCell className="text-[14px] font-medium text-stone-600 dark:text-gray-300">{sub.productId?.title}</TableCell>
                      <TableCell className="text-[10px] font-black uppercase tracking-wider text-stone-500">{sub.frequency}</TableCell>
                      <TableCell className="text-[11px] font-bold text-[#1a0505] dark:text-white">{new Date(sub.nextBillingDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-center">{getStatusBadge(sub.status)}</TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" className="h-10 px-4 text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/5 hover:bg-amber-500 hover:text-[#1a0505] rounded-xl" onClick={() => { setSelectedSub(sub); setIsSubModalOpen(true); }}>Inspect</Button>
                          {sub.status === "active" && <Button variant="ghost" className="h-10 px-4 text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-xl" onClick={() => handleSubUpdate(sub._id, "paused")}>Halt</Button>}
                          {sub.status === "paused" && <Button variant="ghost" className="h-10 px-4 text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 hover:bg-green-500 hover:text-white rounded-xl" onClick={() => handleSubUpdate(sub._id, "active")}>Resume</Button>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isSubModalOpen} onOpenChange={setIsSubModalOpen}>
        <DialogContent className="bg-white dark:bg-[#1a0505] border-gray-100 dark:border-white/5 text-gray-900 dark:text-white max-w-2xl p-10 rounded-[3rem]">
          <DialogHeader className="mb-10 border-b border-gray-100 dark:border-white/5 pb-8">
            <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 dark:text-white">Ritual <span className="text-amber-500">Inspection</span></DialogTitle>
          </DialogHeader>
          {selectedSub && (
            <div className="space-y-10">
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <p className="text-[9px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-600">Protocol ID</p>
                  <p className="text-sm font-bold font-mono text-gray-600 dark:text-gray-300">{selectedSub._id}</p>
                </div>
                <div className="space-y-4">
                  <p className="text-[9px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-600">Current Phase</p>
                  <div>{getStatusBadge(selectedSub.status)}</div>
                </div>
                <div className="space-y-4">
                  <p className="text-[9px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-600">Frequency Cycle</p>
                  <p className="text-sm font-bold uppercase text-gray-900 dark:text-white">{selectedSub.frequency}</p>
                </div>
                <div className="space-y-4">
                  <p className="text-[9px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-600">Initialization Date</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{new Date(selectedSub.startDate).toLocaleString()}</p>
                </div>
              </div>

              <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5">
                <h4 className="text-[10px] font-black uppercase tracking-[4px] text-amber-500/60 mb-6 italic italic-none">Protocol Intervention</h4>
                <div className="flex gap-4">
                  <Button variant="ghost" className="flex-1 h-14 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all" onClick={() => handleSubUpdate(selectedSub._id, "cancelled")}>Void Manifestation</Button>
                  <Button variant="ghost" className="flex-1 h-14 rounded-xl bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white text-[10px] font-black uppercase tracking-widest transition-all" onClick={() => alert("Manual payment retry protocol initiated")}>Retry Protocol</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Sheet
        open={openCreateAyuBitesDialog}
        onOpenChange={(val) => {
          if (!val) {
            setOpenCreateAyuBitesDialog(false);
            setCurrentEditedId(null);
            setFormData(initialAyuBiteData);
          }
        }}
      >
        <SheetContent side="right" className="overflow-auto bg-white dark:bg-[#1a0505] border-gray-100 dark:border-white/5 text-gray-900 dark:text-white w-[500px] sm:w-[600px] p-0">
          <div className="h-full flex flex-col">
            <SheetHeader className="p-12 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#200808]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Info className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[4px] text-amber-500 opacity-60 italic">Configuration protocol</span>
              </div>
              <SheetTitle className="text-5xl font-black italic text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
                {currentEditedId !== null ? "Refine" : "Manifest"}<br />
                <span className="text-amber-500">Wisdom</span>
              </SheetTitle>
            </SheetHeader>

            <div className="p-12 space-y-12">
              <div className="space-y-8">
                <CommonForm
                  onSubmit={onSubmit}
                  formData={formData}
                  setFormData={setFormData}
                  buttonText={currentEditedId !== null ? "Save Manifestation" : "Create Product"}
                  formControls={ayuBiteFormElements}
                  isBtnDisabled={!isFormValid()}
                />
                <p className="text-center text-[8px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-600 opacity-60">
                  By manifesting, you align this product with the Ayu Bite ritual flow.
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminAyuBites;
