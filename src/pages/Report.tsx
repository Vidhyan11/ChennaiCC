import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useJobStore } from '../stores/jobStore';
import { analyzeGarbageImage, fileToBase64 } from '../utils/imageAnalysis';
import { getZoneFromCoordinates } from '../utils/helpers';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ReportForm {
  reporterName: string;
  reporterContact: string;
  address: string;
  description: string;
}

function LocationMarker({ position, setPosition }: any) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export const Report: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ReportForm>();
  const navigate = useNavigate();
  const { addJob } = useJobStore();
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [position, setPosition] = useState<[number, number]>([13.0827, 80.2707]); // Chennai Central
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          toast.success('Location pinned successfully!');
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location. Please click on the map to set location.');
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
      setIsLoadingLocation(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  const onSubmit = async (data: ReportForm) => {
    if (!imageFile) {
      toast.error('Please upload an image of the garbage dump');
      return;
    }

    setIsSubmitting(true);
    setIsAnalyzing(true);

    try {
      // Analyze image
      toast.loading('Analyzing image with AI...', { id: 'analyzing' });
      const analysis = await analyzeGarbageImage(imageFile);
      toast.success(`Analysis complete! Garbage level: ${analysis.garbageLevel.toUpperCase()}`, { id: 'analyzing' });

      // Convert image to base64
      const imageBase64 = await fileToBase64(imageFile);

      // Determine zone from coordinates
      const zone = getZoneFromCoordinates(position[0], position[1]);

      // Create job
      const job = addJob({
        reporterName: data.reporterName,
        reporterContact: data.reporterContact,
        location: {
          lat: position[0],
          lng: position[1],
          address: data.address
        },
        description: data.description,
        imageUrl: imageBase64,
        garbageLevel: analysis.garbageLevel,
        vehicle: analysis.vehicle,
        zone,
        estimatedETA: Math.floor(Math.random() * 30) + 30
      });

      toast.success('Report submitted successfully!');
      
      // Show confirmation
      setTimeout(() => {
        toast.success(
          `Job ID: ${job.id}\nVehicle: ${analysis.vehicle === 'small' ? 'Small Truck' : 'Large Truck'}\nEstimated ETA: ${job.estimatedETA} minutes`,
          { duration: 5000 }
        );
        navigate('/');
      }, 1000);

    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Report Garbage Dump</h1>
          <p className="text-gray-600">
            Help keep Chennai clean by reporting illegal garbage dumps. Our AI will analyze
            the image and dispatch the appropriate vehicle.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Reporter Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="reporterName" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                id="reporterName"
                type="text"
                {...register('reporterName', { required: 'Name is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chennai-blue focus:border-transparent"
                placeholder="Enter your name"
              />
              {errors.reporterName && (
                <p className="mt-1 text-sm text-red-600">{errors.reporterName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="reporterContact" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                id="reporterContact"
                type="tel"
                {...register('reporterContact', { 
                  required: 'Contact number is required',
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: 'Enter a valid 10-digit mobile number'
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chennai-blue focus:border-transparent"
                placeholder="10-digit mobile number"
              />
              {errors.reporterContact && (
                <p className="mt-1 text-sm text-red-600">{errors.reporterContact.message}</p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photo <span className="text-red-500">*</span>
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-chennai-blue bg-blue-50'
                  : 'border-gray-300 hover:border-chennai-blue'
              }`}
            >
              <input {...getInputProps()} />
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <p className="text-sm text-gray-600">
                    Click or drag to replace image
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <svg
                    className="w-12 h-12 mx-auto text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-600">
                    {isDragActive
                      ? 'Drop the image here'
                      : 'Drag & drop an image, or click to select'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports: JPG, PNG, GIF, WebP
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Location Address
            </label>
            <input
              id="address"
              type="text"
              {...register('address', { required: 'Address is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chennai-blue focus:border-transparent"
              placeholder="e.g., Anna Nagar West, Chennai"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          {/* Map */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Pin Location on Map
              </label>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{isLoadingLocation ? 'Getting Location...' : 'Use My Location'}</span>
              </button>
            </div>
            <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
              <MapContainer
                center={position}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <LocationMarker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Selected: {position[0].toFixed(4)}, {position[1].toFixed(4)} (Click map or use button above to change)
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chennai-green focus:border-transparent"
              placeholder="Describe the garbage dump (e.g., type of waste, approximate size, any hazards)"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isAnalyzing ? 'Analyzing Image...' : isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
