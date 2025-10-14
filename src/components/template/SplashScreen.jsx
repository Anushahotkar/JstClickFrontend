// Local Imports 
import JSTcliqBlue from "assets/JSTcliqBlue.jpeg"; // import your PNG
import { Progress } from "components/ui";

// ----------------------------------------------------------------------

export function SplashScreen() {
  return (
    <div className="fixed grid h-full w-full place-content-center bg-white">
      <img
        src={JSTcliqBlue}
        alt="Logo"
        className="w-48 max-w-full sm:w-56 md:w-64 lg:w-72 xl:w-80"
      />
      <Progress
        color="primary"
        isIndeterminate
        animationDuration="1s"
        className="mt-4 h-1 w-3/4 sm:w-2/3 md:w-1/2"
      />
    </div>
  );
}
