import React from "react"

import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

import '../css/stylemain.css';
import scrollFade from '../js/scrollFade.js';

function MainPage() {
  scrollFade();
  
  return (
    <React.Fragment>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Catch the Change</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"></link>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&family=Sacramento&display=swap" rel="stylesheet"></link>
      <link rel="icon" href="Images/logo.png" type="image/x-icon"></link>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

      <Header />

      <section id="home" className="hero">
        <video id="heroVideo" className="hero-media" autoPlay muted loop playsInline poster="Images/wp11499609-underwater-4k-wallpapers.jpg"></video>
        <div className="hero-overlay container text-center">
          <h1 className="hero-title">Catch the Change</h1>
          <p className="hero-sublead">
            Protecting Life Below Water by empowering fishers and communities with data, maps, and sustainable practices.
          </p>
        </div>
      </section>

      <section id="mission" className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 d-flex justify-content-center position-relative">
              <div className="image-stack">
                <img src="Images/EUGW6Y567RHORKM4KIVHVRO5KM.avif" alt="Fishing Community" className="main-img"></img>
                <img src="Images/product-5cf910cad0848.[1090].jpeg" alt="Fishing Practices" className="overlay-img"></img>
              </div>
            </div>
            <div className="col-md-6">
              <h1 className="section-title">Our Mission</h1>
              <p>
                Reduce the illegal fishing and the extinction of marine species by spreading important
                information about fishing practices. Moreover, we want to demonstrate that it is possible to
                achieve it through everyday actions that, despite their simplicity, can have a significant positive impact.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="about" className="py-5 text-center">
        <div className="container">
          <h1 className="section-title mb-4">Who We Are</h1>
          <p className="mb-5">
            We are university students committed to the United Nations' SDG 14 (Life Below Water).
            We want to encourage fishermen to fish responsibly.
          </p>
          <div className="about-box p-5">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="about-item">
                  <a href="/recommendations"> <img src="Images/life-cycle_18322369.png" alt="Education icon" className="about-icon mb-3"></img></a>
                  <h5><b>Recommendations</b></h5>
                </div>
              </div>
              <div className="col-md-4">
                <div className="about-item">
                  <a href="/endangered_species"> <img src="Images/data_1849450.png" alt="Maps icon" className="about-icon mb-3"></img></a>
                  <h5><b>Endangered species map</b></h5>
                </div>
              </div>
              <div className="col-md-4">
                <div className="about-item">
                  <a href="/fishing_activity"> <img src="Images/sustainable-fishing_18322517.png" alt="Conservation icon" className="about-icon mb-3"></img></a>
                  <h5><b>Fishing activity map</b></h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="importance" className="py-5 bg-light">
        <div className="container">
          <h1 className="section-title text-center">Why the Ocean Matters</h1>
          <div className="row justify-content-center mt-4">
            <div className="col-lg-8">
              <ul className="importance-list">
                <li>Oceans cover over 70% of the planet and regulate climate and oxygen.</li>
                <li>Home to extraordinary biodiversity; many species remain undiscovered.</li>
                <li>Source of food and livelihood for billions.</li>
                <li>Natural carbon sink: absorbs a large portion of CO₂ emissions.</li>
                <li>Cultural and economic importance for coastal communities.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </React.Fragment>
  );
};

export default MainPage;