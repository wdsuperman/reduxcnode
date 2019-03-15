import React, {Component} from 'react';
import Header from "./components/Header"
import Footer from "./components/Footer"
import {BrowserRouter as Router} from "react-router-dom"
import './app.css'
import Main from "./components/Main"
class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Header/>
                    <Main/>
                    <Footer/>
                </div>
            </Router>
        );
    }
}

export default App;