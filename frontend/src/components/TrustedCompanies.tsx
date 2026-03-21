import React from "react";

const companies = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
    { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
    { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" },
    { name: "TCS", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg" },
];

export const TrustedCompanies = () => {
    return (
        <section className="py-10 bg-muted/30 border-y border-border/50 overflow-hidden">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm font-semibold text-muted-foreground mb-8 uppercase tracking-wider">
                    Trusted by companies worldwide
                </p>

                <div className="relative flex overflow-x-hidden group">
                    <div className="flex animate-marquee whitespace-nowrap gap-16 items-center">
                        {/* First Set */}
                        {companies.map((company, index) => (
                            <div key={index} className="flex items-center justify-center min-w-[120px] grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                <img
                                    src={company.logo}
                                    alt={company.name}
                                    className="h-8 md:h-10 w-auto object-contain"
                                    loading="lazy"
                                />
                            </div>
                        ))}

                        {/* Duplicate Set for Seamless Loop */}
                        {companies.map((company, index) => (
                            <div key={`dup-${index}`} className="flex items-center justify-center min-w-[120px] grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                <img
                                    src={company.logo}
                                    alt={company.name}
                                    className="h-8 md:h-10 w-auto object-contain"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
