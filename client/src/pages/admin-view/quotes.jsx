import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllQuotes, deleteQuote } from "@/store/admin/quotes-slice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function AdminQuotes() {
  const dispatch = useDispatch();
  const { quotes, isLoading } = useSelector((state) => state.adminQuotes);

  useEffect(() => {
    dispatch(fetchAllQuotes());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quote Requests</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : quotes && quotes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {quotes.map((q) => (
            <Card key={q._id} className="p-4">
              <div className="flex justify-between">
                <h2 className="font-semibold">{q.serviceType}</h2>
                <span className="text-sm text-gray-500">
                  {new Date(q.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-2"><span className="font-medium">Name:</span> {q.name}</p>
              <p><span className="font-medium">Email:</span> {q.email}</p>
              <p><span className="font-medium">Guests:</span> {q.guests}</p>
              <p className="mt-2 text-sm text-gray-700">{q.message}</p>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="destructive"
                  onClick={() => dispatch(deleteQuote(q._id))}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p>No quote requests yet.</p>
      )}
    </div>
  );
}

export default AdminQuotes;
