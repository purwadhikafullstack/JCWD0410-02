import { FC } from 'react';

interface PropertyMapProps {
  lat: string;
  long: string;
  zoom: number;
}

const PropertyMap: FC<PropertyMapProps> = ({ lat, long, zoom }) => (
  <iframe
    src={`https://maps.google.com/maps?q=${lat},${long}&z=${zoom}&output=embed`}
    width="100%"
    height="450"
    className="mt-10 rounded-xl"
    style={{ border: 0 }}
    allowFullScreen={true}
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  />
);

export default PropertyMap;
