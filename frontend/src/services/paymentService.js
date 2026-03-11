import api from './api';
import { RAZORPAY_SCRIPT_URL } from '../config/constants';

const paymentService = {
  // Load Razorpay script
  loadRazorpayScript: () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = RAZORPAY_SCRIPT_URL;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  },

  // Get Razorpay key
  getRazorpayKey: async () => {
    const response = await api.get('/payments/razorpay-key');
    return response.key;
  },

  // Create payment order
  createOrder: async (bookingId) => {
    return await api.post('/payments/create-order', { bookingId });
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    return await api.post('/payments/verify', paymentData);
  },

  // Handle payment failure
  handlePaymentFailure: async (bookingId, error) => {
    return await api.post('/payments/failure', { bookingId, error });
  },

  // Get payment details
  getPaymentDetails: async (bookingId) => {
    return await api.get(`/payments/${bookingId}`);
  },

  // Process payment with Razorpay
  processPayment: async (bookingId, booking, userDetails) => {
    // Load Razorpay script
    const scriptLoaded = await paymentService.loadRazorpayScript();
    
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay SDK. Please check your internet connection.');
    }

    // Get Razorpay key
    const razorpayKey = await paymentService.getRazorpayKey();

    // Create order
    const orderData = await paymentService.createOrder(bookingId);

    return new Promise((resolve, reject) => {
      const options = {
        key: razorpayKey,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'TurfBook',
        description: `Booking for ${booking.turf?.name || 'Turf'}`,
        order_id: orderData.data.orderId,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyData = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId: bookingId
            };

            const verificationResult = await paymentService.verifyPayment(verifyData);
            resolve(verificationResult);
          } catch (error) {
            reject(error);
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone
        },
        theme: {
          color: '#059669'
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', async (response) => {
        await paymentService.handlePaymentFailure(
          bookingId,
          response.error.description
        );
        reject(new Error(response.error.description));
      });

      razorpay.open();
    });
  }
};

export default paymentService;
