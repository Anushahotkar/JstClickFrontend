// Import Dependencies
import { Link } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

// Local Imports
import CircleJSTcliq from "assets/CircleJSTcliq.png";
import LogoType from "assets/logotype.svg";
import { Button } from "components/ui";
import { useSidebarContext } from "app/contexts/sidebar/context";

// ----------------------------------------------------------------------

export function Header() {
  const { close } = useSidebarContext();

  return (
    <header className="relative flex h-[61px] shrink-0 items-center justify-between ltr:pl-6 ltr:pr-3 rtl:pl-3 rtl:pr-6">
      <div className="flex items-center justify-start gap-3 pt-3">
        <Link to="/">
          {/* Responsive Logo */}
          <img
            src={CircleJSTcliq}
            alt="Logo"
            className="h-8 w-auto sm:h-10 md:h-12 lg:h-14 object-contain"
          />
        </Link>
        {/* Logo text also scales slightly */}
        <LogoType className="h-4 sm:h-5 md:h-6 lg:h-7 w-auto text-gray-800 bg-gray-200 dark:text-dark-50" />
      </div>

      <div className="pt-5 xl:hidden">
        <Button
          onClick={close}
          variant="flat"
          isIcon
          className="size-6 rounded-full"
        >
          <ChevronLeftIcon className="size-5 rtl:rotate-180" />
        </Button>
      </div>
    </header>
  );
}
