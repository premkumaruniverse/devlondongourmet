import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAllSubscriptions, updateSubscriptionStatus } from "@/store/shop/subscription-slice";
import { useToast } from "@/components/ui/use-toast";

const MySubscriptions = () => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { subscriptionList, isLoading } = useSelector((state) => state.shopSubscription);

    useEffect(() => {
        dispatch(fetchAllSubscriptions());
    }, [dispatch]);

    const handleStatusUpdate = async (id, status) => {
        const result = await dispatch(updateSubscriptionStatus({ id, status }));
        if (result?.payload?.success) {
            toast({
                title: `Subscription ${status} successfully`,
            });
            dispatch(fetchAllSubscriptions());
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            active: "bg-green-500",
            paused: "bg-yellow-500",
            cancelled: "bg-red-500",
            skipped: "bg-blue-300",
            payment_failed: "bg-red-700",
        };
        return <Badge className={`${colors[status] || "bg-gray-500"} capitalize`}>{status}</Badge>;
    };

    if (isLoading) return <div>Loading subscriptions...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">My Subscriptions</h2>
            {subscriptionList && subscriptionList.length > 0 ? (
                subscriptionList.map((sub) => (
                    <Card key={sub._id}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>{sub.productId?.title || "Ayu Bite Plan"}</CardTitle>
                                <div className="text-sm text-muted-foreground mt-1">
                                    ID: {sub._id.substring(0, 8)}...
                                </div>
                            </div>
                            {getStatusBadge(sub.status)}
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Frequency</p>
                                    <p className="capitalize">{sub.frequency}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Next Billing</p>
                                    <p>{new Date(sub.nextBillingDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Price</p>
                                    <p>£{sub.price}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-6">
                                {sub.status === "active" && (
                                    <>
                                        <Button variant="outline" size="sm" onClick={() => handleStatusUpdate(sub._id, "paused")}>Pause</Button>
                                        <Button variant="outline" size="sm" onClick={() => handleStatusUpdate(sub._id, "skipped")}>Skip Next</Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleStatusUpdate(sub._id, "cancelled")}>Cancel</Button>
                                    </>
                                )}
                                {sub.status === "paused" && (
                                    <Button variant="outline" size="sm" onClick={() => handleStatusUpdate(sub._id, "active")}>Resume</Button>
                                )}
                                {sub.status === "cancelled" && (
                                    <Button variant="outline" size="sm" onClick={() => toast({ title: "Please visit Ayu Bite page to resubscribe" })}>Resubscribe</Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <p className="text-muted-foreground">You don't have any active subscriptions.</p>
            )}
        </div>
    );
};

export default MySubscriptions;
