import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { Building2, Plus, Search, MapPin, DollarSign } from 'lucide-react';

export default function Properties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const response = await axios.get('/properties/');
            setProperties(response.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProperties = properties.filter(property =>
        property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Properties</h1>
                    <p className="text-gray-400 mt-1">Manage your real estate portfolio</p>
                </div>
                <Link
                    to="/properties/new"
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                    <Plus size={20} />
                    Add Property
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search properties by title or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-dark-800 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                />
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                    <Link
                        key={property.id}
                        to={`/properties/${property.id}`}
                        className="bg-dark-800 rounded-xl overflow-hidden border border-gray-700 hover:border-primary transition-all group"
                    >
                        {/* Image */}
                        <div className="relative h-48 bg-dark-700 overflow-hidden">
                            {property.main_image ? (
                                <img
                                    src={property.main_image}
                                    alt={property.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Building2 size={48} className="text-gray-600" />
                                </div>
                            )}
                            <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                                {property.property_type}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                {property.title}
                            </h3>

                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                                <MapPin size={16} />
                                <span>{property.city}, {property.address}</span>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                                <div className="flex items-center gap-2 text-primary font-bold text-lg">
                                    <DollarSign size={20} />
                                    {parseFloat(property.price).toLocaleString()}
                                </div>
                                <div className="text-gray-400 text-sm">
                                    {property.area} m²
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredProperties.length === 0 && (
                <div className="text-center py-12">
                    <Building2 size={64} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No properties found</h3>
                    <p className="text-gray-500">Start by adding your first property</p>
                </div>
            )}
        </div>
    );
}
