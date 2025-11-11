export const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  
  export const processRazorpayPayment = async (amount) => {
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      alert("Failed to load Razorpay. Try again.");
      return false;
    }
  
    const options = {
      key: "YOUR_RAZORPAY_KEY", // Replace with your Razorpay API Key
      amount: amount * 100,
      currency: "INR",
      name: "Coffee Shop",
      description: "Payment for Coffee Order",
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: { email: "customer@example.com" },
      theme: { color: "#3399cc" },
    };
  
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    return true;
  };
  