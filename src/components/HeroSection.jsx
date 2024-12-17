import CharacterSelection from "./CharacterSelection";
import Feature from "./FeatureCard";

const HeroSection = () => {
  return (
    <section className="px-8 md:px-16 2xl:px-32 min-h-svh md:max-h-svh flex justify-start md:justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
        {/* Left Side */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-10 justify-between">
          <div>
            <h1 className="text-5xl md:text-8xl font-bold"
              style={{
                color: '#4a628a',
              }}>
              PIXIE-PAL ASSISTANT
            </h1>
            <p className="mt-6 text-2xl text-gray-600 leading-relaxed"
              style={{
                color: '#7ab2d3',
              }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore.
            </p>
          </div>
          <div>
            <Feature />
          </div>
        </div>
        <div className="col-span-1 md:col-span-3 flex gap-10 justify-center items-center">
          {/* Right Side */}
          <CharacterSelection />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
