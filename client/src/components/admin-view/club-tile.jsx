import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { EditIcon, TrashIcon } from "lucide-react";

function AdminClubTile({
  club,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  const experienceTypeLabels = {
    SUPPER_CLUB: "Supper Club",
    CHEFS_TABLE: "Chef's Table",
    WINE_TASTING: "Wine Tasting",
    MASTERCLASS: "Masterclass",
    FARM_TO_TABLE: "Farm to Table",
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: "bg-gray-500 hover:bg-gray-600",
      LIVE: "bg-green-500 hover:bg-green-600",
      FULLY_BOOKED: "bg-red-500 hover:bg-red-600",
      COMPLETED: "bg-blue-500 hover:bg-blue-600",
    };
    return colors[status] || "bg-gray-500 hover:bg-gray-600";
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div className="relative">
        <img
          src={club?.images?.[0] || "/placeholder-club.jpg"}
          alt={club?.title}
          className="w-full h-[200px] object-cover rounded-t-lg"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge className={`${getStatusColor(club?.status)} text-white`}>
            {club?.status}
          </Badge>
          {club?.is_members_only && (
            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
              Members Only
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-2 line-clamp-1">{club?.title}</h2>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {club?.description}
        </p>
        
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium">
              {experienceTypeLabels[club?.experience_type]}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Host:</span>
            <span className="font-medium">{club?.host_id?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rating:</span>
            <span className="font-medium">
              {club?.averageRating?.toFixed(1) || "0.0"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => {
            setFormData({
              title: club?.title,
              description: club?.description,
              experience_type: club?.experience_type,
              theme: club?.theme,
              images: club?.images,
              host_id: club?.host_id?._id,
              is_members_only: club?.is_members_only?.toString(),
              menu_details: club?.menu_details,
              dietary_notes: club?.dietary_notes,
              cancellation_policy: club?.cancellation_policy,
              status: club?.status,
            });
            setCurrentEditedId(club?._id);
            setOpenCreateProductsDialog(true);
          }}
        >
          <EditIcon className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={() => handleDelete(club?._id)}
        >
          <TrashIcon className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AdminClubTile;
