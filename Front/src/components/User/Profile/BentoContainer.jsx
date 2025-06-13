import UserInfo from "./BentoProfile/UserInfo";

export default function BentoContainer() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <UserInfo />
    </div>
  );
}
