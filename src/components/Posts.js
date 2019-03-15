import React, {Component} from 'react';
import {getTopic} from '../actions'
import {connect} from 'react-redux'
import styled from 'styled-components'
import Axios from "axios"
import {Link} from "react-router-dom"
import Button from 'antd/lib/button';

class Posts extends Component {
    state = {
        collect: false,
        addcomment: '',
        replies: []
    }

    componentDidMount() {
        const {id} = this.props.match.params
        const {getTopic} = this.props
        getTopic(id)
        const login = sessionStorage.getItem('token')
        if (login) {
            Axios.get(`https://cnodejs.org/api/v1/topic/${id}?accesstoken=${login}`).then(res => {
                console.log(res.data.data.replies)
                this.setState({
                    collect: res.data.data.is_collect,
                    replies: res.data.data.replies
                })
            })
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            replies:nextProps.state.replies
        })
    }
    like = (id,ind) => {
        const token = sessionStorage.getItem('token')
        Axios.post(`https://cnodejs.org/api/v1/reply/${id}/ups`, {accesstoken: token}).then(()=>{
            this.setState({
                replies:this.state.replies.map( (i,index) => {
                    if (index === ind){
                        i.is_uped = !i.is_uped
                    }
                    return i
                })
            })
        }).catch( () => (alert('请登录')))
        // console.log([...this.state.replies[ind].ups,id])
    }
    addComment = e => {
        this.setState({
            addcomment: e.target.value
        })
    }
    submitComment = id => {
        const {addcomment} = this.state
        const login = sessionStorage.getItem('token')
        const name = sessionStorage.getItem('name')
        const img = sessionStorage.getItem('url')
        const uid = sessionStorage.getItem('id')
        const newComment = {
            id: uid,
            author: {loginname: name, avatar_url: img},
            content: addcomment,
            ups: []
        }
        Axios.post(`https://cnodejs.org/api/v1/topic/${id}/replies`, {
            accesstoken: login,
            content: addcomment
        }).then(() => {
            this.setState({
                replies: [...this.state.replies, newComment],
                addcomment: ''
            })
        })
    }
    collect = () => {
        const {id} = this.props.match.params
        const login = sessionStorage.getItem('token')
        const {collect} = this.state
        if (collect) {
            Axios.post('https://cnodejs.org/api/v1/topic_collect/de_collect', {
                accesstoken: login,
                topic_id: id
            }).then(res => {
                console.log(res.data)
                this.setState({
                    collect: !collect
                })
            })
        } else {
            Axios.post('https://cnodejs.org/api/v1/topic_collect/collect', {
                accesstoken: login,
                topic_id: id
            }).then(res => {
                console.log(res.data)
                this.setState({
                    collect: !collect
                })
            })
        }
    }

    render() {
        const {state} = this.props
        const topicName = state.author ? state.author.loginname : ''
        const topicId = this.props.match.params.id
        const {replies} = this.state
        const login = sessionStorage.getItem('token')
        const name = sessionStorage.getItem('name')
        const commentsList = replies ? replies.map((i, ind) => (
            <li key={i.id} className="commentslist">
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                        <Link to={`/user/${i.author.loginname}`}><img
                            style={{width: '30px', height: '30px', borderRadius: '3px'}} src={i.author.avatar_url}
                            alt=""/></Link>
                        <span style={{color: '#666', fontWeight: '700'}}> {i.author.loginname} </span>
                        <span> {ind + 1}楼</span>
                    </div>
                    <span style={{display: 'flex'}}><svg onClick={() => {
                        this.like(i.id, ind)
                    }} style={{cursor: 'pointer'}} className="icon" width="24px" height="24.00px"
                                                         viewBox="0 0 1024 1024" version="1.1"
                                                         xmlns="http://www.w3.org/2000/svg"><path
                        fill={i.is_uped ? 'red' : '#8a8a8a'}
                        d="M842.1376 443.2896c-17.2032-15.872-39.8336-15.872-45.6704-15.5648H652.5952c23.3472-98.816 19.6608-171.6224-10.9568-216.6784-23.8592-35.1232-55.1936-39.5264-58.6752-39.936-0.7168-0.1024-1.536-0.1024-2.2528-0.1024-23.3472 0-40.448 7.4752-50.5856 22.2208-8.3968 12.1856-9.3184 25.3952-9.8304 33.3824 0 0.7168-0.1024 1.536-0.1024 2.1504-0.7168 2.048-1.024 4.1984-1.024 6.3488 0 107.52-117.3504 195.6864-118.5792 196.608-5.2224 3.8912-8.2944 9.9328-8.2944 16.4864v338.8416c0 22.2208 12.8 41.1648 35.9424 53.3504 17.6128 9.3184 36.864 12.5952 48.0256 12.5952h256.512c18.6368 0 34.816-14.0288 49.2544-42.9056 8.6016-17.1008 13.824-33.9968 14.1312-34.7136 0-0.1024 0.1024-0.2048 0.1024-0.3072 63.5904-216.064 64.3072-283.0336 64.3072-285.696-0.2048-24.2688-10.1376-38.4-18.432-46.08z m-85.2992 320c-0.4096 1.3312-4.096 12.5952-9.728 24.6784-8.2944 17.6128-14.1312 22.8352-15.872 24.064H476.16c-11.0592 0-43.008-8.6016-43.008-24.9856V458.1376c11.9808-9.8304 35.328-30.3104 58.7776-58.5728 19.5584-23.6544 35.1232-47.8208 46.3872-72.0896 13.9264-29.9008 21.1968-59.904 21.7088-89.088 0.7168-3.072 0.9216-6.144 1.1264-9.1136 0.3072-4.4032 0.6144-9.9328 2.6624-12.6976 1.8432-2.7648 7.4752-4.4032 15.36-4.608 3.1744 0.8192 17.1008 5.0176 28.672 22.1184 10.752 15.7696 16.9984 37.888 18.5344 65.9456 2.1504 38.1952-4.5056 86.3232-19.8656 142.848-1.6384 6.144-0.4096 12.6976 3.4816 17.8176s9.9328 7.9872 16.2816 7.9872h170.2912c0.7168 0 1.4336 0 2.1504-0.1024 0.1024 0 10.24-0.3072 15.7696 4.8128 3.2768 2.9696 4.9152 8.2944 4.9152 15.6672-0.1024 1.9456-2.048 68.3008-62.5664 274.2272zM307.9168 427.8272h-102.2976c-26.8288 0-41.5744 21.0944-41.8816 40.8576v1.536l21.0944 341.0944c0.4096 26.9312 21.9136 41.472 42.2912 41.472h88.4736c14.848 0 23.8592-5.9392 28.7744-10.9568 7.3728-7.4752 10.0352-17.3056 9.9328-23.9616V474.2144c0-16.7936-7.0656-27.2384-12.9024-33.0752-12.8-12.4928-29.3888-13.312-33.4848-13.312z m-0.1024 40.96h0zM227.0208 812.032H227.328h-0.3072z m86.3232 0h-85.8112c-0.512 0-1.1264-0.2048-1.6384-0.4096v-0.9216-1.2288l-20.992-340.0704c0-0.2048 0.1024-0.4096 0.1024-0.6144H308.0192c5.4272 0.3072 5.4272 2.56 5.4272 5.4272V812.032z"/></svg><span>{i.is_uped ? i.ups.length +1 :i.ups.length}</span></span>
                </div>
                <div style={{fontSize: '15px'}} dangerouslySetInnerHTML={{__html: i.content}}/>
            </li>
        )) : '暂无评论'
        return (
            <Wrap>
                <div className="topic">
                    <div className="left">
                        <div className="left-top">
                            <div className="top-type">{state.good ? <span className="type">精华</span> : state.top ?
                                <span className="type">置顶</span> : ''}<h1>{state.title}</h1></div>
                            <div className="changes">
                                <span> ● 作者 {state.author ? state.author.loginname : ''}</span><span> ● {state.visit_count} 次浏览</span><span> ● 来自 {state.tab === 'share' ? '分享' : state.tab === 'ask' ? '问答' : state.tab === 'job' ? '招聘' : state.tab === 'dev' ? '客户端测试' : ''}</span>
                            </div>
                            {sessionStorage.getItem('token') ? <div className="bj">
                                <div onClick={this.collect}
                                     className="success">{this.state.collect ? '取消收藏' : '收藏'}</div>
                                {topicName === name ? <div><Link to={`/edit/${topicId}`}>编辑</Link></div> : ''}
                            </div> : ''}
                        </div>
                        <div className="left-down">
                            <div dangerouslySetInnerHTML={{__html: state.content}}/>
                        </div>
                        <div className="comments">
                            <div className="comments-top">{replies ? replies.length : '0'} 回复</div>
                            <div className="comments-down">
                                <ul>
                                    {commentsList}
                                </ul>
                            </div>
                        </div>
                        {login ? <div className="comments">
                            <div className="comments-top addComment">添加回复</div>
                            <textarea onChange={this.addComment} value={this.state.addcomment} className="add-input"/>
                            <Button onClick={() => {
                                this.submitComment(topicId)
                            }} type="primary">提交</Button>
                        </div> : ''}
                    </div>
                    <div className="right">
                        <div className="right-top">
                            作者
                        </div>
                        <div className="right-down">
                            <div>
                                <div>
                                    <Link to={`/user/${state.author ? state.author.loginname : ''}`}><img
                                        src={state.author ? state.author.avatar_url : ''} alt=""/></Link>
                                    <span>{state.author ? state.author.loginname : ''}</span>
                                </div>
                            </div>
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
export default connect(mapStateToProps, {getTopic})(Posts);
const Wrap = styled.div`
  width: 100%;
  background-color: #e1e1e1;
  .bj{
    margin-top: -30px;
  }
  .comments{
    width: 1095px;
    margin-top: 15px;
    .add-input{
      height: 100px;
      border: none;
      outline: 0;
      width: 100%;
      resize:none;
      text-indent: 10px;
    }
    .comments-top{
        padding: 10px;
        background-color: #f6f6f6;
        border-radius: 3px 3px 0 0;
    }
    .commentslist{
        padding: 10px;
        background: #fff;
        border-top: 1px solid #f0f0f0;
    }
  }
  .success{
    border-radius: 3px;
    background-color: #80bd01;
    display: inline-block;
    padding: 8px 10px;
    font-size: 14px;
    letter-spacing: 2px;
    color: #fff;
    cursor: pointer;
    margin-left:980px;
  }
  .topic{
    width: 1400px;
    margin: 0 auto;
    display: flex;
    padding-top: 15px;
    justify-content: space-between;
  }
  .left{
    width: 1095px;
    border-radius: 3px 3px 0 0;
  }
  .left-top{
    padding: 10px;
    border-bottom: 1px solid #e5e5e5;
    background-color: #fff;
  }
  h1{
    font-size: 22px;
    font-weight: 700;
    margin: 8px 0 8px 10px;
    display: inline-block;
    vertical-align: bottom;
    width: 75%;
    line-height: 130%;
  }
  .type{
    background: #80bd01;
    padding: 2px 4px;
    border-radius: 3px;
    color: #fff;
    font-size: 12px;
  }
  .top-type{
   align-items: center;
   display: flex;
   padding: 3px 0;
  }
  .changes{
    font-size: 12px;
    color: #838383;
  }
  .left-down{
    padding: 10px 20px;
    font-size: 14px;
    color: #333;
    line-height: 2em;
    background-color: #fff;
    p{
      font-size: 15px;
      line-height: 1.7em;
      overflow: auto;
    }
    a{
        color: #08c;
    }
  }
  .right{
    width: 290px;
  }
  .right-top{
    color: #51585c;
    padding: 10px;
    border-radius: 3px 3px 0 0;
    font-size: 13px;
    background-color: #f6f6f6;
  }
  .right-down{
    background-color: #fff;
    padding: 10px;
    border-radius: 0 0 3px 3px;
    div{
      align-items: center;
      color: #778087;
      p{
        margin: 0;
        margin-top: 10px;
      }
    }
    span{
      margin-left: 10px;
    }
    img{
      width: 48px;
      height: 48px;
      border-radius: 3px;
    }
    
  }
`