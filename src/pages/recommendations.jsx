import React, { useState } from 'react';
import { style } from 'react-dom';

import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import Modal from '../components/formModal.jsx';

import '../css/style_recom.css';
import scrollFade from '../js/scrollFade.js';

function Recommendations() {
    scrollFade();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            name: e.target.name.value,
            email: e.target.email.value,
            subject: e.target.subject.value,
            message: e.target.message.value
        };
        
        setFormData(data); // Store data to display in modal
        setIsModalOpen(true); // Open the modal
        e.target.reset();

        /*
        try { //converts the info to json file and sends it to the server
            const response = await fetch('/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
            });

            const result = await response.json();//saves the server response

            if (result.success) {
                modal.show();//the modal from bootstrap is opened
                modalTitle.textContent = "Message Sent!";
                modalMessage.textContent = "Thanks for reaching out! We'll get back to you soon :)";
            }
        } catch (err) {
            modal.show();//the modal from bootstrap is opened
            modalTitle.textContent = "Oops!";
            modalMessage.textContent = "Something went wrong. Please try again later.";
        }
        */

    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    return (
        <React.Fragment>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Recommendations</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"></link>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet"></link>
            <link href="https://fonts.googleapis.com/css?family=Sacramento" rel="stylesheet"></link>

            <link rel="icon" href="images/logo.png" type="image/x-icon"></link>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

            <Header />

            <section id="home" className="hero">
                <video id="heroVideo" className="hero-media" autoPlay muted loop playsInline poster="Images/HeroImages/recomendations.jpg"></video>


                <div className="hero-overlay container text-center">
                    <h1 className="hero-title">Recommendations</h1>
                    <p className="hero-sublead">Protecting Life Below Water empowering fishers and communities with data, maps and sustainable practices.</p>
                </div>
            </section>

            <div className="container-fluid">
                <div className="row main">
                    <div className="col-md-6">
                        <img src="Images/fondo del mar.jpg" className="img-fluid rounded" alt="Ejemplo imagen"></img>
                    </div>

                    <div className="col-md-6 align-items-center pt-5 p-2">
                        <div className="texto">
                            <h1 className="mh1" style={{ fontSize: '50px' }}>How to protect marine life</h1>
                            <p>
                                Marine life depends on our actions. Here you will find sustainable fishing practices and regulations that
                                help to protect oceans and their species.
                            </p>
                            <h2 className="centered-heading mh2" style={{color:"#0077b6", fontSize: '25px', fontFamily: "system-ui"}}>Catch the change</h2> <br />

                            <h2 className="mh2" style={{color:"#0077b6", fontSize: '25px', fontFamily: "system-ui"}}>Sustainable fishing practices</h2>
                            <ul>
                                <li> Fish in specific seasons based on tides and the moon, so that species have time to reproduce.</li>
                                <li> Respect protected areas and do not fish in that area.</li>
                                <li> Do not use nets and traps, instead use methods like spearfishing,
                                    and cast netss to catch only what you need.</li>
                                <li> Practice rod-and-reel fishing to allow non-targeted species to liberate easily and avoid overfishing.</li>
                                <li> Comply to your area's regulations.</li>
                                <li> Consume only from well-managed and sustainable fisheries</li>
                            </ul>

                            <h2 className="mh2" style={{color:"#0077b6", fontSize: '25px', fontFamily: "system-ui"}}>Complying to regulations</h2>
                            <p>
                                When fishing, it is important to be aware of the regulations in your location.
                                The official website of the area should have a section about them.
                                Some of these websites are listed below.
                            </p>
                            <div>
                                <div className="government1">
                                    <a href="https://www.fisheries.noaa.gov/rules-and-regulations/fisheries" target="_blank">
                                        <img src="Images/noaa_gob.png" className="img-fluid rounded" alt="Ejemplo imagen"></img>
                                    </a>
                                </div>

                                <div className="government2">
                                    <a href="https://consulmex.sre.gob.mx/vancouver/index.php/en/consular-services/12-comunicados-del-consulado/229-regulations-for-sport-fishing-activities-in-mexico-be-aware" target="_blank">
                                        <img src="Images/mexico_gob.png" className="img-fluid rounded" alt="Ejemplo imagen"></img>
                                    </a>
                                </div>

                            </div>
                            <h2 style={{color:"#0077b6", fontSize: '25px', fontFamily: "system-ui"}}>Organizations</h2>
                            <div>
                                <div className="ORG1">
                                    <a href="https://www.seafoodwatch.org/recommendations" target="_blank">
                                        <img src="Images/mba_org.png" className="img-fluid rounded" alt="Ejemplo imagen"></img>
                                    </a>
                                </div>

                                <div className="ORG2">
                                    <a href="https://www.msc.org/what-we-are-doing/minimising-fishing-impacts-on-ecosystems-and-habitats" target="_blank">
                                        <img src="Images/msc_org.png" className="img-fluid rounded" alt="Ejemplo imagen"></img>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container my-5">
                    <div className="row">

                        <div className="col-md-12 d-flex align-items-center justify-content-center contact_forms">
                            <div className="rectangle">
                                <div className="contact" id="contacto">
                                    <h1 className="mh1" style={{ fontSize: '50px' }}>¡Contact us!</h1>
                                    <p>We want to hear from you.</p>
                                    <ul className="ul_contact">
                                        <li>Give us feedback</li>
                                        <li>For providing help</li>
                                        <li>For more information</li>
                                        <li>Any kind comment is allowed</li>
                                    </ul>
                                </div>
                                <div>
                                    <form className="forms" id="contactForm" onSubmit={handleSubmit}>
                                        <label htmlFor="name">Name:</label><br />
                                        <input type="text" id="name" name="name" required></input><br />
                                        <label htmlFor="email">Email:</label><br />
                                        <input type="email" id="email" name="email" required></input><br />
                                        <label htmlFor="subject">Subject:</label><br />
                                        <input type="text" id="subject" name="subject" required></input><br /><br />
                                        <textarea name="message" id="message" rows="10" cols="30" required></textarea><br />
                                        <input type="submit" value="Send"></input>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                            <h5 className="modal-title" id="Modal_head">Message Sent</h5><br/>
                            <p>Thanks for reaching out! We'll get back to you ASAP!</p>
                            <p>Your email: {formData.email}</p>
                        </Modal>
                    </div>
                </div>
            </div>

            <Footer />

        </React.Fragment>

    );
};

export default Recommendations;