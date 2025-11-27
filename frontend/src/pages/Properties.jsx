import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Search, MapPin, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Properties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const response = await api.get('/properties/');
            setProperties(response.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProperties = properties.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Properties</h1>
                <Link
                    to="/properties/new"
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Property
                </Link>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search properties..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-dark-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary"
                />
            </div>

            {/* Grid */}
            {loading ? (
                <div className="text-center text-gray-400">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((property) => (
                        <div key={property.id} className="bg-dark-800 rounded-xl overflow-hidden border border-gray-800 hover:border-primary/50 transition-colors group">
                            <div className="h-48 bg-dark-700 relative">
                                {property.image ? (
                                    <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                        <Home size={48} />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white">
                                    ${property.price}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{property.title}</h3>
                                <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
                                    <MapPin size={16} />
                                    {property.location}
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>{property.property_type}</span>
                                    <span>{property.area} m²</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
