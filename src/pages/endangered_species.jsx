import React, { useState, useEffect, useRef } from 'react';

import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import MexicoMap from './mexicomap.jsx';

import '../css/style_endangered.css';
import scrollFade from '../js/scrollFade.js';

function Endagered() {
    scrollFade();

    return (
        <React.Fragment>

            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Endengered Species</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"></link>
            <link rel="preconnect" href="https://fonts.googleapis.com"></link>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"></link>
            <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Raleway:ital@0;1&family=Sacramento&display=swap" rel="stylesheet"></link>
            <link rel="icon" href="images/logo.png" type="image/x-icon"></link>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

            <Header />

            <section id="home" className="hero">
                <video id="heroVideo" className="hero-media" autoPlay muted loop playsInline poster="Images/HeroImages/endengered.jpg"></video>
                <div className="hero-overlay container text-center">
                    <h1 className="hero-title">Endengered Species</h1>
                    <p className="hero-sublead">Protecting Life Below Water empowering fishers and communities with data, maps and sustainable practices.</p>
                </div>
            </section>

            <main id="main" className="container my-5">

                <section className="mb-5">
                    <p>
                        An endangered species is a type of organism, such as plants, animals, microbes, fungus, that is at
                        risk of extinction due to a rapid decrease in its population or a loss of its habitat.
                    </p>
                    <h2 className="mh2">Why do species become endangered?</h2>
                    <p>There are two main reasons:</p>
                    <ol>
                        <li>
                            <h3 className="mh3">Habitat loss</h3>
                            <ul>
                                <li>
                                    Natural causes can lead to habitat loss. For example, dinosaurs became extinct
                                    because a sudden climate shift.
                                </li>
                                <li>
                                    Human-driven factors like urban development, agriculture, and deforestation also
                                    destroy habitats. For instance, about 20% of the Amazon rainforest has been cleared
                                    in the last 50 years to create space for cattle ranches.
                                </li>
                                <li>
                                    Invasive species introduced by humans can further threaten native species and ecosystems.
                                </li>
                                <li>
                                    Loss of habitat can also lead to increased encounters between humans and wildlife. For
                                    example, whales may get entangled in fishing gear or struck by boats. Peoplle hunting or
                                    accidentally killing wildlife can also contribute to a species´s endangered status.
                                </li>
                            </ul>
                        </li>
                        <br />
                        <li>
                            <h3 className="mh3">Loss of genetic variation</h3>
                            <ul>
                                <li>
                                    Genetic diversity helps species adapt to environmental changes. However, nowadays,
                                    many species have low genetic variation due to small population sizes, inbreeding,
                                    and habitat fragmentation.
                                </li>
                                <li>
                                    Human activity can also cause a loss of genetic variation. For example, overfishing has
                                    reduced the populations of many animals. The pressure on the fishing industry to catch
                                    more fish has led to a decrease in the number of healthy adult fish in the wild that can
                                    reproduce.
                                </li>
                            </ul>
                        </li>
                    </ol>
                </section>

                <section className="mb-5">
                    <h2 className="mh2">Characteristics of Endangered Species</h2>
                    <p>
                        Using international criteria, like the IUCN Red List, a species may be labeled endangered based on
                        several
                        factors.
                        Currently, there are more than 169,000 species on The IUCN Red List, with more than 47,000 species
                        threatened with extinction,
                        including 44% of reef building corals, 37% of sharks and rays, 26% of mammals, 26% of freshwater
                        fishes.
                    </p>
                    <p>
                        The Red List has nine levels of conservation. Seven of these levels rank how close a species is to
                        extinction: least concern,
                        near threatened, vulnerable, endangered, critically endangered, extinct in the wild, and extinct.
                        The
                        other
                        two levels are data
                        deficient, meaning that scientists do not have enough information to determine which category they
                        belong.
                        The other level is
                        "not evaluated", which means that the species has not yet been assessed.
                    </p>
                    <p>
                        Classifying a species as endangered has to do with its range and habitat, as well as its actual
                        population.
                        For this reason,
                        a species can be of least concern in one area and endangered in another. For example, the gray whale
                        has
                        a
                        healthy population
                        in the eastern Pacific Ocean along the coast of North and South America, however, in the western
                        Pacific
                        Ocean, the population
                        is critically endangered.
                    </p>
                </section>
                <section className="map container my-5">
                    <h2 className="mb-3">Mexico critical endangered marine species</h2>
                    <MexicoMap />
                </section>
            </main>

            <Footer />

        </React.Fragment>
    );
};

export default Endagered;