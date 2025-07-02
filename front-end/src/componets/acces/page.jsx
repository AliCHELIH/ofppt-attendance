import { useRef, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FaUser, FaUserTie } from "react-icons/fa";

// Helper function for Intersection Observer setup (reusing from GuestHome)
const useIntersectionObserver = (options) => {
  const [entry, setEntry] = useState(null);
  const [node, setNode] = useState(null);

  const observer = useRef(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEntry(entry);
        // Disconnect after first intersection
         observer.current.unobserve(entry.target);
      }
    }, options);

    const { current: currentObserver } = observer;

    if (node) currentObserver.observe(node);

    return () => currentObserver.disconnect();
  }, [node, options]);

  return [setNode, entry?.isIntersecting];
};

export default function Home() {
  // State for hover effects
  const [isHomeButtonHovered, setIsHomeButtonHovered] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const [hoveredLoginButtonIndex, setHoveredLoginButtonIndex] = useState(null);

  // Refs and state for scroll animations
  const [loginSectionRef, loginSectionVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [footerRef, footerVisible] = useIntersectionObserver({ threshold: 0.1 });

  // Helper function for animation styles
   const getAnimationStyle = (isVisible) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)', // Slightly less translation
    transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
  });

  return (
    <div style={{
        minHeight: '100vh',
        display: 'flex', // Use flexbox for layout
        flexDirection: 'column', // Stack header, main, footer vertically
        backgroundColor: '#f4f7f6' // Lighter background for body
        }}>

      <header style={{
        display: 'flex',
        justifyContent: 'space-between', // Space out logo and button
        alignItems: 'center', // Vertically align items
        padding: '15px 40px', // Adjust padding
        backgroundColor: '#ffffff', // White background for header
        boxShadow: '0 2px 5px rgba(0,0,0,0.08)' // Softer shadow
      }}>

        {/* Using Link for logo to potentially go home */}
        <Link to='/'>
          <img src="./pictures/ista.png"
              alt="ISTA Logo"
              style={{
                // width: '300px', // Adjusted width
                height: '65px', // Adjusted height
                display: 'block' // Removes extra space below image
              }}
            />
        </Link>
          <Link to='/'>
                  <button
                    onMouseEnter={() => setIsHomeButtonHovered(true)}
                    onMouseLeave={() => setIsHomeButtonHovered(false)}
                    style={{
                      width:'auto', // Auto width based on content
                      padding: '10px 25px', // Adjusted padding
                      backgroundColor: isHomeButtonHovered ? '#333' : '#000', // Hover effect
                      color: 'white',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: '0.8rem', // Slightly larger font
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background-color 0.3s ease, transform 0.2s ease', // Smooth transition
                      transform: isHomeButtonHovered ? 'scale(1.05)' : 'scale(1)', // Hover scale
                    }}
                  >
                    Home
                  </button>
          </Link>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}> {/* Centered content */}
        {/* Login Sections */}
        <div ref={loginSectionRef} style={{
          padding: '80px 0px', // Increased vertical padding
           ...getAnimationStyle(loginSectionVisible) // Apply animation
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '2.2rem', // Slightly larger title
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '4rem', // Increased bottom margin
              color: '#2c3e50' // Keeping this dark blue-grey for title, change if needed
            }}>
              Accès Personnel
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Adjust minmax for responsiveness
              gap: '40px', // Increased gap
            }}>
              {[
                { role: "Administrateur", path: "/administrateur/login", icon: <FaUserTie size={40} /> },
                { role: "Gestionnaire", path: "/gestionnaire/login", icon: <FaUser size={40} /> },
                { role: "Formateur", path: "/formateur/login", icon: <FaUser size={40} /> },
              ].map((login, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredCardIndex(index)}
                  onMouseLeave={() => setHoveredCardIndex(null)}
                  style={{
                    padding: '40px 30px', // Adjusted padding
                    backgroundColor: '#ffffff', // White background for cards
                    borderRadius: '10px', // Slightly larger radius
                    boxShadow: hoveredCardIndex === index ? '0 8px 25px rgba(0,0,0,0.12)' : '0 4px 15px rgba(0,0,0,0.08)', // Enhanced hover shadow
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition for hover
                    textAlign: 'center',
                    transform: hoveredCardIndex === index ? 'translateY(-5px)' : 'translateY(0)', // Lift effect on hover
                    border: '1px solid #e0e0e0', // Subtle border
                    display: 'flex', // Use flexbox for card content layout
                    flexDirection: 'column',
                    alignItems: 'center'
                 }}>
                  <div style={{ color: '#000', fontSize: '40px', marginBottom: '25px' }}> {/* Changed icon color to black */}
                    {login.icon}
                  </div>
                  <h3 style={{
                    fontSize: '1.6rem', // Increased font size
                    fontWeight: '600',
                    marginBottom: '25px', // Increased margin
                    color: '#34495e' // Slightly different dark color
                  }}>
                    {login.role}
                  </h3>
                  <Link
                    to={login.path}
                    onMouseEnter={() => setHoveredLoginButtonIndex(index)}
                    onMouseLeave={() => setHoveredLoginButtonIndex(null)}
                    style={{
                      backgroundColor: hoveredLoginButtonIndex === index ? '#333' : '#000', // Black button with grey hover
                      color: 'white',
                      padding: '12px 35px', // Adjusted padding
                      borderRadius: '50px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      display: 'inline-block',
                      transition: 'background-color 0.3s ease, transform 0.2s ease', // Smooth transition
                      marginTop: 'auto', // Push button to bottom if card heights vary
                      transform: hoveredLoginButtonIndex === index ? 'scale(1.03)' : 'scale(1)', // Button scale on hover
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                  >
                    Se Connecter
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer ref={footerRef} style={{
        padding: '40px 20px', // Adjusted padding
        backgroundColor: '#222', // Darker grey/black footer background
        color: '#ecf0f1', // Lighter text color for footer
        textAlign: 'center',
        marginTop: '60px', // Ensure space above footer
        borderTop: '3px solid #444', // Dark grey accent border top
         ...getAnimationStyle(footerVisible) // Apply animation
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
           {/* Restored logo */}
           <img
            src="./pictures/ofppt.png" // Make sure path is correct relative to public folder or use import
            alt="OFPPT Logo"
            style={{
              height: '50px', // Adjusted size
              marginBottom: '20px', // Increased margin below logo
              filter: 'brightness(0) invert(1)' // Make logo white
            }}
          />
           <p style={{
            marginBottom: '15px', // Adjusted margin
            fontSize: '1rem', // Standard font size
            color: '#bdc3c7' // Slightly muted text color
          }}>
            Institut Spécialisée de Technologie Appliquée Tiznit
          </p>
          <p style={{ color: '#95a5a6', fontSize: '0.9rem' }}> {/* Muted color for copyright */}
            © {new Date().getFullYear()} Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}