import { Button } from "@/components/ui/button";
import { fetchServiceDetails } from "@/store/shop/services-slice";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function ServiceDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { serviceDetails, isLoading } = useSelector(
    (state) => state.shopServices
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchServiceDetails(id));
    }
  }, [id, dispatch]);

  if (isLoading) return <div>Loading...</div>;

  if (!serviceDetails) return <div>Service not found</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2"
        onClick={() => navigate("/shop/diners-atlas")}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Services
      </Button>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <img
            src={serviceDetails?.image}
            alt={serviceDetails?.title}
            className="w-full h-[400px] object-cover rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-6">{serviceDetails?.title}</h1>
          <div className="prose max-w-none text-gray-700">
            <p className="whitespace-pre-wrap text-lg leading-relaxed">
              {serviceDetails?.content || serviceDetails?.description}
            </p>
          </div>
          <div className="mt-8">
            <Button size="lg" onClick={() => navigate("/shop/diners-atlas")}>
              Request a Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetail;
