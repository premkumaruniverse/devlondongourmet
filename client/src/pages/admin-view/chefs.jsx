import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminChefTile from "@/components/admin-view/chef-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addChefFormElements } from "@/config";
import {
  addNewChef,
  deleteChef,
  editChef,
  fetchAllChefs,
} from "@/store/admin/chefs-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  name: "",
  title: "",
  bio: "",
  experience: "",
  bestAdvice: "",
  memberships: "",
  recognition: "",
  specializations: "",
  email: "",
  linkedin: "",
  twitter: "",
  instagram: "",
  isActive: "true",
  order: "0",
};

function AdminChefs() {
  const [openCreateChefsDialog, setOpenCreateChefsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { chefList } = useSelector((state) => state.adminChefs);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    // Prepare social links object
    const socialLinks = {
      linkedin: formData.linkedin,
      twitter: formData.twitter,
      instagram: formData.instagram,
    };

    const chefData = {
      ...formData,
      image: uploadedImageUrl,
      socialLinks: JSON.stringify(socialLinks),
    };

    currentEditedId !== null
      ? dispatch(
          editChef({
            id: currentEditedId,
            formData: chefData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllChefs());
            setFormData(initialFormData);
            setOpenCreateChefsDialog(false);
            setCurrentEditedId(null);
            toast({
              title: "Chef updated successfully",
            });
          }
        })
      : dispatch(addNewChef(chefData)).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllChefs());
            setOpenCreateChefsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({
              title: "Chef added successfully",
            });
          }
        });
  }

  useEffect(() => {
    if (uploadedImageUrl) {
      setFormData((prev) => ({
        ...prev,
        image: uploadedImageUrl,
      }));
    }
  }, [uploadedImageUrl]);

  function handleDelete(getCurrentChefId) {
    dispatch(deleteChef(getCurrentChefId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllChefs());
        toast({
          title: "Chef deleted successfully",
        });
      }
    });
  }

  function isFormValid() {
    const requiredFields = ['name', 'title', 'bio'];
    return requiredFields.every(key => formData[key] !== "");
  }

  useEffect(() => {
    dispatch(fetchAllChefs());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateChefsDialog(true)}>
          Add New Chef
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {chefList && chefList.length > 0
          ? chefList.map((chefItem) => (
              <AdminChefTile
                key={chefItem._id}
                setFormData={setFormData}
                setOpenCreateChefsDialog={setOpenCreateChefsDialog}
                setCurrentEditedId={setCurrentEditedId}
                chef={chefItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateChefsDialog}
        onOpenChange={() => {
          setOpenCreateChefsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Chef" : "Add New Chef"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addChefFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminChefs;
