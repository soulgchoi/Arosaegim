import React, { Component } from "react";
import styled from "styled-components";
import { Select, Tabs, Tab, MenuItem } from "@material-ui/core"
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import MessageOutlinedIcon from "@material-ui/icons/MessageOutlined";
import TabPanel from "./TabPanel";
import MyPageMenu from "./MyPageMenu";
import { getCommentedSaegim, getLikedSaegim, getCreatedSaegim } from "../../apis/UserAPI"
import { getSaegimById } from "../../apis/SaegimAPI";
import { getUserByEmail } from "../../apis/AccountAPI";
import { Storage } from "../../storage/Storage";
import Loading from "../common/background/Loading";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {main: '#B98B82'},
    secondary: {main: '#ffffff00'}
  },
});

class MyPage extends Component {
  listItem;
  constructor(props) {
    super(props);
    this.state = {
      userId: 1,
      currentTab: 0,
      mySaegim: 'old',
      like: 'old',
      commented: 'old',
      options: [
        { value: 'old', text: '등록순'},
        { value: 'new', text: '최신순'},
      ],
      createdData: [],
      likedData: [],
      commentedData: [],
      temp: [],
      userInfo: {},
      isLoading: true
    }
  };

  selectChange = (e) => {
    const _name = e.target.name;
    this.setState({
      [_name]: e.target.value
    })

    if (e.target.value !== this.state[_name].value) {
      if (_name === 'mySaegim') {
        this.setState({
          createdData: this.state.createdData.reverse()
        })
      } else if (_name === 'like') {
        this.setState({
          likedData: this.state.likedData.reverse()
        })
      } else if (_name === 'commented') {
        this.setState({
          commentedData: this.state.commentedData.reverse()
        })
      }
    }
  };

  tabChange = async (e, val) => {
    await this.setState({
      currentTab: val
    })
  };

  getSaegim = async () => {
    const _userId = this.state.userId
    const _data = await getCreatedSaegim(_userId)
    this.setState({
      createdData: _data
    })
  }

  getLike = async () => {
    const _userId = this.state.userId
    const _data = await getLikedSaegim(_userId)
    console.log(_data)
    const _temp = []
    _data.map( async (d) => {
      const _res = await getSaegimById(d.saegimId)
      _temp.push(_res)
    })
    this.setState({
      likedData: _temp
    })
  }

  getComment = async () => {
    const _userId = this.context.userInfo.id
    const _data = await getCommentedSaegim(_userId)
    this.setState({
      commentedData: _data
    })
  }

  getData = async () => {
    await this.getSaegim()
    await this.getLike()
    await this.getComment()
  }

  getUserId = async () => {
   const _email = localStorage.getItem('ARSG email')
    this.setState({
      userId: (await getUserByEmail(_email)).data.id
    })
  }

  async componentDidMount() {
    await this.getUserId()
    await this.getData()

    this.setState({
      isLoading: false
    })
  }

  render() {
    if (this.state.isLoading === true) {
      return <Loading/>
    } else {
      const PrintOptions = this.state.options.map((option) => {
          return (
            <MenuItem value={option.value} key={option.text}>{option.text}</MenuItem>
          )
        }
      );
      return (
        <MuiThemeProvider theme={theme}>
        <div>
          <Wrapper>
            <UserInfo>
              <User>
                <UserName>
                  {this.context.userInfo.name}
                </UserName>
                <UserEmail>
                  {this.context.userInfo.email}
                </UserEmail>
              </User>
              <UserSaegim>
                <Tabs
                  value={this.state.currentTab}
                  textColor="primary"
                  indicatorColor="secondary"
                  onChange={this.tabChange}
                >
                  <Tab icon={<CreateOutlinedIcon/>} value={0}/>
                  <Tab icon={<FavoriteBorderOutlinedIcon/>} value={1}/>
                  <Tab icon={<MessageOutlinedIcon/>} value={2}/>
                </Tabs>
              </UserSaegim>
            </UserInfo>
            <SaegimInfo value={this.state.currentTab}>
              <ListInfo>
                <ListTitle>{MyPageMenu[this.state.currentTab].title}</ListTitle>
                <StSelect
                  autowidth
                  value={this.state[MyPageMenu[this.state.currentTab].value]}
                  onChange={this.selectChange}
                  inputProps={{
                    name: MyPageMenu[this.state.currentTab].value,
                    id: MyPageMenu[this.state.currentTab].value,
                  }}
                >
                  {PrintOptions}
                </StSelect>
              </ListInfo>
              <SaegimShortList
                ref={div => (this.listItem = div)}
              >
                <TabPanel
                  isLoading={this.state.isLoading}
                  value={this.state.currentTab}
                  index={0}
                  data={this.state.createdData}
                />
                <TabPanel
                  isLoading={this.state.isLoading}
                  value={this.state.currentTab}
                  index={1}
                  data={this.state.likedData}
                />
                <TabPanel
                  isLoading={this.state.isLoading}
                  value={this.state.currentTab}
                  index={2}
                  data={this.state.commentedData}
                />
              </SaegimShortList>
            </SaegimInfo>
          </Wrapper>
        </div>
        </MuiThemeProvider>
      );
    }
  }
}

export default MyPage;
MyPage.contextType = Storage;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: auto;
  height: 100vh;
`;

const UserInfo = styled.div`
  position: relative;
  top: 8%;
  padding: 16px;
  background-color: #f1f1f1;
  width: 80%;
  height: 10%;
  margin-bottom: 24px;
  border-radius: 0.4em;
`;

const UserEmail = styled.span`
`;

const UserName = styled.span`
`;

const SaegimCount = styled.div`
  font-size: 0.8rem;
`;

const UserSaegim = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 8px;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const SaegimInfo = styled.div`
  height: 60%;
  width: 80%;
  top: 8%;
  
  margin-top: 8px;
  padding: 16px;
  
  background: linear-gradient(to right bottom, #FBF2EE 10%, #f4c6ba 150%); 

  border-radius: .4em;

  display: flex;
  flex-direction: column;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    left: ${props => ([20, 43, 65][props.value])}%;
    border: 24px solid transparent;
    border-bottom-color: #FBF2EE;
    border-top: 0;
    margin-top: -32px;
    transition: all ease .7s;
  }
`;

const StSelect = styled(Select)`
  font-size: 0.9rem;
`;

const SaegimShortList = styled.div`
  overflow: auto;
`;


const ListInfo = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: center;
  align-items: center;
  padding: 8px;
`;

const ListTitle = styled.div``;

