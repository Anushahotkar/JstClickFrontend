// profile/Profile.jsx
import { Avatar } from "components/ui";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const navigate = useNavigate();

  return (
    <Avatar
      size={12}
      role="button"
      src="/images/200x200.png"
      alt="Profile"
      classNames={{ root: "cursor-pointer" }}
      onClick={() => navigate("/settings/general")}
    />
  );
}
