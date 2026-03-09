import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fetchAllAdminSubscriptions, getAdminSubscriptionAnalytics, updateSubscriptionByAdmin } from "@/store/admin/subscription-slice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AdminSubscriptions = () => {
    const dispatch = useDispatch();
    const { subscriptionList, analytics, isLoading } = useSelector((state) => state.adminSubscription);
    const [selectedSub, setSelectedSub] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchAllAdminSubscriptions());
        dispatch(getAdminSubscriptionAnalytics());
    }, [dispatch]);

    const handleUpdate = async (id, status) => {
        await dispatch(updateSubscriptionByAdmin({ id, formData: { status, note: "Updated by admin" } }));
        dispatch(fetchAllAdminSubscriptions());
        dispatch(getAdminSubscriptionAnalytics());
    };

    const getStatusBadge = (status) => {
        const colors = {
            active: "bg-green-500",
            paused: "bg-yellow-500",
            cancelled: "bg-red-500",
            payment_failed: "bg-red-700",
        };
        return <Badge className={`${colors[status] || "bg-gray-500"} capitalize`}>{status}</Badge>;
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Subscription Management</h1>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscribers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics?.totalActive || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Monthly MRR (Est)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">£{analytics?.mrr?.toLocaleString() || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Paused</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{analytics?.totalPaused || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Cancelled</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{analytics?.totalCancelled || 0}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead>Next Billing</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subscriptionList.map((sub) => (
                                <TableRow key={sub._id}>
                                    <TableCell>
                                        <div className="font-medium">{sub.userId?.userName}</div>
                                        <div className="text-xs text-muted-foreground">{sub.userId?.email}</div>
                                    </TableCell>
                                    <TableCell>{sub.productId?.title}</TableCell>
                                    <TableCell className="capitalize">{sub.frequency}</TableCell>
                                    <TableCell>{new Date(sub.nextBillingDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{getStatusBadge(sub.status)}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => { setSelectedSub(sub); setIsModalOpen(true); }}>View Details</Button>
                                            {sub.status === "active" && <Button variant="destructive" size="sm" onClick={() => handleUpdate(sub._id, "paused")}>Pause</Button>}
                                            {sub.status === "paused" && <Button variant="outline" size="sm" onClick={() => handleUpdate(sub._id, "active")}>Resume</Button>}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Subscription Details</DialogTitle>
                    </DialogHeader>
                    {selectedSub && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="font-bold">Subscription ID:</span>
                                <span>{selectedSub._id}</span>
                                <span className="font-bold">Status:</span>
                                <span>{selectedSub.status}</span>
                                <span className="font-bold">Plan:</span>
                                <span>{selectedSub.frequency}</span>
                                <span className="font-bold">Started at:</span>
                                <span>{new Date(selectedSub.startDate).toLocaleString()}</span>
                            </div>
                            <hr />
                            <div>
                                <h4 className="font-bold mb-2">Actions</h4>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => handleUpdate(selectedSub._id, "cancelled")}>Force Cancel</Button>
                                    <Button variant="outline" onClick={() => alert("Manual payment retry")}>Retry Payment</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminSubscriptions;
