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
import { addClubFormElements, addEventScheduleFormElements } from "@/config";
import {
  addNewClub,
  deleteClub,
  editClub,
  fetchAllClubs,
  fetchAllChefs,
  addEventSchedule,
  fetchEventSchedules,
} from "@/store/admin/clubs-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, ClockIcon, UsersIcon, DollarSignIcon } from "lucide-react";

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
  default_duration: "",
  default_group_size: "",
  default_location_description: "",
};

const initialScheduleFormData = {
  date: "",
  start_time: "",
  duration: "",
  seat_limit: "",
  price_per_guest: "",
};

function AdminClubs() {
  const [openCreateClubsDialog, setOpenCreateClubsDialog] = useState(false);
  const [openManageSchedulesDialog, setOpenManageSchedulesDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [scheduleFormData, setScheduleFormData] = useState(initialScheduleFormData);
  const [selectedClubForSchedules, setSelectedClubForSchedules] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { clubList, chefsList, schedules } = useSelector((state) => state.adminClubs);
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

  function onScheduleSubmit(event) {
    event.preventDefault();
    
    dispatch(addEventSchedule({
      ...scheduleFormData,
      club_id: selectedClubForSchedules?._id
    })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchEventSchedules(selectedClubForSchedules?._id));
        setScheduleFormData(initialScheduleFormData);
        toast({
          title: "Schedule added successfully",
        });
      }
    });
  }

  function handleManageSchedules(club) {
    setSelectedClubForSchedules(club);
    dispatch(fetchEventSchedules(club._id));
    setOpenManageSchedulesDialog(true);
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

  function isScheduleFormValid() {
    return scheduleFormData.date && scheduleFormData.start_time && scheduleFormData.seat_limit && scheduleFormData.price_per_guest;
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
                onManageSchedules={handleManageSchedules}
              />
            ))
          : null}
      </div>

      {/* Club Edit/Create Sheet */}
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

      {/* Schedule Management Sheet */}
      <Sheet
        open={openManageSchedulesDialog}
        onOpenChange={() => {
          setOpenManageSchedulesDialog(false);
          setSelectedClubForSchedules(null);
          setScheduleFormData(initialScheduleFormData);
        }}
      >
        <SheetContent side="right" className="sm:max-w-[500px] overflow-auto">
          <SheetHeader>
            <SheetTitle>
              Manage Schedules: <span className="text-amber-500">{selectedClubForSchedules?.title}</span>
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-8 space-y-8">
            {/* Add New Schedule Section */}
            <div className="bg-gray-50 p-4 rounded-lg dark:bg-muted/50 border dark:border-border">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Add New Date</h3>
              <CommonForm
                onSubmit={onScheduleSubmit}
                formData={scheduleFormData}
                setFormData={setScheduleFormData}
                buttonText="Add Schedule"
                formControls={addEventScheduleFormElements}
                isBtnDisabled={!isScheduleFormValid()}
              />
            </div>

            {/* Existing Schedules Table */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Upcoming Dates</h3>
              {schedules && schedules.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Seats</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedules.map((schedule) => (
                        <TableRow key={schedule._id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {new Date(schedule.date).toLocaleDateString()}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {schedule.start_time}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{schedule.seats_booked} / {schedule.seat_limit}</span>
                              <span className="text-xs text-muted-foreground">booked</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold">£{schedule.price_per_guest}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg dark:bg-muted/30">
                  <p className="text-muted-foreground">No dates scheduled yet.</p>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminClubs;
