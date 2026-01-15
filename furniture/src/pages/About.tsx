import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

function About() {
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };
  return (
    <>
      <Link to="/">Go to Home Page</Link>
      <div>About Screen</div>
      <Button onClick={goHome}>Go Home</Button>
    </>
  );
}

export default About;
