import React from "react";
import { useUser } from "../contexts/UserContext";

const Home = () => {
  const { user } = useUser();
  console.log(user);

  return <div>Welcome Stranger</div>;
};

export default Home;
