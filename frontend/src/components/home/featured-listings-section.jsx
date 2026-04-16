import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Home, Car, MapPin } from "lucide-react";
import api from "../../common/api";

const FeaturedListingsSection = () => {
  const [activeTab, setActiveTab] = useState("properties");
  const [properties, setProperties] = useState([]);
  const [dealerships, setDealerships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured properties and dealerships from backend
    const fetchData = async () => {
      setLoading(true);
      try {
        const [propRes, dealerRes] = await Promise.all([
          api.get("/properties?limit=4"),
          api.get("/dealerships?limit=4")
        ]);

        if (propRes.data) setProperties(propRes.data);
        if (dealerRes.data) setDealerships(dealerRes.data);

      } catch (error) {
        console.error("Error fetching featured data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.heading}>
            Featured Buying Groups
          </h2>
          <p style={styles.subtitle}>
            Join these popular groups and start saving today
          </p>
        </div>

        <div style={styles.tabs}>
          <div style={styles.tabsList}>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === "properties" ? styles.tabActive : {})
              }}
              onClick={() => setActiveTab("properties")}
            >
              <Home style={{ width: '18px', height: '18px' }} />
              <span>Properties</span>
            </button>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === "dealerships" ? styles.tabActive : {})
              }}
              onClick={() => setActiveTab("dealerships")}
            >
              <Car style={{ width: '18px', height: '18px' }} />
              <span>Dealerships</span>
            </button>
          </div>
        </div>

        {activeTab === "properties" && (
          <div>
            {loading ? (
              <div style={styles.loadingText}>Loading properties...</div>
            ) : properties.length > 0 ? (
              <div style={styles.grid}>
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p>No active properties available at the moment.</p>
              </div>
            )}
            <div style={styles.viewAllContainer}>
              <Link to="/user/properties" style={styles.viewAllButton}>
                <span>View All Properties</span>
                <ArrowRight style={{ width: '18px', height: '18px' }} />
              </Link>
            </div>
          </div>
        )}

        {activeTab === "dealerships" && (
          <div>
            {loading ? (
              <div style={styles.loadingText}>Loading dealerships...</div>
            ) : dealerships.length > 0 ? (
              <div style={styles.grid}>
                {dealerships.map((dealership) => (
                  <DealershipCard key={dealership._id} dealership={dealership} />
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p>No active dealerships available at the moment.</p>
              </div>
            )}
            <div style={styles.viewAllContainer}>
              <Link to="/user/dealerships" style={styles.viewAllButton}>
                <span>View All Dealerships</span>
                <ArrowRight style={{ width: '18px', height: '18px' }} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const PropertyCard = ({ property }) => {
  const imageUrl = property.images && property.images.length > 0 && property.images[0]
    ? (property.images[0].startsWith('http') ? property.images[0] : `http://localhost:5000/${property.images[0]}`)
    : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80";

  return (
    <Link to={`/user/properties/${property._id}`} style={styles.card}>
      <div style={styles.cardImage}>
        <img
          src={imageUrl}
          alt={property.projectName}
          style={styles.image}
        />
        <div style={styles.featuredBadge}>
          {property.city?.name || "Featured"}
        </div>
      </div>
      <div style={styles.cardContent}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>{property.projectName}</h3>
          <span style={styles.propertyType}>{property.propertyType}</span>
        </div>
        <div style={styles.location}>
          <MapPin style={{ width: '14px', height: '14px' }} />
          <span>{property.location}</span>
        </div>
        <div style={styles.cardFooter}>
          <div style={styles.price}>
            <div style={styles.currentPrice}>Min: ₹{property.minimumPrice?.toLocaleString()}</div>
          </div>
          <div style={styles.savings}>
            Join Deadline: {new Date(property.groupJoiningDeadline).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  );
};

const DealershipCard = ({ dealership }) => {
  return (
    <div style={styles.card}>
      <div style={styles.cardImage}>
        {dealership.images && dealership.images.length > 0 && dealership.images[0] ? (
          <img
            src={dealership.images[0].startsWith('http') ? dealership.images[0] : `http://localhost:5000/${dealership.images[0].replace(/\\/g, '/')}`}
            alt={dealership.name}
            style={styles.image}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eff6ff', color: '#3b82f6' }}>
            <Car size={48} />
          </div>
        )}
        {/* Fallback container for error handling */}
        <div style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eff6ff', color: '#3b82f6', position: 'absolute', top: 0, left: 0 }}>
          <Car size={48} />
        </div>

        <div style={styles.featuredBadge}>
          {dealership.city?.name || "Featured"}
        </div>
      </div>
      <div style={styles.cardContent}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>{dealership.name}</h3>
          <span style={styles.propertyType}>{dealership.brand}</span>
        </div>
        <div style={styles.location}>
          <MapPin style={{ width: '14px', height: '14px' }} />
          <span>{dealership.address}</span>
        </div>
        <div style={styles.cardFooter}>
          <div style={styles.price}>
            <div style={styles.currentPrice}>{dealership.contactPerson}</div>
          </div>
          <div style={styles.savings}>
            {dealership.contactPhone}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  section: {
    padding: "80px 20px",
    backgroundColor: "#ffffff",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    maxWidth: "700px",
    margin: "0 auto 32px",
    textAlign: "center",
  },
  heading: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "16px",
  },
  subtitle: {
    fontSize: "18px",
    lineHeight: "1.6",
    color: "#6b7280",
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "32px",
  },
  tabsList: {
    display: "inline-flex",
    backgroundColor: "#f3f4f6",
    borderRadius: "8px",
    padding: "4px",
    gap: "4px",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "500",
    color: "#6b7280",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabActive: {
    backgroundColor: "#ffffff",
    color: "#111827",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
    textDecoration: "none",
    transition: "all 0.3s",
    display: "block",
    height: "100%",
  },
  cardImage: {
    position: "relative",
    width: "100%",
    height: "200px",
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  featuredBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    padding: "4px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600",
  },
  cardContent: {
    padding: "16px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
    flex: 1,
  },
  propertyType: {
    fontSize: "12px",
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
    padding: "2px 8px",
    borderRadius: "4px",
    marginLeft: "8px",
    whiteSpace: "nowrap",
  },
  location: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "12px",
  },
  cardFooter: {
    borderTop: "1px solid #e5e7eb",
    paddingTop: "12px",
  },
  price: {
    marginBottom: "4px",
  },
  currentPrice: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827",
  },
  savings: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#10b981",
  },
  viewAllContainer: {
    textAlign: "center",
  },
  viewAllButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "transparent",
    color: "#10b981",
    padding: "12px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "600",
    border: "1px solid #10b981",
    transition: "all 0.2s",
  },
  loadingText: {
    textAlign: "center",
    padding: "40px",
    color: "#6b7280",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px",
    color: "#6b7280",
  },
};

export default FeaturedListingsSection;
