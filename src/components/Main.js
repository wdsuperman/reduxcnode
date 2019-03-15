import React, {Component} from 'react';
import {Route} from "react-router-dom"
import Section from "./Section"
import Posts from "./Posts"
import User from "./User"
import Create from "./Create"
import Edit from "./Edit"
import Collections from "./Collections"

class Main extends Component {
    render() {
        return (
            <div>
                <Route component={Section} path="/" exact/>
                <Route component={Posts} path="/post/:id"/>
                <Route component={User} path="/user/:loginname"/>
                <Route component={Create} path="/create"/>
                <Route component={Edit} path="/edit/:topicid"/>
                <Route component={Collections} path="/collections/:username"/>
            </div>
        );
    }
}

export default Main;