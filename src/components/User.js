import React, {Component} from 'react';
import styled from 'styled-components'
import {Link} from "react-router-dom"
import connect from "react-redux/es/connect/connect"
import {getUserInfo} from "../actions"
import Axios from "axios"

class User extends Component {
    state = {
        state: null,
        collections: []
    }

    componentDidMount() {
        const name = this.props.match.params.loginname
        this.props.getUserInfo(name)
        Axios.get(`https://cnodejs.org/api/v1/topic_collect/${name}`).then(res => {
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
        const name = this.props.match.params.loginname
        const {state} = this.state
        const topics = state ? state.recent_topics.map(i => (
            <li key={i.id}><Link to={`/user/${i.author.loginname}`}><img title={i.author.loginname}
                                                                         src={i.author.avatar_url} alt=""/></Link><Link
                to={`/post/${i.id}`} style={{marginLeft: '10px', fontSize: '16px', color: '#08c'}}
                title={i.title}>{i.title}</Link></li>
        )) : ''
        const replies = state ? state.recent_replies.map(i => (
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
                        <div className="top">
                            <Link to="/">主页</Link> <span>/</span>
                        </div>
                        <div className="content">
                            <div><img src={state ? state.avatar_url : ''} alt=""/><span
                                className="loginname">{state ? state.loginname : ''}</span></div>
                            {Number(this.state.collections.length) > 0 ?
                                <Link to={`/collections/${name}`}>{this.state.collections.length}个收藏话题</Link> : ''}
                            <p>{state ? state.score : ''} 积分</p>
                        </div>
                        <div className="topic">
                            <div className="topic-title">
                                最近创建的话题
                            </div>
                            <ul className="topic-ul">
                                {topics}
                            </ul>
                        </div>
                        <div className="topic">
                            <div className="topic-title">
                                最近参与的话题
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
export default connect(mapStateToProps, {getUserInfo})(User);
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
    margin-top: 15px;
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