// MainLayout/Profile.jsx
import { useNavigate } from "react-router-dom";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { Avatar, Button } from "components/ui";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";

export function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.reload();
  };

  return (
    <Popover className="relative">
      {/* Avatar (always redirects to profile) */}
      <PopoverButton
        as={Avatar}
        size={12}
        role="button"
        src="/images/200x200.png"
        alt="Profile"
        classNames={{ root: "cursor-pointer" }}
        onClick={() => navigate("/settings/general")}
      />

      {/* Logout Popover */}
      <Transition
        enter="duration-200 ease-out"
        enterFrom="translate-y-2 opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="duration-150 ease-in"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="translate-y-2 opacity-0"
      >
        <PopoverPanel
          anchor={{ to: "bottom end", gap: 8 }}
          className="z-[9999] w-30 rounded-lg border border-gray-200  bg-red-500 p-1 shadow-lg dark:border-dark-600 dark:bg-dark-700"
        >
          <Button
            size="sm"
            variant="outline"
            className="w-full flex items-center gap-2 text-sm"
            onClick={handleLogout}
          >
            <ArrowLeftStartOnRectangleIcon className="size-4" />
            Logout
          </Button>
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
