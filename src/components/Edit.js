import React, {Component} from 'react';
import styled from 'styled-components'
import {Link} from "react-router-dom"
import {getTopic} from '../actions'
import {connect} from 'react-redux'
import { Button } from 'antd';
import Axios from "axios"

class Edit extends Component {
    state = {
        val: 'dev',
        title: '测试',
        content: ''
    }

    componentDidMount() {
        const {topicid} = this.props.match.params
        const {getTopic} = this.props
        getTopic(topicid)
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.state.content)
        this.setState({
            title: nextProps.state.title
        })
    }

    title = e => {
        this.setState({
            title: e.target.value.trim()
        })
    }
    content = e => {
        this.setState({
            content: e.target.value
        })
    }
    submit = () => {
        const login = sessionStorage.getItem('token')
        const {topicid} = this.props.match.params
        const {title, content} = this.state
        if (title.length > 10) {
            Axios.post('https://cnodejs.org/api/v1/topics/update', {
                accesstoken: login,
                title,
                tab: 'dev',
                content,
                topic_id: topicid
            }).then(res => {
                console.log(res.data)
                alert('提交成功')
                this.setState({
                    title: '',
                    content: ''
                })
            })
        } else {
            alert('标题字数 10 字以上')
        }
    }

    render() {
        return (
            <Wrap>
                <div className="create">
                    <div className="create-top">
                        <Link to="/">主页</Link> <span> / 编辑话题</span>
                    </div>
                    <div className="create-body">
                        <i>板块选择 ：</i>
                        <select>
                            <option disabled>分享</option>
                            <option disabled>招聘</option>
                            <option disabled>问答</option>
                            <option value={this.state.val}>客户端测试</option>
                        </select>
                        <em> *为了不影响其他人使用,这里只能选择 客户端测试</em>
                        <div>
                            <input value={this.state.title} onChange={this.title} className="title" type="text"
                                   placeholder="标题字数 10 字以上"/>
                            <textarea onChange={this.content} value={this.state.content} className="add-input"/>
                        </div>
                        <Button type="primary" onClick={this.submit}>提交</Button>
                    </div>
                </div>
            </Wrap>
        );
    }
}

const mapStateToProps = state => ({
    state
})
export default connect(mapStateToProps, {getTopic})(Edit);
const Wrap = styled.div`
  background-color:#e1e1e1;
  padding-top: 15px;
  input{
    box-shadow: 0 0 2px rgba(60,60,60,.5);
    border: 0;
    outline: 0;
  }
  .create{
    width: 1400px;
    margin: 0 auto;
    .create-top{
        padding: 10px;
        background-color: #f6f6f6;
        border-radius: 3px 3px 0 0;
        a{
          color: #80bd01;
          :hover{
            text-decoration: underline;
          }
        }
        span{
          color: #999;
        }
    }
    .create-body{
    border-top: 1px solid #e5e5e5;
      background-color: #fff;
      padding: 10px;
    }
    i{
      font-style: normal;
    }
    .title{
      margin-top: 15px;
      width: 100%;
      line-height: 30px;
      text-indent: 10px;
    }
    .add-input{
      height: 100px;
      border: none;
      width: 100%;
      box-shadow: 0 0 2px rgba(60,60,60,.5);
      resize:none;
      text-indent: 10px;
      outline: 0;
    }
  }
`