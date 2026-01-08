// Payment processing service for Gourmet Club bookings
class PaymentService {
  constructor() {
    this.stripe = null;
    this.initializeStripe();
  }

  async initializeStripe() {
    // Initialize Stripe with your publishable key
    // In production, this should come from environment variables
    if (typeof window !== 'undefined' && window.Stripe) {
      this.stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');
    }
  }

  // Create payment intent for booking
  async createPaymentIntent(bookingData) {
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: bookingData.totalPrice * 100, // Convert to cents
          currency: 'eur',
          metadata: {
            bookingId: bookingData.bookingId,
            eventId: bookingData.eventId,
            userId: bookingData.userId,
          },
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create payment intent');
      }

      return data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Confirm payment with Stripe
  async confirmPayment(paymentIntentId, paymentMethodId) {
    try {
      if (!this.stripe) {
        throw new Error('Stripe not initialized');
      }

      const { error, paymentIntent } = await this.stripe.confirmCardPayment(
        paymentIntentId,
        {
          payment_method: paymentMethodId,
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      return paymentIntent;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  // Process PayPal payment
  async processPayPalPayment(bookingData) {
    try {
      const response = await fetch('/api/payments/paypal/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: bookingData.totalPrice,
          currency: 'EUR',
          description: `Booking for ${bookingData.eventTitle}`,
          returnUrl: `${window.location.origin}/booking/success`,
          cancelUrl: `${window.location.origin}/booking/cancel`,
          metadata: {
            bookingId: bookingData.bookingId,
            eventId: bookingData.eventId,
            userId: bookingData.userId,
          },
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create PayPal payment');
      }

      // Redirect to PayPal for approval
      window.location.href = data.approvalUrl;
      
      return data;
    } catch (error) {
      console.error('Error processing PayPal payment:', error);
      throw error;
    }
  }

  // Handle PayPal payment completion
  async completePayPalPayment(paymentId, payerId) {
    try {
      const response = await fetch('/api/payments/paypal/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          payerId,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to capture PayPal payment');
      }

      return data;
    } catch (error) {
      console.error('Error completing PayPal payment:', error);
      throw error;
    }
  }

  // Refund payment
  async refundPayment(paymentIntentId, amount) {
    try {
      const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          amount: amount ? amount * 100 : undefined, // Convert to cents if provided
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process refund');
      }

      return data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  // Get payment status
  async getPaymentStatus(paymentIntentId) {
    try {
      const response = await fetch(`/api/payments/status/${paymentIntentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to get payment status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }

  // Validate card details
  validateCardDetails(cardDetails) {
    const errors = {};

    // Card number validation
    const cardNumber = cardDetails.number.replace(/\s/g, '');
    if (!cardNumber) {
      errors.number = 'Card number is required';
    } else if (!/^\d{13,19}$/.test(cardNumber)) {
      errors.number = 'Invalid card number';
    } else if (!this.isValidLuhn(cardNumber)) {
      errors.number = 'Invalid card number';
    }

    // Expiry validation
    if (!cardDetails.expiry) {
      errors.expiry = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)) {
      errors.expiry = 'Invalid expiry format (MM/YY)';
    } else {
      const [month, year] = cardDetails.expiry.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const now = new Date();
      
      if (expiryDate < now) {
        errors.expiry = 'Card has expired';
      }
    }

    // CVC validation
    if (!cardDetails.cvc) {
      errors.cvc = 'CVC is required';
    } else if (!/^\d{3,4}$/.test(cardDetails.cvc)) {
      errors.cvc = 'Invalid CVC';
    }

    // Cardholder name validation
    if (!cardDetails.holderName || !cardDetails.holderName.trim()) {
      errors.holderName = 'Cardholder name is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  // Luhn algorithm for card number validation
  isValidLuhn(cardNumber) {
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  // Format card number for display
  formatCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    const groups = cleaned.match(/\d{4,16}/g);
    if (!groups) return cleaned;
    
    return groups.join(' ');
  }

  // Get card type from number
  getCardType(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'discover';
    
    return 'unknown';
  }
}

export default new PaymentService();
