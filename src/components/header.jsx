import '../css/stylemain.css'
//Default header for every section
const Header = () => {
    return (

        <header>
            <nav className="navbar navbar-expand-lg fixed-top">
                <div className="container">
                    <a className="navbar-brand d-flex align-items-center" href="/main">
                        <img src="../Images/logo.png" alt="Catch the Change Logo" className="logo-img" />
                        <span className="brand-title ms-2">Catch the Change</span>
                    </a>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse justify-content-end" id="mainNav">
                        <div className="nav-buttons d-flex gap-2">
                            <a className="btn btn-outline-light btn-sm" href="/main">Home</a>
                            <a className="btn btn-outline-light btn-sm" href="/endangered_species">Endangered Species</a>
                            <a className="btn btn-outline-light btn-sm" href="/fishing_activity">Fishing Activity</a>
                            <a className="btn btn-outline-light btn-sm" href="/recommendations">Recommendations</a>
                            <a className="btn btn-outline-light btn-sm" href="/posts">Posts</a>
                            <a className="btn btn-outline-light btn-sm" href="/profile">Profile</a>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;