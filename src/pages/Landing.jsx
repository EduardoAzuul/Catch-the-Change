//landing page

import { Link } from 'react-router-dom';
import "../css/main.css";
import "../js/app.js";

const Landing = () => (
    <>
        <div className="burbujas">
            <div className="burbuja"></div>
            <div className="burbuja"></div>
            <div className="burbuja"></div>
            <div className="burbuja"></div>
            <div className="burbuja"></div>
            <div className="burbuja"></div>
            <div className="burbuja"></div>
        </div>

        <section className="layers">
            <div className="layers__container">
                <div
                    className="layers__item layer-1"
                    style={{ backgroundImage: "url('/Images/layer-1.jpg')" }}
                ></div>

                <div className="layers__item layer-3">
                    <div className="hero-content">
                        <h1 className ="hero-content_h1">Catch <span>The Change</span></h1>
                        <div className="hero-content__text">
                            “Without oceans, there is no tomorrow.”
                        </div>
                        <Link to="/main">
                            <button className="button">Start Exploring</button>
                        </Link>
                    </div>
                </div>

                <div className="layers__item layer-4"></div>
            </div>
        </section>
    </>
);

export default Landing;