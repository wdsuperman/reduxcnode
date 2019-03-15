import React, {Component} from 'react';
import {Link} from "react-router-dom"
import styled from 'styled-components'
import {connect} from 'react-redux'
import {getState, changeGetState, changePage} from "../actions"
import {Button, Pagination} from 'antd';
import Axios from "axios"

class Section extends Component {
    state = {
        type: [
            {
                title: '全部',
                type: 'all'
            },
            {
                title: '精华',
                type: 'good'
            },
            {
                title: '分享',
                type: 'share'
            },
            {
                title: '问答',
                type: 'ask'
            },
            {
                title: '招聘',
                type: 'job'
            },
            {
                title: '客户端测试',
                type: 'dev'
            }
        ],
        titleType: 'all',
        value: '',
        login: false,
        userInfor: null,
        state: [],
        page: 800,
        changePage: 1
    }

    componentDidMount() {
        const {getState} = this.props
        getState()
        this.setState({
            userInfor: sessionStorage.getItem("userinfo")
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            state: nextProps.state
        })
    }

    changeType = type => {
        const {changeGetState} = this.props
        this.setState({
            titleType: type,
            changePage: 1
        })
        changeGetState(type)
        switch (type) {
            case 'all':
                return this.setState({
                    page: 800
                })
            case 'good':
                return this.setState({
                    page: 170
                })
            case 'share':
                return this.setState({
                    page: 340
                })
            case 'ask':
                return this.setState({
                    page: 460
                })
            case 'job':
                return this.setState({
                    page: 120
                })
            case 'dev':
                return this.setState({
                    page: 650
                })
            default :
                return this.setState({
                    page: 800
                })
        }
    }
    changePage = (page) => {
        const {titleType} = this.state
        this.props.changePage(titleType, page)
        this.setState({
            changePage: page
        })
    }
    submit = () => {
        const {value} = this.state
        Axios.post('https://cnodejs.org/api/v1/accesstoken', {accesstoken: value}).then(res => {
            sessionStorage.setItem("token", value)
            sessionStorage.setItem("loginname", res.data.loginname)
            sessionStorage.setItem("id", res.data.id)
            this.setState({
                login: true
            })
            Axios.get(`https://cnodejs.org/api/v1/user/${sessionStorage.getItem("loginname")}`).then(res => {
                sessionStorage.setItem("name", res.data.data.loginname)
                sessionStorage.setItem("url", res.data.data.avatar_url)
                sessionStorage.setItem("score", res.data.data.score)
                this.setState({
                    userInfor: res.data.data
                })
            })
        }).catch(() => {
            alert('accessToken验证不正确')
        })
    }
    change = e => {
        this.setState({
            value: e.target.value
        })
    }
    Out = () => {
        sessionStorage.clear()
        this.setState({
            login: false
        })
    }

    render() {
        const token = sessionStorage.getItem("token")
        const name = sessionStorage.getItem("name")
        const url = sessionStorage.getItem("url")
        const score = sessionStorage.getItem("score")
        const {state} = this.state
        const type = this.state.titleType
        const list = state.length ? state.map(i => (
            <li key={i.id}><Link to={`/user/${i.author.loginname}`}><img title={i.author.loginname}
                                                                         src={i.author.avatar_url} alt=""/></Link><span
                className="liulan"><span title="回复数" className="count_of_replies">{i.reply_count}/</span><span
                title="点击数"
                className="count_of_visits">{i.visit_count}</span></span>{this.state.titleType === 'all' || this.state.titleType === 'good' || this.state.titleType === 'share' ?
                <span>{i.top ? <span className="type">置顶</span> : i.good ?
                    <span className="type">精华</span> : i.tab === 'share' ?
                        <span className="no-type">分享</span> : i.tab === 'ask' ?
                            <span className="no-type">问答</span> : i.tab === 'job' ?
                                <span className="no-type">招聘</span> : ''}</span> : ''}<Link to={`post/${i.id}`}
                                                                                            title={i.title}
                                                                                            className="topic-title">{i.title}</Link>
            </li>
        )) : '请稍等'
        const title = this.state.type.map(i => (
            <li onClick={() => {
                this.changeType(i.type)
            }} style={{backgroundColor: type === i.type ? '#80bd01' : '', color: type === i.type ? '#fff' : ''}}
                key={i.type}>{i.title}</li>
        ))
        return (
            <Sec>
                <div className="wrap">
                    <div className="left">
                        <div className="left-top">
                            <ul className="left-top-list">
                                {title}
                            </ul>
                        </div>
                        <div className="topic">
                            <ul>
                                {list}
                            </ul>
                        </div>
                    </div>
                    <div className="right">
                        <div className="right-top">{token ? '个人信息' : '登录'}</div>
                        <div className="right-down">
                            {token ? <div>
                                    <div><Link to={`/user/${name}`}><img className="user" src={url} alt=""/></Link> {name}
                                    </div>
                                    <p className="jf">积分 : {score}</p><Button onClick={this.Out} type="primary"
                                                                              id="out">退出</Button><Button id="create"><Link
                                    to="/create">发布话题</Link></Button></div> :
                                <div><input className="login" onChange={this.change} value={this.state.value}
                                            placeholder="accessToken" type="text"/>
                                    <Button onClick={this.submit} type="primary">登录</Button></div>}
                        </div>
                    </div>

                </div>
                <Pagination onChange={this.changePage} style={{margin: '0 auto', width: '1400px'}}
                            current={this.state.changePage} total={this.state.page}/>,
            </Sec>
        );
    }
}

const mapStateToProps = state => ({
    state
})
export default connect(mapStateToProps, {getState, changeGetState, changePage})(Section);
const Sec = styled.section`
  background-color: #e1e1e1;
  #create{
    margin-left: 20px;
    background-color: #80bd01;
    color: #fff;
    :hover{
      background-color: #6ba44e;
    }
  }
  .wrap{
    width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
  }
  .left{
    width: 1095px;
  }
  .left-top{
    margin-top: 15px;
  }
  .jf{
    margin: 5px 0;
  }
  #out{
    margin: 0;
  }
  .user{
    width: 48px;
    height: 48px;
    border-radius: 3px;
  }
  
  .left-top-list{
    display: flex;
    padding: 7px;
    background-color: #f6f6f6;
    border-radius: 3px 3px 0 0;
    margin: 0;
    li{
      font-size: 14px;
      margin: 0 10px;
      color: #80bd01;
      cursor: pointer;
      display: flex;
      align-items:center;
      padding: 2px 4px;
       border-radius: 3px;
      :hover{
        color: #005580;
      }
    }
  }
  .login{
    width: 80%;
    margin: 0 auto;
    outline: 0;
    border-radius: 3px;
    border: 2px solid #40a9ff;
    text-indent: 6px;
  }
  .topic{
    background-color: #fff;
    li{
      padding: 10px 0 10px 10px;
      font-size: 14px;
      border-top: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      :hover{
        background-color: #f5f5f5;
      }
      img{
        width: 30px;
        height: 30px;
        border-radius: 3px;
      }
    }
    .topic-title{
       max-width: 70%;
       white-space: nowrap;
       display: inline-block;
       vertical-align: middle;
       font-size: 16px;
       line-height: 30px;
       color: #333;
       text-decoration: none;
       :hover{
        text-decoration: underline;
       }
    }
  }
  .liulan{
    width: 70px;
    display: inline-block;
    text-align: center;
  }
  .count_of_replies {
    color: #9e78c0;
    font-size: 14px;
    height: 100%;
  }
  .count_of_visits {
    font-size: 10px;
    color: #b4b4b4;
    height: 100%;
  }
  .type{
    background: #80bd01;
    padding: 2px 4px;
    border-radius: 3px;
    color: #fff;
    font-size: 12px;
    margin-right: 10px;
  }
  .no-type{
    background-color: #e5e5e5;
    color: #999;
    padding: 2px 4px;
    border-radius: 3px;
    font-size: 12px;
    margin-right: 10px;
  }
  .right{
    border-radius: 3px;
    width: 290px;
    margin-top: 15px;
    height: 130px;
    .right-top{
        color: #51585c;
        padding: 10px;
        font-size: 14px;
        background-color: #f6f6f6;
    }
    .right-down{
      padding: 10px;
      background-color: #fff;
      button{
        margin-top: 10px;
      }
    }
  }
`