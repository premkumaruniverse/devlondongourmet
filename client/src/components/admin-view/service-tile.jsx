import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminServiceTile({
  service,
  setFormData,
  setOpenCreateServicesDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={service?.image}
            alt={service?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{service?.title}</h2>
          <p className="text-sm text-gray-500 line-clamp-2">
            {service?.description}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={() => {
              setOpenCreateServicesDialog(true);
              setCurrentEditedId(service?._id);
              setFormData(service);
            }}
          >
            Edit
          </Button>
          <Button onClick={() => handleDelete(service?._id)}>Delete</Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminServiceTile;
