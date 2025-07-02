import { useRef, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FaUser, FaChartLine, FaMobileAlt, FaRegClock, FaChalkboardTeacher, FaRobot, FaChartBar, FaExpand,FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";

// Helper function for Intersection Observer setup
const useIntersectionObserver = (options) => {
  const [entry, setEntry] = useState(null);
  const [node, setNode] = useState(null);

  const observer = useRef(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEntry(entry);
        // Optionally disconnect after first intersection
         observer.current.unobserve(entry.target);
      }
    }, options);

    const { current: currentObserver } = observer;

    if (node) currentObserver.observe(node);

    return () => currentObserver.disconnect();
  }, [node, options]);

  return [setNode, entry?.isIntersecting];
};

export default function GuestHome() {
  const loginSectionRef = useRef(null);
  const [isStartButtonHoveredTop, setIsStartButtonHoveredTop] = useState(false);
  const [isStartButtonHoveredHero, setIsStartButtonHoveredHero] = useState(false);
  const [hoveredFeatureIndex, setHoveredFeatureIndex] = useState(null);
  const [hoveredWhyChooseIndex, setHoveredWhyChooseIndex] = useState(null);
  const [hoveredSocialIcon, setHoveredSocialIcon] = useState(null);

  // Refs and state for scroll animations
  const [featuresSectionRef, featuresVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [whyChooseSectionRef, whyChooseVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [footerRef, footerVisible] = useIntersectionObserver({ threshold: 0.1 });

  const getAnimatedChildStyle = (isVisible, delay = '0s') => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: `opacity 0.6s ease-out ${delay}, transform 0.6s ease-out ${delay}`,
  });

  const getTitleAnimationStyle = (isVisible) => ({
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.8s ease-out 0.1s',
  });

  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      
      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        
        alignItems: 'center',
        background: 'linear-gradient(rgba(154, 163, 212, 0.72), rgba(89, 89, 141, 0.9)), url(../public/pictures/students.jpg)no-repeat center center/cover',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{
        display:'flex',
        paddingTop:'20px',
        paddingLeft:'20px'
      }}>
        <img
            src="./pictures/ofppt.png"
            alt="ISTA Logo"
            style={{
              width: '90px',
              height: '80px',
              marginBottom: '20px',
            }}
          />
          <Link to='/acces'>
                  <button
                    onMouseEnter={() => setIsStartButtonHoveredTop(true)}
                    onMouseLeave={() => setIsStartButtonHoveredTop(false)}
                    style={{
                      width:'230px',
                      marginLeft:'1200px',
                      backgroundColor: isStartButtonHoveredTop ? '#333' : '#000',
                      color: 'white',
                      border: 'none',
                      justifyContent:'center',
                      padding: '12px 30px',
                      borderRadius: '50px',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background-color 0.3s, transform 0.3s',
                      transform: isStartButtonHoveredTop ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                  <FaChalkboardTeacher />
                  Commencer maintenant
                  </button></Link>
        </div>
        
        <div style={{display:'block', maxWidth: '800px', margin: '0 auto' ,marginTop:'150px'}}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            Système Intelligent de Gestion de Présence
          </h1>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2.5rem'
          }}>
            Suivi en temps réel, analyse des performances, et gestion simplifiée des étudiants
          </p>
          <Link to='/acces'>
          <button
            onMouseEnter={() => setIsStartButtonHoveredHero(true)}
            onMouseLeave={() => setIsStartButtonHoveredHero(false)}
            style={{
              backgroundColor: isStartButtonHoveredHero ? '#333' : '#000',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '50px',
              fontSize: '1rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.3s, transform 0.3s',
              transform: isStartButtonHoveredHero ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <FaChalkboardTeacher />
            Commencer maintenant
          </button></Link>
        </div>
      </section>

      {/* Features Section Container */}
      <div ref={featuresSectionRef} style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '3rem',
            ...getTitleAnimationStyle(featuresVisible)
          }}>
            Fonctionnalités Clés
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginTop: '20px'
          }}>
            {[
              { icon: <FaRegClock size={40} />, title: "Suivi en Temps Réel", text: "Surveillance instantanée de la présence des étudiants" },
              { icon: <FaChartLine size={40} />, title: "Analyses Détaillées", text: "Statistiques et rapports de performance détaillés" },
              { icon: <FaMobileAlt size={40} />, title: "Accès Multi-Plateforme", text: "Disponible sur ordinateur, tablette et mobile" },
            ].map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredFeatureIndex(index)}
                onMouseLeave={() => setHoveredFeatureIndex(null)}
                style={{
                  padding: '30px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: hoveredFeatureIndex === index ? '0 8px 12px rgba(0,0,0,0.15)' : '0 4px 6px rgba(0,0,0,0.1)',
                  transform: hoveredFeatureIndex === index ? 'scale(1.03)' : 'scale(1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  ...getAnimatedChildStyle(featuresVisible, `${index * 0.15}s`)
                }}>
                <div style={{ color: '#000', fontSize: '40px', marginBottom: '20px' }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '15px'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#6c757d',
                  fontSize: '1rem'
                }}>
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      

      
         {/* Why Choose OFPPT Section Container */}
      <section ref={whyChooseSectionRef} style={{
        padding: '80px 20px',
        backgroundColor: 'white',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '3rem',
            color: '#000',
            ...getTitleAnimationStyle(whyChooseVisible)
          }}>
            Why Choose OFPPT?
          </h2>
          
          <div style={{
            display: 'block',
            gap: '40px',
            textAlign: 'left'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap:'20px',
              marginBottom: '20px'
            }}>
              {/* User-Friendly Interface */}
            <div
              onMouseEnter={() => setHoveredWhyChooseIndex(0)}
              onMouseLeave={() => setHoveredWhyChooseIndex(null)}
              style={{
                backgroundColor: '#f8f9fa',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: hoveredWhyChooseIndex === 0 ? '0 8px 12px rgba(0,0,0,0.15)' : '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                transform: hoveredWhyChooseIndex === 0 ? 'scale(1.03)' : 'scale(1)',
                cursor: 'pointer',
                maxWidth: '400px'
            }}>
              <div style={{
                backgroundColor: '#000',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <FaUser style={{ color: 'white', fontSize: '24px' }} />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '15px',
                color: '#000'
              }}>
                User-Friendly Interface
              </h3>
              <p style={{ color: '#6c757d' }}>
                Our platform is designed to be intuitive and easy to use for all stakeholders.
              </p>
            </div>
            

            {/* Advanced Automation */}
            <div
              onMouseEnter={() => setHoveredWhyChooseIndex(1)}
              onMouseLeave={() => setHoveredWhyChooseIndex(null)}
              style={{
                backgroundColor: '#f8f9fa',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: hoveredWhyChooseIndex === 1 ? '0 8px 12px rgba(0,0,0,0.15)' : '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                transform: hoveredWhyChooseIndex === 1 ? 'scale(1.03)' : 'scale(1)',
                cursor: 'pointer',
                 maxWidth: '400px'
            }}>
              <div style={{
                backgroundColor: '#000',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <FaRobot style={{ color: 'white', fontSize: '24px' }} />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '15px',
                color: '#000'
              }}>
                Advanced Automation
              </h3>
              <p style={{ color: '#6c757d' }}>
                Automate repetitive tasks and streamline complex processes for efficiency.
              </p>
            </div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap:'20px',
              marginTop:'20px',
              
            }}>
            {/* Real-Time Insights */}
            <div
              onMouseEnter={() => setHoveredWhyChooseIndex(2)}
              onMouseLeave={() => setHoveredWhyChooseIndex(null)}
              style={{
                backgroundColor: '#f8f9fa',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: hoveredWhyChooseIndex === 2 ? '0 8px 12px rgba(0,0,0,0.15)' : '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                transform: hoveredWhyChooseIndex === 2 ? 'scale(1.03)' : 'scale(1)',
                cursor: 'pointer',
                 maxWidth: '400px'
            }}>
              <div style={{
                backgroundColor: '#000',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <FaChartBar style={{ color: 'white', fontSize: '24px' }} />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '15px',
                color: '#000'
              }}>
                Real-Time Insights
              </h3>
              <p style={{ color: '#6c757d' }}>
                Gain real-time visibility into student performance and school operations.
              </p>
            </div>

            {/* Scalability and Flexibility */}
            <div
              onMouseEnter={() => setHoveredWhyChooseIndex(3)}
              onMouseLeave={() => setHoveredWhyChooseIndex(null)}
              style={{
                backgroundColor: '#f8f9fa',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: hoveredWhyChooseIndex === 3 ? '0 8px 12px rgba(0,0,0,0.15)' : '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                transform: hoveredWhyChooseIndex === 3 ? 'scale(1.03)' : 'scale(1)',
                cursor: 'pointer',
                 maxWidth: '400px'
            }}>
              <div style={{
                backgroundColor: '#000',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <FaExpand style={{ color: 'white', fontSize: '24px' }} />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '15px',
                color: '#000'
              }}>
                Scalability and Flexibility
              </h3>
              <p style={{ color: '#6c757d' }}>
                Our platform can grow with your institution and adapt to changing needs.
              </p>
            </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer ref={footerRef} style={{
        backgroundColor: "#263238",
        color: "#CFD8DC",
        padding: "40px 20px",
        textAlign: "center",
        borderTop: '3px solid #37474F',
        ...getAnimatedChildStyle(footerVisible)
      }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "40px", padding: "0 20px", marginBottom: '30px' }}>
      <div style={{ flex: "1", minWidth: "300px", maxWidth: "400px"}}>
            <iframe
              style={{ width: "100%", height: "200px", border: "none", borderRadius: '8px' }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1605.8580480478881!2d-9.7186239!3d29.690765499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb470a145a6bbe5%3A0x8a13d5d4ef8ecfd2!2z2KfZhNmF2LnZh9ivINin2YTZhdiq2K7Ytdi1INmE2YTYqtmD2YbZiNmE2YjYrNmK2Kcg2KfZhNiq2LfYqNmK2YLZitipX9iq2LLZhtmK2Ko!5e1!3m2!1sar!2sma!4v1743675818409!5m2!1sar!2sma"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        {/* Section Contact */}
        <div style={{ flex: "1", minWidth: "200px", maxWidth: "250px", textAlign: 'left'}}>
          <h3 style={{color: "#FFFFFF", marginBottom: '15px', fontWeight: 'bold' }}>Contact Us</h3>
          <p style={{color: "#CFD8DC", marginBottom: '8px'}}>ISTA TIZNIT</p>
          <p style={{color: "#CFD8DC", marginBottom: '8px'}}>M7RJ+8H2، تزنيت‎ 85000</p>
          <p style={{marginBottom: '8px'}}><a style={{textDecoration:'none', color: "#CFD8DC", transition: 'color 0.3s'}} href='http://www.ofppt.ma' onMouseEnter={(e) => e.target.style.color='#fff'} onMouseLeave={(e) => e.target.style.color='#CFD8DC'}>http://www.ofppt.ma</a></p>
          <p style={{color: "#CFD8DC"}}>0528862606</p>          
        </div>

        {/* Section Liens */}
        <div style={{ flex: "1", minWidth: "200px", maxWidth: "250px", textAlign: 'left' }}>
          <h3 style={{color: "#FFFFFF", marginBottom: '15px', fontWeight: 'bold' }}>District Resources</h3>
          <ul style={{ listStyle: "none", padding: "0" }}>
            <li style={{marginBottom: '8px'}}><a href="#" style={{ color: "#CFD8DC", textDecoration: "none", transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color='#fff'} onMouseLeave={(e) => e.target.style.color='#CFD8DC'}>Careers</a></li>
            <li style={{marginBottom: '8px'}}><a href="#" style={{ color: "#CFD8DC", textDecoration: "none", transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color='#fff'} onMouseLeave={(e) => e.target.style.color='#CFD8DC'}>Use of Facilities</a></li>
            <li style={{marginBottom: '8px'}}><a href="#" style={{ color: "#CFD8DC", textDecoration: "none", transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color='#fff'} onMouseLeave={(e) => e.target.style.color='#CFD8DC'}>Contact Us</a></li>
            <li style={{marginBottom: '8px'}}><a href="#" style={{ color: "#CFD8DC", textDecoration: "none", transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color='#fff'} onMouseLeave={(e) => e.target.style.color='#CFD8DC'}>Uniform Complaint Procedure</a></li>
          </ul>
        </div>

        <div style={{ flex: "1", minWidth: "200px", maxWidth: "250px", textAlign: 'left' }}>
          <h3 style={{color: "#FFFFFF", marginBottom: '15px', fontWeight: 'bold' }}>Find Your School</h3>
          <ul style={{ listStyle: "none", padding: "0" }}>
            <li style={{marginBottom: '8px'}}><a href="#" style={{ color: "#CFD8DC", textDecoration: "none", transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color='#fff'} onMouseLeave={(e) => e.target.style.color='#CFD8DC'}>School Locations Map</a></li>
            <li style={{marginBottom: '8px'}}><a href="#" style={{ color: "#CFD8DC", textDecoration: "none", transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color='#fff'} onMouseLeave={(e) => e.target.style.color='#CFD8DC'}>Family Resources</a></li>
            <li style={{marginBottom: '8px'}}><a href="#" style={{ color: "#CFD8DC", textDecoration: "none", transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color='#fff'} onMouseLeave={(e) => e.target.style.color='#CFD8DC'}>School Calendar</a></li>
            <li style={{marginBottom: '8px'}}><a href="#" style={{ color: "#CFD8DC", textDecoration: "none", transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color='#fff'} onMouseLeave={(e) => e.target.style.color='#CFD8DC'}>Enrollment Information</a></li>
            <li style={{marginBottom: '8px'}}><a href="#" style={{ color: "#CFD8DC", textDecoration: "none", transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color='#fff'} onMouseLeave={(e) => e.target.style.color='#CFD8DC'}>Title IX</a></li>
          </ul>
        </div>
      </div>

      {/* Réseaux Sociaux */}
      <div style={{ marginBottom: "30px", display: "flex", justifyContent: "center", gap: "25px" }}>
        <a
          href="https://www.facebook.com/ofppt.page.officielle/?locale=fr_FR"
          target="_blank" rel="noopener noreferrer"
          onMouseEnter={() => setHoveredSocialIcon('facebook')}
          onMouseLeave={() => setHoveredSocialIcon(null)}
          style={{
            color: hoveredSocialIcon === 'facebook' ? '#1877F2' : "#CFD8DC",
            fontSize: "1.8em",
            textDecoration: "none",
            transition: 'color 0.3s, transform 0.3s',
            transform: hoveredSocialIcon === 'facebook' ? 'scale(1.2)' : 'scale(1)'
          }}>
            <FaFacebook />
        </a>
        <a
          href="#"
          onMouseEnter={() => setHoveredSocialIcon('twitter')}
          onMouseLeave={() => setHoveredSocialIcon(null)}
          style={{
            color: hoveredSocialIcon === 'twitter' ? '#1DA1F2' : "#CFD8DC",
            fontSize: "1.8em",
            textDecoration: "none",
            transition: 'color 0.3s, transform 0.3s',
            transform: hoveredSocialIcon === 'twitter' ? 'scale(1.2)' : 'scale(1)'
           }}>
             <FaTwitter />
        </a>
        <a
          href="#"
          onMouseEnter={() => setHoveredSocialIcon('youtube')}
          onMouseLeave={() => setHoveredSocialIcon(null)}
          style={{
             color: hoveredSocialIcon === 'youtube' ? '#FF0000' : "#CFD8DC",
             fontSize: "1.8em",
             textDecoration: "none",
             transition: 'color 0.3s, transform 0.3s',
             transform: hoveredSocialIcon === 'youtube' ? 'scale(1.2)' : 'scale(1)'
           }}>
            <FaYoutube />
        </a>
      </div>

       <div style={{ borderTop: '1px solid #37474F', paddingTop: '20px', marginTop: '20px' }}>
        <p style={{ color: "#CFD8DC", fontSize: '0.9rem' }}>
          © {new Date().getFullYear()} OFPPT TIZNIT. All rights reserved.
        </p>
      </div>
    </footer>
    </div>
  );
} 