import PropTypes from "prop-types";
import clsx from "clsx";
import { NavLink, useRouteLoaderData } from "react-router";
import { Badge } from "components/ui";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { useSidebarContext } from "app/contexts/sidebar/context";
import { useTranslation } from "react-i18next";

// ----------------------------------------------------------------------

export function MenuItem({ data }) {
  const { transKey, path, id, subtitle, secondaryLink } = data; 
  // secondaryLink = { title: 'Sub Page', path: '/sub-page' }

  const { lgAndDown } = useBreakpointsContext();
  const { close } = useSidebarContext();
  const { t } = useTranslation();

  const title = t(transKey) || data.title;
  const info = useRouteLoaderData("root")?.[id]?.info;

  const handleMenuItemClick = () => lgAndDown && close();

  return (
    <div className="flex flex-col min-w-0">
      {/* Main link */}
      <NavLink
        to={path}
        onClick={handleMenuItemClick}
        id={id}
        className={({ isActive }) =>
          clsx(
            "flex cursor-pointer items-center justify-between px-2 py-1 tracking-wide outline-hidden transition-[color,padding-left,padding-right] duration-300 ease-in-out hover:ltr:pl-4 hover:rtl:pr-4 min-h-[40px]",
            isActive
              ? "text-primary-600 dark:text-primary-400 font-medium"
              : "dark:text-dark-200 dark:hover:text-dark-50 text-gray-600 hover:text-gray-900 focus:text-gray-900"
          )
        }
      >
        {({ isActive }) => (
          <div
            data-menu-active={isActive}
            className="flex min-w-0 items-center justify-between"
          >
            <div className="flex min-w-0 items-center space-x-2">
              {/* Icon Circle */}
              <div
                className={clsx(
                  isActive
                    ? "bg-primary-600 dark:bg-primary-400 opacity-80"
                    : "opacity-50 transition-all",
                  "size-1.5 rounded-full border border-current flex-shrink-0"
                )}
              ></div>

              {/* Text */}
              <div className="flex flex-col min-w-0 overflow-hidden">
                <span className="truncate text-sm sm:text-base">{title}</span>
                {subtitle && (
                  <span className="truncate text-[0.65rem] sm:text-[0.75rem] text-gray-400 dark:text-dark-200">
                    {subtitle}
                  </span>
                )}
              </div>
            </div>

            {/* Badge */}
            {info && info.val && (
              <Badge
                color={info.color}
                className="h-5 min-w-[1.25rem] shrink-0 rounded-full p-[5px]"
              >
                {info.val}
              </Badge>
            )}
          </div>
        )}
      </NavLink>

      {/* Secondary link row */}
      {secondaryLink && secondaryLink.title && secondaryLink.path && (
        <NavLink
          to={secondaryLink.path}
          onClick={handleMenuItemClick}
          className="flex items-center px-6 py-1 text-xs sm:text-sm text-gray-500 hover:text-gray-700 dark:text-dark-200 dark:hover:text-dark-50 transition-colors truncate"
        >
          {secondaryLink.title}
        </NavLink>
      )}
    </div>
  );
}

MenuItem.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    transKey: PropTypes.string,
    path: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    secondaryLink: PropTypes.shape({
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  }),
};
