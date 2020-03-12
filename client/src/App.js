import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import Chatbot from "./component/chatbot/Chatbot";
import Header from "./component/Header/Header";
import About from "./pages/About/About";
import Landing from "./pages/Landing/Landing";
import Shop from "./pages/Shop/Shop";

function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <header className="App-header">
          <Header />
        </header>
        <main>
          <Route exact path="/" component={Landing} />
          <Route exact path="/about" component={About} />
          <Route exact path="/shop" component={Shop} />

          <Chatbot />
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
