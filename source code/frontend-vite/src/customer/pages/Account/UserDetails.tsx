import { Divider } from "@mui/material";
import ProfileFildCard from "./ProfileFildCard";
import { useAppSelector } from "../../../Redux Toolkit/Store";

const UserDetails = () => {
  const { user } = useAppSelector((store) => store);

  return (
    <div className="flex justify-center py-6">
      <div className="w-full lg:w-[85%] space-y-6">
        <div className="pb-5 border-b border-brand-gold/15">
          <h1 className="font-serif text-2xl font-bold text-matte-black uppercase tracking-wide">
            Personal Details
          </h1>
          <p className="font-sans text-[11px] text-charcoal/50 uppercase tracking-widest mt-1">
            Manage your account credentials and personal profiling
          </p>
        </div>
        <div className="bg-white border border-brand-gold/15 p-6 space-y-4">
          <ProfileFildCard keys="Name" value={user.user?.fullName} />
          <Divider sx={{ borderColor: "rgba(200,162,74,0.1)" }} />
          <ProfileFildCard keys="Email" value={user.user?.email} />
          <Divider sx={{ borderColor: "rgba(200,162,74,0.1)" }} />
          <ProfileFildCard keys="Mobile" value={user.user?.mobile} />
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
