import ClubImageUpload from "@/components/admin-view/image-upload";
import AdminClubTile from "@/components/admin-view/club-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addClubFormElements } from "@/config";
import {
  addNewClub,
  deleteClub,
  editClub,
  fetchAllClubs,
  fetchAllChefs,
} from "@/store/admin/clubs-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  title: "",
  description: "",
  experience_type: "",
  theme: "",
  images: [],
  host_id: "",
  is_members_only: "false",
  menu_details: "",
  dietary_notes: "",
  cancellation_policy: "",
  status: "DRAFT",
};

function AdminClubs() {
  const [openCreateClubsDialog, setOpenCreateClubsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { clubList, chefsList } = useSelector((state) => state.adminClubs);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Fetch chefs on component mount
  useEffect(() => {
    dispatch(fetchAllChefs());
  }, [dispatch]);

  // Update form elements with chef options
  const formElementsWithChefs = addClubFormElements.map(element => {
    if (element.name === "host_id") {
      return {
        ...element,
        options: chefsList.map(chef => ({
          id: chef._id,
          label: `${chef.name} - ${chef.title}`,
        })),
      };
    }
    return element;
  });

  function onSubmit(event) {
    event.preventDefault();

    const processedFormData = {
      ...formData,
      images: uploadedImageUrl ? [uploadedImageUrl] : formData.images,
      is_members_only: formData.is_members_only === "true",
    };

    currentEditedId !== null
      ? dispatch(
          editClub({
            id: currentEditedId,
            formData: processedFormData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllClubs());
            setFormData(initialFormData);
            setOpenCreateClubsDialog(false);
            setCurrentEditedId(null);
            toast({
              title: "Club updated successfully",
            });
          }
        })
      : dispatch(
          addNewClub(processedFormData)
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllClubs());
            setOpenCreateClubsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({
              title: "Club added successfully",
            });
          }
        });
  }

  useEffect(() => {
    if (uploadedImageUrl) {
      setFormData((prev) => ({
        ...prev,
        images: [uploadedImageUrl],
      }));
    }
  }, [uploadedImageUrl]);

  function handleDelete(getCurrentClubId) {
    dispatch(deleteClub(getCurrentClubId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllClubs());
        toast({
          title: "Club deleted successfully",
        });
      }
    });
  }

  function isFormValid() {
    const requiredFields = ["title", "description", "experience_type", "host_id"];
    return requiredFields.every(field => formData[field] && formData[field].trim() !== "");
  }

  useEffect(() => {
    dispatch(fetchAllClubs());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateClubsDialog(true)}>
          Add New Club
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {clubList && clubList.length > 0
          ? clubList.map((clubItem) => (
              <AdminClubTile
                key={clubItem._id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateClubsDialog}
                setCurrentEditedId={setCurrentEditedId}
                club={clubItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateClubsDialog}
        onOpenChange={() => {
          setOpenCreateClubsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Club" : "Add New Club"}
            </SheetTitle>
          </SheetHeader>
          <ClubImageUpload
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
              formControls={formElementsWithChefs}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminClubs;
