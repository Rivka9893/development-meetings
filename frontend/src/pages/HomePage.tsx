export const HomePage = () => {
    return (
        <section className="glass page-card hero-panel">
            <div>
                <p className="eyebrow">Smart Coordination</p>
                <h2>Plan, track, and manage development team meetings with clarity.</h2>
                <p className="lead">
                    This system helps software teams schedule meetings, avoid time conflicts,
                    and keep all meeting data in one centralized place.
                </p>
            </div>

            <div className="hero-visual" aria-hidden="true">
                <span className="hero-dot hero-dot-a" />
                <span className="hero-dot hero-dot-b" />
                <span className="hero-dot hero-dot-c" />

                <div className="glass-side-card side-left">
                    <svg className="line-icon" viewBox="0 0 64 64" aria-hidden="true">
                        <circle cx="22" cy="22" r="8" className="stroke" />
                        <path d="M10 44c1-8 6-13 12-13s11 5 12 13" className="stroke" />
                        <rect x="12" y="36" width="24" height="14" rx="3" className="stroke" />
                        <circle cx="47" cy="22" r="6" className="stroke" />
                        <path d="M40 40c1-6 4-10 8-10s7 4 8 10" className="stroke" />
                    </svg>
                </div>

                <div className="glass-side-card side-right">
                    <svg className="line-icon" viewBox="0 0 64 64" aria-hidden="true">
                        <circle cx="20" cy="22" r="7" className="stroke" />
                        <circle cx="44" cy="22" r="7" className="stroke" />
                        <circle cx="32" cy="18" r="7" className="stroke" />
                        <path d="M8 45c1-7 5-11 12-11s11 4 12 11" className="stroke" />
                        <path d="M32 45c1-7 5-11 12-11s11 4 12 11" className="stroke" />
                    </svg>
                </div>

                <div className="phone-wrap">
                    <div className="phone-notch" />
                    <div className="phone-screen">
                        <svg className="line-icon center-icon" viewBox="0 0 64 64" aria-hidden="true">
                            <rect x="10" y="14" width="44" height="30" rx="6" className="stroke" />
                            <circle cx="24" cy="27" r="5" className="stroke" />
                            <circle cx="40" cy="27" r="5" className="stroke" />
                            <path d="M16 40c1-5 4-8 8-8s7 3 8 8" className="stroke" />
                            <path d="M32 40c1-5 4-8 8-8s7 3 8 8" className="stroke" />
                            <path d="M26 50h12" className="stroke" />
                            <path d="M22 54h20" className="stroke" />
                        </svg>
                        <div className="screen-line" />
                        <div className="screen-line short" />
                    </div>
                </div>
            </div>
        </section>
    );
};
