import { Button } from '@/components/ui/button';
import { API_URL } from '@/config/api';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchShopServices } from '@/store/shop/services-slice';

const DinersAtlas = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { serviceList } = useSelector((state) => state.shopServices);

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
    console.log('Quote Request:', formData);
    // Add quote submission logic here
  };

  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero / Header Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-playfair font-bold mb-4">Diner's Atlas</h1>
        <p className="text-xl text-gray-600 font-inter">Luxury Catering & Fine Dining Experiences</p>
      </div>

      {/* Our Services Section - Zig Zag Layout */}
      <section className="w-full mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-playfair font-bold text-[#8fa888] uppercase tracking-widest">Our Services</h2>
        </div>
        
        <div className="w-full">
          {serviceList && serviceList.length > 0 ? (
            serviceList.map((service, index) => (
              <div key={service._id} className="grid grid-cols-1 md:grid-cols-2 w-full">
                {/* Image Section - Always first on mobile */}
                <div className={`${index % 2 === 0 ? 'md:order-1' : 'md:order-2'} order-1 relative w-full h-[300px] md:h-full`}>
                  {service.image ? (
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center absolute inset-0">
                      <span className="text-gray-400">No Image Available</span>
                    </div>
                  )}
                </div>

                {/* Content Section - Always second on mobile */}
                <div className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'} order-2 bg-[#A7B98E] text-[#2A4E46] p-8 md:p-20 flex flex-col justify-center items-center text-center min-h-[300px] md:min-h-[500px]`}>
                  <h3 className="text-2xl md:text-3xl font-playfair font-bold mb-6 tracking-wider uppercase">
                    {service.title}
                  </h3>
                  <div className="mb-8 leading-relaxed max-w-lg font-serif italic text-base md:text-lg line-clamp-3 md:line-clamp-4 px-4">
                    {service.description ? decodeHtml(service.description.replace(/<[^>]*>/g, '')) : ''}
                  </div>
                  <Button 
                    className="bg-transparent text-[#2A4E46] hover:bg-transparent hover:text-[#1a332e] border border-[#2A4E46] px-8 py-2 uppercase tracking-widest font-medium text-xs transition-all duration-300 shadow-none hover:shadow-none rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleServiceClick(service)}
                    disabled={!service?.pdfUrl}
                  >
                    Read More
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No services available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Request a Quote Section */}
      <section className="container mx-auto px-4 py-16 mb-12">
        <div className="max-w-4xl mx-auto bg-gray-50 p-8 md:p-12 rounded-xl shadow-lg">
          <h2 className="text-3xl font-playfair font-semibold mb-8 text-center">Request a Quote</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8fa888] focus:border-transparent transition-all" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8fa888] focus:border-transparent transition-all" 
                  required
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Service Type</label>
                <select 
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8fa888] focus:border-transparent transition-all bg-white"
                >
                  <option value="">Select a Service</option>
                  {serviceList && serviceList.map(service => (
                    <option key={service._id} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Number of Guests</label>
                <input 
                  type="number" 
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8fa888] focus:border-transparent transition-all" 
                  placeholder="e.g. 50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4" 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8fa888] focus:border-transparent transition-all"
              ></textarea>
            </div>
            <Button type="submit" className="w-full bg-[#8fa888] hover:bg-[#7a9174] text-white text-lg py-6 mt-4">Send Request</Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default DinersAtlas;
