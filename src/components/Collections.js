import React, {Component} from 'react';
import styled from 'styled-components'
import {Link} from "react-router-dom"
import connect from "react-redux/es/connect/connect"
import {getUserInfo} from "../actions"
import Axios from "axios"

class Collections extends Component {
    state = {
        state: null,
        collections: []
    }

    componentDidMount() {
        const username = this.props.match.params.username
        this.props.getUserInfo(username)
        Axios.get(`https://cnodejs.org/api/v1/topic_collect/${username}`).then(res => {
            this.setState({
                collections: res.data.data
            })
        })
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.state)
        this.setState({
            state: nextProps.state
        })
    }

    changeState = loginname => {
        Axios.get(`https://cnodejs.org/api/v1/user/${loginname}`).then(res => {
            console.log(res.data.data)
            this.setState({
                state: res.data.data
            })
        })
    }

    render() {
        const name = this.props.match.params.username
        const {state, collections} = this.state
        console.log(collections, state)
        const replies = collections ? collections.map(i => (
            <li key={i.id}><Link to={`/user/${i.author.loginname}`}><img
                onClick={() => this.changeState(i.author.loginname)} title={i.author.loginname}
                src={i.author.avatar_url} alt=""/></Link><Link to={`/post/${i.id}`} style={{
                marginLeft: '10px',
                fontSize: '16px',
                color: '#08c'
            }} title={i.title}>{i.title}</Link></li>
        )) : ''
        return (
            <Wrap>
                <div className="user-main">
                    <div className="user-main-left">
                        <div className="topic">
                            <div className="topic-title">
                                <Link to="/" style={{color: '#80bd01'}}>主页</Link> <span>/ {name} 收藏的话题</span>
                            </div>
                            <ul className="topic-ul">
                                {replies}
                            </ul>
                        </div>
                    </div>
                    <div className="user-main-right">
                        <div className="top">
                            个人信息
                        </div>
                        <div className="down">
                            <div><img src={state ? state.avatar_url : ''} alt=""/><span
                                className="loginname">{state ? state.loginname : ''}</span></div>
                            <p>{state ? state.score : ''} 积分</p>
                        </div>
                    </div>
                </div>
            </Wrap>
        );
    }
}

const mapStateToProps = state => ({
    state
})
export default connect(mapStateToProps, {getUserInfo})(Collections);
const Wrap = styled.div`
  background-color: #e1e1e1;
  .user-main{
    width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
  }
  .user-main-left{
    width: 1095px;
    .topic{
      margin-top: 15px;
      img{
        width: 30px;
        height: 30px;
        border-radius: 3px;
      }
      .topic-ul>li{
        padding: 10px;
        background: #fff;
        border-top: 1px solid #f0f0f0;
      }
      .topic-title{
        padding: 10px;
        background-color: #f6f6f6;
        border-radius: 3px 3px 0 0;
        font-size: 14px;
      }
    }
    .top{
        padding: 10px;
        background-color: #f6f6f6;
        border-radius: 3px 3px 0 0;
        a,span{
          color: #80bd01;
        }
    }
    .content{
       padding: 10px;
       border-top: 1px solid #e5e5e5;
       border-radius: 0 0 3px 3px;
       background-color: #fff;
       img{
        width: 40px;
        height: 40px;
        border-radius: 3px;
       }
       .loginname{
         color: #778087;
         font-size: 14px;
         margin-left: 10px;
       }
       a{
        color: #778087;
        margin-top: 5px;
        display: block;
       }
       p{
        margin:5px 0;
       }
    }
  }
  .user-main-right{
    width: 290px;
    margin-top: 15px;
    .top{
      color: #51585c;
      border-radius: 3px 3px 0 0;
      padding: 10px;
      background-color: #f6f6f6;
    }
    .down{
      background-color: #fff;
      padding: 10px;
      img{
        width: 48px;
        height: 48px;
        border-radius: 3px;
      }
      p{
        margin: 10px 0;
      }
      span{
        color: #778087;
        font-size: 16px;
        margin-left: 10px;
      }
    }
  }
`