import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminChefTile({
  chef,
  setFormData,
  setOpenCreateChefsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={chef?.image}
            alt={chef?.name}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${
            chef?.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {chef?.isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{chef?.name}</h2>
          <p className="text-sm text-gray-600 mb-2">{chef?.title}</p>
          <p className="text-xs text-gray-500 line-clamp-2">{chef?.bio}</p>
          {chef?.specializations && chef.specializations.length > 0 && (
            <div className="mt-2">
              <span className="text-xs font-semibold text-gray-700">Specializations:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {chef.specializations.slice(0, 3).map((spec, index) => (
                  <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {spec}
                  </span>
                ))}
                {chef.specializations.length > 3 && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    +{chef.specializations.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={() => {
              setOpenCreateChefsDialog(true);
              setCurrentEditedId(chef?._id);
              setFormData({
                image: chef?.image,
                name: chef?.name,
                title: chef?.title,
                bio: chef?.bio,
                experience: chef?.experience || "",
                bestAdvice: chef?.bestAdvice || "",
                memberships: chef?.memberships?.join(', ') || "",
                recognition: chef?.recognition?.join(', ') || "",
                specializations: chef?.specializations?.join(', ') || "",
                email: chef?.email || "",
                linkedin: chef?.socialLinks?.linkedin || "",
                twitter: chef?.socialLinks?.twitter || "",
                instagram: chef?.socialLinks?.instagram || "",
                isActive: chef?.isActive?.toString() || "true",
                order: chef?.order?.toString() || "0",
              });
            }}
          >
            Edit
          </Button>
          <Button 
            variant="destructive"
            onClick={() => handleDelete(chef?._id)}
          >
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminChefTile;
