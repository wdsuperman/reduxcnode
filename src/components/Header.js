import React, {Component} from 'react';
import { Link } from "react-router-dom"
import styled from 'styled-components'
class Header extends Component {
    render() {
        return (
            <div>
                <Had>
                    <div className='wrap'>
                        <Link to='/'><img className='logo' src="//static2.cnodejs.org/public/images/cnodejs_light.svg" alt=""/></Link>
                        <ul className='nav'>
                            <li><Link to='/'>首页</Link></li>
                            <li><a href="https://cnodejs.org/api">API</a></li>
                        </ul>
                    </div>
                </Had>
            </div>
        );
    }
}

export default Header;
const Had = styled.header`
  width: 100%;
  background-color: #444;
  .logo{
    width: 120px;
  }
  .wrap{
    width: 1400px;
    margin: 0 auto;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .nav{
    display: flex;
    margin: 0;
    li{
      padding: 10px 15px;
      color: #ccc;
      font-size: 13px;
      cursor: pointer;
      a{
        color: #ccc;
        text-decoration: none;
        :hover{
        color: #fff;
      }
      }
      :hover{
        color: #fff;
      }
    }
  }
`