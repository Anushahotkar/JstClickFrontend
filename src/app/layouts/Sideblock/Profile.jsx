// Import Dependencies
import { useState, useEffect } from "react";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { TbUser } from "react-icons/tb";
import { Link } from "react-router-dom";

// Local Imports
import { Avatar, AvatarDot, Button } from "components/ui";

// Only keep Profile link
const links = [
  {
    id: "1",
    title: "Profile",
    description: "Your profile settings",
    to: "/settings/general",
    Icon: TbUser,
    color: "warning",
  },
];

export function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${API_BASE_URL}/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user details");
        const data = await res.json();
        setUser(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <Popover className="relative">
      <PopoverButton
        as={Avatar}
        size={12}
        role="button"
        src="/images/200x200.png"
        alt="Profile"
        indicator={<AvatarDot color="success" className="ltr:right-0 rtl:left-0" />}
        classNames={{ root: "cursor-pointer" }}
      />

      <Transition
        enter="duration-200 ease-out"
        enterFrom="translate-x-2 opacity-0"
        enterTo="translate-x-0 opacity-100"
        leave="duration-200 ease-out"
        leaveFrom="translate-x-0 opacity-100"
        leaveTo="translate-x-2 opacity-0"
      >
        <PopoverPanel
          anchor={{ to: "right end", gap: 12 }}
          className="border-gray-150 dark:border-dark-600 dark:bg-dark-700 z-70 flex w-64 flex-col rounded-lg border bg-white transition dark:shadow-none"
        >
          {({ close }) => (
            <>
              {/* User Info */}
              <div className="dark:bg-dark-800 flex items-center gap-4 rounded-t-lg bg-gray-100 px-4 py-5">
                <Avatar size={14} src="/images/200x200.png" alt="Profile" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-dark-100">
                    {loading ? "Loading..." : `${user?.firstName} ${user?.lastName}`}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-dark-300">
                    {loading ? "" : user?.email}
                  </p>
                </div>
              </div>

              {/* Profile Link */}
              <div className="flex flex-col pt-2 pb-5">
                {links.map((link) => (
                  <Link
                    key={link.id}
                    to={link.to}
                    onClick={close}
                    className="group flex items-center gap-3 px-4 py-2 tracking-wide transition-all hover:bg-gray-100 dark:hover:bg-dark-600"
                  >
                    <Avatar size={8} initialColor={link.color} classNames={{ display: "rounded-lg" }}>
                      <link.Icon className="size-4.5" />
                    </Avatar>
                    <div>
                      <h2 className="font-medium text-gray-800 dark:text-dark-100 group-hover:text-primary-600 transition-colors">
                        {link.title}
                      </h2>
                      <div className="text-xs text-gray-400 dark:text-dark-300">{link.description}</div>
                    </div>
                  </Link>
                ))}

                {/* Logout */}
                <div className="px-4 pt-4">
                  <Button
                    className="w-full gap-2"
                    onClick={() => {
                      localStorage.removeItem("authToken");
                      window.location.reload();
                    }}
                  >
                    <ArrowLeftStartOnRectangleIcon className="size-4.5" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
