import { Button } from '@/components/ui/button';
import { API_URL } from '@/config/api';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchShopServices } from '@/store/shop/services-slice';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

const DinersAtlas = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { serviceList } = useSelector((state) => state.shopServices);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceType: '',
    guests: '',
    message: ''
  });

  useEffect(() => {
    dispatch(fetchShopServices());
  }, [dispatch]);

  const handleServiceClick = (service) => {
    if (service?.pdfUrl) {
      const proxyUrl = `${API_URL}/api/common/feature/serve-pdf?url=${encodeURIComponent(service.pdfUrl)}`;
      window.open(proxyUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasServices = serviceList && serviceList.length > 0;
    const isComplete =
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.serviceType.trim() !== '' &&
      String(formData.guests).trim() !== '';

    if (!hasServices) {
      toast({ title: 'No services available', description: 'Please try again later.' });
      return;
    }
    if (!isComplete) {
      toast({ title: 'Incomplete details', description: 'Fill all fields to send the request.' });
      return;
    }
    axios.post(`${API_URL}/api/shop/quotes/add`, {
      name: formData.name,
      email: formData.email,
      serviceType: formData.serviceType,
      guests: Number(formData.guests),
      message: formData.message
    }).then((res) => {
      if (res?.data?.success) {
        toast({ title: 'Request submitted', description: 'We will contact you shortly.' });
        setFormData({ name:'', email:'', serviceType:'', guests:'', message:'' });
      } else {
        toast({ title: 'Error', description: 'Failed to submit request.' });
      }
    }).catch(() => {
      toast({ title: 'Error', description: 'Failed to submit request.' });
    });
  };

  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Hero / Header Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-playfair font-bold mb-4 dark:text-primary">Diner's Atlas</h1>
        <p className="text-xl text-gray-600 dark:text-foreground font-inter">Luxury Catering & Fine Dining Experiences</p>
      </div>

      {/* Our Services Section - Zig Zag Layout */}
      <section className="w-full mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-playfair font-bold text-[#8fa888] uppercase tracking-widest dark:text-primary">Our Services</h2>
        </div>
        
        <div className="container mx-auto px-4 max-w-6xl space-y-12 md:space-y-20">
          {serviceList && serviceList.length > 0 ? (
            serviceList.map((service, index) => (
              <div key={service._id} className="overflow-hidden rounded-xl shadow-sm dark:shadow-none">
                <div className="grid grid-cols-1 md:grid-cols-2 w-full items-stretch">
                {/* Image Section - Always first on mobile */}
                <div className={`${index % 2 === 0 ? 'md:order-1' : 'md:order-2'} order-1 w-full h-[260px] md:h-[520px] overflow-hidden`}>
                  {service.image ? (
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-muted flex items-center justify-center">
                      <span className="text-gray-400">No Image Available</span>
                    </div>
                  )}
                </div>

                {/* Content Section - Always second on mobile */}
                <div className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'} order-2 bg-[#A7B98E] dark:bg-card text-[#2A4E46] dark:text-foreground p-8 md:p-16 flex flex-col justify-center items-center text-center h-auto md:h-[520px]`}>
                  <h3 className="text-2xl md:text-3xl font-playfair font-bold mb-6 tracking-wider uppercase dark:text-primary">
                    {service.title}
                  </h3>
                  <div className="mb-8 leading-relaxed max-w-xl font-serif italic text-base md:text-lg line-clamp-3 md:line-clamp-4 px-4 dark:text-muted-foreground">
                    {service.description ? decodeHtml(service.description.replace(/<[^>]*>/g, '')) : ''}
                  </div>
                  <Button 
                    className="bg-transparent text-[#2A4E46] dark:text-primary hover:bg-transparent hover:text-[#1a332e] dark:hover:text-primary/80 border border-[#2A4E46] dark:border-primary px-8 py-2 uppercase tracking-widest font-medium text-xs transition-all duration-300 shadow-none hover:shadow-none rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleServiceClick(service)}
                    disabled={!service?.pdfUrl}
                  >
                    Read More
                  </Button>
                </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-muted-foreground">No services available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Request a Quote Section */}
      <section className="container mx-auto px-4 py-16 mb-12">
        <div className="max-w-4xl mx-auto bg-gray-50 dark:bg-card p-8 md:p-12 rounded-xl shadow-lg">
          <h2 className="text-3xl font-playfair font-semibold mb-8 text-center dark:text-primary">Request a Quote</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-foreground">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8fa888] dark:focus:ring-primary focus:border-transparent transition-all dark:bg-muted dark:border-border dark:text-foreground" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-foreground">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8fa888] dark:focus:ring-primary focus:border-transparent transition-all dark:bg-muted dark:border-border dark:text-foreground" 
                  required
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-foreground">Service Type</label>
                <select 
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8fa888] dark:focus:ring-primary focus:border-transparent transition-all bg-white disabled:bg-gray-100 disabled:text-gray-500 dark:bg-muted dark:border-border dark:text-foreground"
                  disabled={!serviceList || serviceList.length === 0}
                >
                  <option value="">Select a Service</option>
                  {serviceList && serviceList.map(service => (
                    <option key={service._id} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-foreground">Number of Guests</label>
                <input 
                  type="number" 
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8fa888] dark:focus:ring-primary focus:border-transparent transition-all dark:bg-muted dark:border-border dark:text-foreground" 
                  placeholder="e.g. 50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-foreground">Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4" 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8fa888] dark:focus:ring-primary focus:border-transparent transition-all dark:bg-muted dark:border-border dark:text-foreground"
              ></textarea>
            </div>
            <Button type="submit" className="w-full bg-[#8fa888] hover:bg-[#7a9174] text-white text-lg py-6 mt-4 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90">Send Request</Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default DinersAtlas;
