import { Button } from "@/components/ui/button";
import { signUp, signIn } from "@/lib/auth-client";

function App() {
  const handleSignUp = async () => {
    const name = "John Doe";
    const email = "john.doe@example.com";
    const password = "securePassword123";

    const { data, error } = await signUp.email({ name, email, password });
    console.log("data", data);
    console.log("error", error);
  };

  const handleSignIn = async () => {
    const email = "john.doe@example.com";
    const password = "securePassword123";
    const { data, error } = await signIn.email({ email, password });
    console.log("data", data);
    console.log("error", error);
  };

  return (
    <>
      <h1>Welcome to the Furniture Store</h1>
      <Button onClick={handleSignUp}>Sign Up</Button>
      <Button onClick={handleSignIn}>Sign In</Button>
    </>
  );
}

export default App;

// import { useState } from "react";
// import { Link } from "react-router";

// import { Button } from "@/components/ui/button";
// import { Spinner } from "@/components/ui/spinner";

// // import reactLogo from './assets/react.svg'
// // import viteLogo from '/vite.svg'

// // type HeaderProps = {
// //   title: string;
// //   body: string;
// // };

// interface TitleProps {
//   title: string;
// }

// interface HeaderPropsInterface extends TitleProps {
//   title: string;
//   body: string;
// }

// function Header({ title, body }: HeaderPropsInterface) {
//   return (
//     <>
//       <h1 className="text-red-500">This is {title}</h1>
//       <div>This is {body}</div>
//     </>
//   );
// }

// function Footer({ children }: { children: React.ReactNode }) {
//   return <div>{children}</div>;
// }

// // const TabButton = ({label, onPress}: {label: string; onPress: () => void}) =>
// //   (<button onClick={onPress}>{label}</button>);

// function App() {
//   // const [count, setCount] = useState(0)
//   const date = new Date().toLocaleDateString();
//   // const alertHello = () => alert("Hello");
//   // const alertWorld = () => alert("World");
//   // hooks is a function that allows you to use state and other React features in functional components.
//   // its name starts with "use"
//   const [counter, setCounter] = useState(0);

//   const increment = () => {
//     setCounter((prevCounter) => prevCounter + 1);
//     setCounter((prevCounter) => prevCounter + 1);
//   };

//   // let counter = 0;
//   // const incrementCounter = () => {
//   //   counter += 1;
//   //   console.log("Counter----", counter)
//   // }

//   return (
//     <>
//       // This is JSX Ui elements
//       <Link to="/about">Go to About Page</Link>
//       <br />
//       <Link to="/login">Go to Login Page</Link>
//       <Header title="Furniture Store" body="Welcome to our furniture store!" />
//       {/* function ထဲမှာ နောက်ထပ် function nested function လုပ်ခြင်း */}
//       <h2>Today is {date}</h2>
//       {/* <TabButton label="Tab 1" onPress={alertHello}/>
//       <TabButton label="Tab 2" onPress={alertWorld}/> */}
//       {/* <button onClick={() => setCounter((prevCounter) => prevCounter + 1)}>
//         Count - {counter}
//       </button>  */}
//       <button onClick={increment}>Count - {counter}</button>
//       <br />
//       <Button size="sm" variant="outline" disabled>
//         <Spinner className="text-purple-800" />
//         Submit
//       </Button>
//       <Footer>
//         <p>This is footer</p>
//       </Footer>
//       {/* <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div> */}
//       {/* <img src="vite.svg" alt="vite logo" />
//       <img src="src/assets/react.svg" alt="react logo"></img>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p> */}
//     </>
//   );
// }

// export default App;

