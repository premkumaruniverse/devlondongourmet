import ProductImageUpload from "@/components/admin-view/image-upload";
import PdfUpload from "@/components/admin-view/pdf-upload";
import AdminServiceTile from "@/components/admin-view/service-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addServiceFormElements } from "@/config";
import {
  addNewService,
  deleteService,
  editService,
  fetchAllServices,
} from "@/store/admin/services-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  pdfUrl: "",
};

function AdminServices() {
  const [openCreateServicesDialog, setOpenCreateServicesDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState("");
  const [pdfLoadingState, setPdfLoadingState] = useState(false);

  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { serviceList } = useSelector((state) => state.adminServices);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editService({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllServices());
            setFormData(initialFormData);
            setOpenCreateServicesDialog(false);
            setCurrentEditedId(null);
            setImageFile(null);
            setPdfFile(null);
            setUploadedImageUrl("");
            setUploadedPdfUrl("");
          }
        })
      : dispatch(
          addNewService({
            ...formData,
            image: uploadedImageUrl,
            pdfUrl: uploadedPdfUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllServices());
            setOpenCreateServicesDialog(false);
            setImageFile(null);
            setPdfFile(null);
            setUploadedImageUrl("");
            setUploadedPdfUrl("");
            setFormData(initialFormData);
            toast({
              title: "Service added successfully",
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

  useEffect(() => {
    if (uploadedPdfUrl) {
      setFormData((prev) => ({
        ...prev,
        pdfUrl: uploadedPdfUrl,
      }));
    }
  }, [uploadedPdfUrl]);

  function handleDelete(getCurrentServiceId) {
    dispatch(deleteService(getCurrentServiceId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllServices());
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllServices());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateServicesDialog(true)}>
          Add New Service
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {serviceList && serviceList.length > 0
          ? serviceList.map((serviceItem) => (
              <AdminServiceTile
                key={serviceItem._id}
                setFormData={setFormData}
                setOpenCreateServicesDialog={setOpenCreateServicesDialog}
                setCurrentEditedId={setCurrentEditedId}
                service={serviceItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateServicesDialog}
        onOpenChange={() => {
          setOpenCreateServicesDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setImageFile(null);
          setPdfFile(null);
          setUploadedImageUrl("");
          setUploadedPdfUrl("");
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Service" : "Add New Service"}
            </SheetTitle>
            <SheetDescription className="sr-only">
              {currentEditedId !== null ? "Edit the existing service" : "Create a new service"}
            </SheetDescription>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
            currentImage={formData.image}
          />
          <PdfUpload
            pdfFile={pdfFile}
            setPdfFile={setPdfFile}
            uploadedPdfUrl={uploadedPdfUrl}
            setUploadedPdfUrl={setUploadedPdfUrl}
            pdfLoadingState={pdfLoadingState}
            setPdfLoadingState={setPdfLoadingState}
            isEditMode={currentEditedId !== null}
            currentPdf={formData.pdfUrl}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addServiceFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminServices;
