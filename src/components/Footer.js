import React, {Component} from 'react';
import styled from 'styled-components'
class Footer extends Component {
    render() {
        return (
            <Wrap>
                <div className="content">
                    <h2>参照Cnode API接口写出功能</h2>
                    <p>使用的插件有 antd axios redux redux-thunk react-redux react-router-dom</p>
                    <h3>登录方法:</h3>
                    <p>由于登录需要accesstoken码 需<a target='_blank' href="https://cnodejs.org/signin">登录</a>获取 登录之后点击右上角设置 滑到最下面找到 字符串:xxxxxxxx 复制字符串后面的数字 粘贴到本网站登录的输入框内即可登录</p>
                </div>
            </Wrap>
        );
    }
}

export default Footer;
const Wrap = styled.div`
  width: 100%;
  .content{
    width: 1400px;
    margin: 0 auto;
  }
`