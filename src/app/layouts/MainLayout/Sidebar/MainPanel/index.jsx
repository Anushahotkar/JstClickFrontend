// Import Dependencies
import PropTypes from "prop-types";
import { Link } from "react-router";
import clsx from "clsx";

// Local Imports
import CircleJSTcliq from "assets/CircleJSTcliq.png";
import { Menu } from "./Menu";
// import { Item } from "./Menu/Item";
import { Profile } from "../../Profile";
import { useThemeContext } from "app/contexts/theme/context";
// import { settings } from "app/navigation/settings";

// ----------------------------------------------------------------------

export function MainPanel({ nav, setActiveSegment, activeSegment }) {


  const { cardSkin } = useThemeContext();
  return (
    <div className="main-panel" string={{backgroundColor: 'red'}}>
      <div
        className={clsx(
          " flex h-full w-full flex-col items-center border-gray-150 bg-white dark:border-dark-600/80 ltr:border-r rtl:border-l",
          cardSkin === "shadow" ? "dark:bg-dark-750" : "dark:bg-dark-900",
        )}
      >
        {/* Application Logo */}
        <div className="flex pt-3.5 ">
          
          <Link to="/">
             {/* PNG logo icon (responsive) */}
          <img
            src={CircleJSTcliq}
            alt="Logo"
            className="h-8 w-auto sm:h-10 md:h-12 lg:h-14 object-contain"
          />
          
          </Link>

        </div>

        <Menu
          nav={nav}
          activeSegment={activeSegment}
          setActiveSegment={setActiveSegment}
        />
       
      
 

        {/* Bottom Links */}
        <div className="flex flex-col items-center space-y-3 py-2.5">
          {/* <Item
            id={settings.id}
            component={Link}
            to="/settings/appearance"
            title={"Settings"}
            isActive={activeSegment === settings.path}
            Icon={settings.Icon}
          /> */}

           
 
          <Profile />
        </div>
      </div>
    </div>
  );
}

MainPanel.propTypes = {
  nav: PropTypes.array,
  setActiveSegment: PropTypes.func,
  activeSegment: PropTypes.string,
};
