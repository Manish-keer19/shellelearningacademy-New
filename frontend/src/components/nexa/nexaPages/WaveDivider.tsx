const WaveDivider = () => {
  return (
    <div className="relative h-24 sm:h-32 overflow-hidden">
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60V120H0V60Z"
          className="fill-green-50"
        />
        <path
          d="M0 80C240 120 480 40 720 80C960 120 1200 40 1440 80V120H0V80Z"
          className="fill-green-100/50"
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
