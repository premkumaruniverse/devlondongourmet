// Coupon service for managing discount codes and promotions
class CouponService {
  // Validate coupon code
  async validateCoupon(code, bookingData) {
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.toUpperCase(),
          eventAmount: bookingData.totalAmount,
          eventId: bookingData.eventId,
          userId: bookingData.userId,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid coupon');
      }

      return data;
    } catch (error) {
      console.error('Error validating coupon:', error);
      throw error;
    }
  }

  // Apply coupon to booking
  async applyCouponToBooking(bookingId, couponCode) {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/apply-coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couponCode: couponCode.toUpperCase(),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to apply coupon');
      }

      return data;
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error;
    }
  }

  // Remove coupon from booking
  async removeCouponFromBooking(bookingId) {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/remove-coupon`, {
        method: 'POST',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove coupon');
      }

      return data;
    } catch (error) {
      console.error('Error removing coupon:', error);
      throw error;
    }
  }

  // Get available coupons for user
  async getAvailableCoupons(userId) {
    try {
      const response = await fetch(`/api/coupons/available/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch available coupons');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching available coupons:', error);
      throw error;
    }
  }

  // Calculate discount amount
  calculateDiscount(coupon, amount) {
    let discount = 0;

    if (coupon.discountType === 'percentage') {
      discount = (amount * coupon.discountValue) / 100;
      if (coupon.maximumDiscount) {
        discount = Math.min(discount, coupon.maximumDiscount);
      }
    } else if (coupon.discountType === 'fixed') {
      discount = coupon.discountValue;
    }

    return Math.min(discount, amount); // Don't exceed the total amount
  }

  // Format discount display
  formatDiscount(coupon) {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% OFF`;
    } else {
      return `€${coupon.discountValue} OFF`;
    }
  }

  // Check if coupon is applicable to event
  isCouponApplicable(coupon, eventData, userData) {
    // Check if coupon is active
    if (!coupon.isActive) return false;

    // Check date validity
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);
    
    if (now < validFrom || now > validUntil) return false;

    // Check minimum amount
    if (eventData.price < coupon.minimumAmount) return false;

    // Check usage limits
    if (coupon.usedCount >= coupon.usageLimit) return false;

    // Check user-specific restrictions
    if (coupon.applicableTo === 'new-users' && userData.hasBookings) return false;
    if (coupon.applicableTo === 'members-only' && !userData.isMember) return false;

    // Check event-specific restrictions
    if (coupon.applicableTo === 'specific-events') {
      return coupon.applicableEvents.includes(eventData._id);
    }

    return true;
  }

  // Generate coupon suggestions based on user behavior
  generateCouponSuggestions(userData, bookingHistory) {
    const suggestions = [];

    // New user suggestion
    if (!userData.hasBookings) {
      suggestions.push({
        code: '10WELCOME',
        description: 'Welcome discount for your first booking',
        discountType: 'percentage',
        discountValue: 10,
        applicableTo: 'new-users',
      });
    }

    // Loyalty suggestion for repeat customers
    if (bookingHistory.length >= 3) {
      suggestions.push({
        code: 'LOYALTY15',
        description: 'Loyalty discount for our valued customers',
        discountType: 'percentage',
        discountValue: 15,
        applicableTo: 'returning-customers',
      });
    }

    // Member suggestion
    if (userData.isMember) {
      suggestions.push({
        code: 'MEMBER20',
        description: 'Exclusive member discount',
        discountType: 'percentage',
        discountValue: 20,
        applicableTo: 'members-only',
      });
    }

    // Seasonal suggestions
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 10 || currentMonth <= 1) { // Winter months
      suggestions.push({
        code: 'WINTER25',
        description: 'Winter special discount',
        discountType: 'percentage',
        discountValue: 25,
        applicableTo: 'all',
      });
    }

    return suggestions;
  }

  // Track coupon usage analytics
  async trackCouponUsage(couponCode, bookingData, result) {
    try {
      await fetch('/api/analytics/coupon-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couponCode,
          bookingId: bookingData.bookingId,
          userId: bookingData.userId,
          eventId: bookingData.eventId,
          originalAmount: bookingData.totalAmount,
          discountAmount: result.discountAmount,
          finalAmount: result.finalAmount,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error tracking coupon usage:', error);
      // Don't throw error as this is non-critical
    }
  }

  // Get coupon analytics for admin
  async getCouponAnalytics(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/analytics/coupons?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch coupon analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching coupon analytics:', error);
      throw error;
    }
  }

  // Auto-apply best available coupon
  async autoApplyBestCoupon(bookingData, availableCoupons) {
    let bestCoupon = null;
    let maxDiscount = 0;

    for (const coupon of availableCoupons) {
      if (this.isCouponApplicable(coupon, bookingData.eventData, bookingData.userData)) {
        const discount = this.calculateDiscount(coupon, bookingData.totalAmount);
        if (discount > maxDiscount) {
          maxDiscount = discount;
          bestCoupon = coupon;
        }
      }
    }

    return bestCoupon;
  }

  // Validate coupon combination rules
  validateCouponCombination(coupons) {
    // Business logic for coupon stacking
    const rules = {
      // Cannot combine percentage-based coupons
      noPercentageStacking: true,
      // Maximum of 2 coupons per booking
      maxCoupons: 2,
      // Cannot combine fixed amount coupons
      noFixedStacking: true,
    };

    const percentageCoupons = coupons.filter(c => c.discountType === 'percentage');
    const fixedCoupons = coupons.filter(c => c.discountType === 'fixed');

    if (rules.noPercentageStacking && percentageCoupons.length > 1) {
      return { valid: false, message: 'Cannot combine multiple percentage discounts' };
    }

    if (rules.noFixedStacking && fixedCoupons.length > 1) {
      return { valid: false, message: 'Cannot combine multiple fixed amount discounts' };
    }

    if (coupons.length > rules.maxCoupons) {
      return { valid: false, message: `Maximum ${rules.maxCoupons} coupons allowed per booking` };
    }

    return { valid: true };
  }
}

export default new CouponService();
