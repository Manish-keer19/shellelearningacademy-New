import certificate2 from "@/assets/certificate12.jpeg";
import certificate1 from "@/assets/certificate13.jpeg";

export const CertificationsSection = () => {
    return (
        <section className="py-12 bg-primary/5 border-y border-border/50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        Earn Your Certificate
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                        Showcase your new skills with a certificate that you can share with your network and potential employers.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    <div className="w-full md:w-1/2 lg:w-2/5">
                        <img src={certificate1} alt="Certificate Sample 1" className="rounded-lg shadow-2xl w-full h-auto transform transition-transform duration-300 hover:scale-105" />
                    </div>
                    <div className="w-full md:w-1/2 lg:w-2/5">
                        <img src={certificate2} alt="Certificate Sample 2" className="rounded-lg shadow-2xl w-full h-auto transform transition-transform duration-300 hover:scale-105" />
                    </div>
                </div>
            </div>
        </section>
    );
};
