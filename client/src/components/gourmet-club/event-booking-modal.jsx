import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, Users, MapPin, Shield, Check, AlertCircle, CreditCard, Smartphone } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const EventBookingModal = ({ event, club, isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    numberOfGuests: 2,
    guests: [{ name: "", dietaryRestrictions: [], allergies: "", specialRequests: "" }],
    contactPhone: "",
    contactEmail: "",
    specialRequests: "",
    couponCode: "",
    savePaymentInfo: false,
    paymentMethod: "card",
    cardDetails: {
      number: "",
      expiry: "",
      holderName: "",
      cvc: "",
    },
  });
  const [couponValidated, setCouponValidated] = useState(null);
  const [totalPrice, setTotalPrice] = useState(event.pricePerSeat * 2);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setBookingData({
        numberOfGuests: 2,
        guests: [{ name: "", dietaryRestrictions: [], allergies: "", specialRequests: "" }],
        contactPhone: "",
        contactEmail: "",
        specialRequests: "",
        couponCode: "",
        savePaymentInfo: false,
        paymentMethod: "card",
        cardDetails: {
          number: "",
          expiry: "",
          holderName: "",
          cvc: "",
        },
      });
      setStep(1);
      setTotalPrice(event.pricePerSeat * 2);
      setCouponValidated(null);
      setErrors({});
    }
  }, [isOpen, event.pricePerSeat]);

  const updateTotalPrice = (guests, couponDiscount = 0) => {
    const subtotal = event.pricePerSeat * guests;
    const total = Math.max(0, subtotal - couponDiscount);
    setTotalPrice(total);
  };

  const handleGuestsChange = (value) => {
    const numGuests = parseInt(value);
    const newGuests = Array(numGuests).fill(null).map((_, i) => ({
      name: bookingData.guests[i]?.name || "",
      dietaryRestrictions: bookingData.guests[i]?.dietaryRestrictions || [],
      allergies: bookingData.guests[i]?.allergies || "",
      specialRequests: bookingData.guests[i]?.specialRequests || "",
    }));

    setBookingData(prev => ({
      ...prev,
      numberOfGuests: numGuests,
      guests: newGuests,
    }));

    updateTotalPrice(numGuests, couponValidated?.discountAmount || 0);
  };

  const handleGuestDetailChange = (index, field, value) => {
    const newGuests = [...bookingData.guests];
    newGuests[index] = { ...newGuests[index], [field]: value };
    setBookingData(prev => ({ ...prev, guests: newGuests }));
  };

  const validateCoupon = async () => {
    if (!bookingData.couponCode.trim()) {
      setCouponValidated(null);
      updateTotalPrice(bookingData.numberOfGuests, 0);
      return;
    }

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: bookingData.couponCode,
          eventAmount: event.pricePerSeat * bookingData.numberOfGuests,
          eventId: event._id,
        }),
      });

      const data = await response.json();
      
      if (data.valid) {
        setCouponValidated(data.coupon);
        updateTotalPrice(bookingData.numberOfGuests, data.coupon.discountAmount);
        setErrors(prev => ({ ...prev, coupon: "" }));
      } else {
        setCouponValidated(null);
        setErrors(prev => ({ ...prev, coupon: data.message }));
        updateTotalPrice(bookingData.numberOfGuests, 0);
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      setErrors(prev => ({ ...prev, coupon: "Error validating coupon" }));
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!bookingData.contactPhone.trim()) {
        newErrors.contactPhone = "Phone number is required";
      }
      if (!bookingData.contactEmail.trim()) {
        newErrors.contactEmail = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(bookingData.contactEmail)) {
        newErrors.contactEmail = "Invalid email format";
      }
    }

    if (step === 2) {
      bookingData.guests.forEach((guest, index) => {
        if (!guest.name.trim()) {
          newErrors[`guest${index}Name`] = "Guest name is required";
        }
      });
    }

    if (step === 3) {
      if (bookingData.paymentMethod === "card") {
        if (!bookingData.cardDetails.number.trim()) {
          newErrors.cardNumber = "Card number is required";
        } else if (!/^\d{16}$/.test(bookingData.cardDetails.number.replace(/\s/g, ""))) {
          newErrors.cardNumber = "Invalid card number";
        }
        if (!bookingData.cardDetails.expiry.trim()) {
          newErrors.cardExpiry = "Expiry date is required";
        } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(bookingData.cardDetails.expiry)) {
          newErrors.cardExpiry = "Invalid expiry format (MM/YY)";
        }
        if (!bookingData.cardDetails.holderName.trim()) {
          newErrors.cardHolderName = "Cardholder name is required";
        }
        if (!bookingData.cardDetails.cvc.trim()) {
          newErrors.cardCvc = "CVC is required";
        } else if (!/^\d{3,4}$/.test(bookingData.cardDetails.cvc)) {
          newErrors.cardCvc = "Invalid CVC";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event._id,
          userId: "current-user-id", // This should come from auth context
          numberOfGuests: bookingData.numberOfGuests,
          guests: bookingData.guests,
          contactPhone: bookingData.contactPhone,
          contactEmail: bookingData.contactEmail,
          specialRequests: bookingData.specialRequests,
          couponCode: bookingData.couponCode,
          paymentMethod: bookingData.paymentMethod,
          paymentDetails: {
            last4: bookingData.cardDetails.number.slice(-4),
            brand: "visa", // This would be determined by card number
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message and close modal
        alert("Booking confirmed! You will receive a confirmation email shortly.");
        onClose();
      } else {
        setErrors({ submit: data.message || "Booking failed" });
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      setErrors({ submit: "An error occurred while processing your booking" });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            You're almost there...
          </DialogTitle>
          <p className="text-gray-600 mt-1">
            We just need to confirm a few details so your host can accept your request.
          </p>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step > stepNumber ? (
                  <Check className="w-4 h-4" />
                ) : (
                  stepNumber
                )}
              </div>
              {stepNumber < 3 && (
                <div
                  className={`w-full h-1 mx-2 ${
                    step > stepNumber ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Event Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <img
                src={club.image || "/placeholder-restaurant.jpg"}
                alt={event.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {formatDate(event.date)} at {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </p>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {club.location}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">€{totalPrice.toFixed(2)}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Contact Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={bookingData.contactPhone}
                onChange={(e) => setBookingData(prev => ({ ...prev, contactPhone: e.target.value }))}
                className="mt-1"
              />
              {errors.contactPhone && (
                <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Used by platform and host for important booking updates
              </p>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={bookingData.contactEmail}
                onChange={(e) => setBookingData(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="mt-1"
              />
              {errors.contactEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
              )}
            </div>

            <div>
              <Label htmlFor="guests">Number of Guests *</Label>
              <Select
                value={bookingData.numberOfGuests.toString()}
                onValueChange={handleGuestsChange}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(Math.min(10, event.availableSeats || event.totalSeats))].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1} {i === 0 ? "guest" : "guests"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
              <Input
                id="specialRequests"
                placeholder="Any dietary requirements or special occasions?"
                value={bookingData.specialRequests}
                onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Step 2: Guest Details */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Guest Details</h3>
            {bookingData.guests.map((guest, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Guest {index + 1}</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`guest-name-${index}`}>Name *</Label>
                      <Input
                        id={`guest-name-${index}`}
                        placeholder="Guest name"
                        value={guest.name}
                        onChange={(e) => handleGuestDetailChange(index, "name", e.target.value)}
                        className="mt-1"
                      />
                      {errors[`guest${index}Name`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`guest${index}Name`]}</p>
                      )}
                    </div>

                    <div>
                      <Label>Dietary Restrictions</Label>
                      <div className="mt-2 space-y-2">
                        {["vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free"].map((restriction) => (
                          <div key={restriction} className="flex items-center space-x-2">
                            <Checkbox
                              id={`restriction-${index}-${restriction}`}
                              checked={guest.dietaryRestrictions.includes(restriction)}
                              onCheckedChange={(checked) => {
                                const newRestrictions = checked
                                  ? [...guest.dietaryRestrictions, restriction]
                                  : guest.dietaryRestrictions.filter(r => r !== restriction);
                                handleGuestDetailChange(index, "dietaryRestrictions", newRestrictions);
                              }}
                            />
                            <Label htmlFor={`restriction-${index}-${restriction}`} className="text-sm">
                              {restriction.charAt(0).toUpperCase() + restriction.slice(1).replace("-", " ")}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`allergies-${index}`}>Allergies</Label>
                      <Input
                        id={`allergies-${index}`}
                        placeholder="List any allergies"
                        value={guest.allergies}
                        onChange={(e) => handleGuestDetailChange(index, "allergies", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Payment Details</h3>
            
            {/* Payment Method Selection */}
            <div className="grid grid-cols-2 gap-4">
              <Card
                className={`cursor-pointer transition-colors ${
                  bookingData.paymentMethod === "card"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() => setBookingData(prev => ({ ...prev, paymentMethod: "card" }))}
              >
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    <span className="font-medium">Credit/Debit Card</span>
                    {bookingData.paymentMethod === "card" && (
                      <Check className="w-4 h-4 ml-auto text-blue-600" />
                    )}
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <img src="/visa.svg" alt="Visa" className="h-6" />
                    <img src="/mastercard.svg" alt="Mastercard" className="h-6" />
                    <img src="/amex.svg" alt="Amex" className="h-6" />
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-colors ${
                  bookingData.paymentMethod === "express"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() => setBookingData(prev => ({ ...prev, paymentMethod: "express" }))}
              >
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Smartphone className="w-5 h-5 mr-2" />
                    <span className="font-medium">Express Checkout</span>
                    {bookingData.paymentMethod === "express" && (
                      <Check className="w-4 h-4 ml-auto text-blue-600" />
                    )}
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <img src="/apple-pay.svg" alt="Apple Pay" className="h-6" />
                    <img src="/google-pay.svg" alt="Google Pay" className="h-6" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Card Details */}
            {bookingData.paymentMethod === "card" && (
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <Label htmlFor="card-number">Card Number *</Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      value={bookingData.cardDetails.number}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        cardDetails: {
                          ...prev.cardDetails,
                          number: formatCardNumber(e.target.value)
                        }
                      }))}
                      className="mt-1"
                      maxLength={19}
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date *</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={bookingData.cardDetails.expiry}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          cardDetails: {
                            ...prev.cardDetails,
                            expiry: e.target.value
                          }
                        }))}
                        className="mt-1"
                        maxLength={5}
                      />
                      {errors.cardExpiry && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="cvc">CVC *</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={bookingData.cardDetails.cvc}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          cardDetails: {
                            ...prev.cardDetails,
                            cvc: e.target.value
                          }
                        }))}
                        className="mt-1"
                        maxLength={4}
                      />
                      {errors.cardCvc && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardCvc}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="holder-name">Cardholder Name *</Label>
                    <Input
                      id="holder-name"
                      placeholder="John Doe"
                      value={bookingData.cardDetails.holderName}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        cardDetails: {
                          ...prev.cardDetails,
                          holderName: e.target.value
                        }
                      }))}
                      className="mt-1"
                    />
                    {errors.cardHolderName && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardHolderName}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="save-payment"
                      checked={bookingData.savePaymentInfo}
                      onCheckedChange={(checked) => 
                        setBookingData(prev => ({ ...prev, savePaymentInfo: checked }))
                      }
                    />
                    <Label htmlFor="save-payment" className="text-sm">
                      Save my payment information for future bookings
                    </Label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Coupon Code */}
            <Card>
              <CardContent className="p-4">
                <Label htmlFor="coupon">Coupon Code</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    id="coupon"
                    placeholder="Enter your coupon code"
                    value={bookingData.couponCode}
                    onChange={(e) => setBookingData(prev => ({ ...prev, couponCode: e.target.value }))}
                  />
                  <Button
                    variant="outline"
                    onClick={validateCoupon}
                    disabled={!bookingData.couponCode.trim()}
                  >
                    Apply
                  </Button>
                </div>
                {errors.coupon && (
                  <p className="text-red-500 text-sm mt-1">{errors.coupon}</p>
                )}
                {couponValidated && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                    <p className="text-green-800 text-sm">
                      Coupon applied! You saved €{couponValidated.discountAmount.toFixed(2)}
                    </p>
                  </div>
                )}
                <p className="text-gray-500 text-sm mt-2">
                  Click here to apply your exclusive <strong>10WELCOME</strong> discount code to your first booking.
                </p>
              </CardContent>
            </Card>

            {/* Trust & Safety */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Trust & Safety</h4>
                    <p className="text-blue-800 text-sm mt-1">
                      We are committed to the health and well-being of our host and guest community.
                      Learn more about the measures we've taken to ensure safe and trusted events.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Booking Summary */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Booking Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {formatDate(event.date)}, {formatTime(event.startTime)} - {formatTime(event.endTime)} ({event.duration} hours)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {bookingData.numberOfGuests} guests × €{event.pricePerSeat}
                </span>
                <span>€{(event.pricePerSeat * bookingData.numberOfGuests).toFixed(2)}</span>
              </div>
              {couponValidated && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({couponValidated.code})</span>
                  <span>-€{couponValidated.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-3">
              Free cancellation up to {club.cancellationHours || 48} hours before the event.
            </p>
          </CardContent>
        </Card>

        {/* Error Message */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-800 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={step === 1 ? onClose : handleBack}
            disabled={loading}
          >
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          
          <Button
            onClick={step === 3 ? handleSubmit : handleNext}
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? (
              "Processing..."
            ) : step === 3 ? (
              "Book Now"
            ) : (
              "Continue"
            )}
          </Button>
        </div>

        {/* Confirmation Message */}
        {step === 3 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-600" />
              <p className="text-green-800 text-sm">
                Your booking will be instantly confirmed. We'll send you a confirmation email with a recap of your upcoming experience.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventBookingModal;