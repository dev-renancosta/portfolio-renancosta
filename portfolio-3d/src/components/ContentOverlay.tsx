import React, { useEffect, useRef } from 'react';
import { Container, Section } from './Layout';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './layout.css';

// Ensure ScrollTrigger is registered if not already
gsap.registerPlugin(ScrollTrigger);

export const ContentOverlay: React.FC = () => {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initials Fade In
        gsap.fromTo(contentRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 1, delay: 0.5 }
        );

        // ANIMATE SECTIONS & CARDS ON SCROLL
        const ctx = gsap.context(() => {
            // Animate Headers
            gsap.utils.toArray<HTMLElement>('.section-header').forEach(header => {
                gsap.from(header, {
                    scrollTrigger: {
                        trigger: header,
                        start: "top 85%",
                    },
                    y: 30,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out"
                });
            });

            // Animate Project/Service Cards (Batch)
            ScrollTrigger.batch(".project-card", {
                onEnter: (batch) => {
                    gsap.from(batch, {
                        y: 60,
                        opacity: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: "power3.out"
                    });
                },
                start: "top 90%"
            });
        }, contentRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={contentRef} className="overlay-wrapper">
            {/* Spacer for 3D Text Hero */}
            <div id="hero-spacer" style={{ height: '135vh' }}>
                <div className="scroll-indicator" style={{ top: '85vh' }}>
                    <span className="uppercase-track" style={{ fontSize: '12px' }}>Scroll to Explore</span>
                    <div className="scroll-line"></div>
                </div>
            </div>

            <div className="glass-panel">

                {/* ABOUT SECTION */}
                <Section id="about">
                    <Container>
                        <div className="grid-2">
                            <div className="section-header">
                                <h6 className="uppercase-track">Who I Am</h6>
                                <h2>
                                    Crafting Digital <br />
                                    <span>Experiences.</span>
                                </h2>
                            </div>
                            <div className="section-header">
                                <p>
                                    I combine cutting-edge technology with minimalist design to create "High-Ticket" web experiences.
                                    My focus is on performance, interactivity, and converting visitors into clients through immersive storytelling.
                                </p>
                                <p>
                                    Based in Brazil, working globally.
                                </p>
                            </div>
                        </div>
                    </Container>
                </Section>

                {/* SERVICES SECTION */}
                <Section id="services" className="bg-neutral-50">
                    <Container>
                        <div className="section-header">
                            <h6 className="uppercase-track">My Expertise</h6>
                            <h3 style={{ fontSize: '2rem', marginBottom: '3rem' }}>Solutions I Provide</h3>
                        </div>

                        <div className="grid-3">
                            <div className="project-card">
                                <h3>Creative Development</h3>
                                <p>WebGL, Three.js, and GSAP animations that bring your brand to life interactively.</p>
                            </div>
                            <div className="project-card">
                                <h3>Full Stack Web</h3>
                                <p>Scalable applications using React, Next.js, and Node.js with robust architecture.</p>
                            </div>
                            <div className="project-card">
                                <h3>UI/UX Design</h3>
                                <p>User-centric interfaces designed for conversion, accessibility, and visual impact.</p>
                            </div>
                        </div>
                    </Container>
                </Section>

                {/* WORK SECTION */}
                <Section id="work">
                    <Container>
                        <div className="section-header">
                            <h6 className="uppercase-track">Selected Work</h6>
                            <h3 style={{ fontSize: '2rem', marginBottom: '3rem' }}>Recent Projects</h3>
                        </div>

                        <div className="grid-2">
                            {/* Project Card 1 */}
                            <div className="project-card">
                                <div className="card-image">Immersive E-Comm</div>
                                <h3>E-Commerce Future</h3>
                                <p className="uppercase-track" style={{ margin: 0 }}>Next.js • WebGL</p>
                            </div>

                            {/* Project Card 2 */}
                            <div className="project-card">
                                <div className="card-image">Fintech App</div>
                                <h3>Fintech Dashboard</h3>
                                <p className="uppercase-track" style={{ margin: 0 }}>React • D3.js</p>
                            </div>

                            {/* Project Card 3 */}
                            <div className="project-card">
                                <div className="card-image">AI Platform</div>
                                <h3>Neural Interface</h3>
                                <p className="uppercase-track" style={{ margin: 0 }}>OpenAI • Three.js</p>
                            </div>

                            {/* Project Card 4 */}
                            <div className="project-card">
                                <div className="card-image">Luxury Real Estate</div>
                                <h3>Mansion XP</h3>
                                <p className="uppercase-track" style={{ margin: 0 }}>Vue • GSAP</p>
                            </div>
                        </div>
                    </Container>
                </Section>

                {/* EXPERIENCE SECTION */}
                <Section id="experience" className="bg-neutral-50">
                    <Container>
                        <div className="section-header">
                            <h6 className="uppercase-track">Career</h6>
                            <h3 style={{ fontSize: '2rem', marginBottom: '3rem' }}>Experience</h3>
                        </div>

                        <div className="grid-2">
                            <div className="project-card">
                                <span className="uppercase-track text-xs">2024 - Present</span>
                                <h3 style={{ marginTop: '0.5rem' }}>Senior Frontend Engineer</h3>
                                <p style={{ marginBottom: 0 }}>Tech Giants Inc.</p>
                                <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>Leading the 3D web team, optimizing rendering pipelines and improving core web vitals by 40%.</p>
                            </div>
                            <div className="project-card">
                                <span className="uppercase-track text-xs">2021 - 2024</span>
                                <h3 style={{ marginTop: '0.5rem' }}>Creative Developer</h3>
                                <p style={{ marginBottom: 0 }}>Digital Agency NY</p>
                                <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>Developed award-winning campaigns for Fortune 500 clients using WebGL and complex animations.</p>
                            </div>
                        </div>
                    </Container>
                </Section>

                {/* CONTACT SECTION */}
                <Section id="contact" className="footer-section">
                    <Container>
                        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', paddingTop: '4rem' }}>
                            <h2>
                                Let's Talk.
                            </h2>
                            <p>
                                Have a project in mind? Let's build something extraordinary together.
                            </p>
                            <a href="mailto:contact@renancosta.com" className="cta-button">
                                Get in Touch
                            </a>
                        </div>

                        <div className="footer-bottom">
                            <div>© 2026 Renan Costa</div>
                            <div className="footer-links">
                                <a href="#">LinkedIn</a>
                                <a href="#">GitHub</a>
                                <a href="#">Instagram</a>
                            </div>
                        </div>
                    </Container>
                </Section>

            </div>
        </div>
    );
};
