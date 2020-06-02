import React, { Component } from "react";
import styled from "styled-components";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import { IconButton } from "@material-ui/core";
import TextInput from "../common/inputs/TextInput";
import Chip from "../common/chip/Chip";
import CreateIcon from "@material-ui/icons/Create";
import CtoW from "../../apis/w3w";
import Switch from "../common/switch/Switch";
import axios from "axios";
import PhotoIcon from "@material-ui/icons/AddPhotoAlternate";
import { getUserByEmail } from "../../apis/AccountAPI";
import { Storage } from "../../storage/Storage";
import Popover from "@material-ui/core/Popover";

class WriteSaegim extends Component {
  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      location: null,
      w3w: null,
      text: null,
      locked: 0,
      tags: [],
      error: 0,
      userInfo: {},
      imgBase64: [],
      open: false,
    };
    this.inputReference = React.createRef();
  }

  fileUploadAction = () => this.inputReference.current.click();
  fileUploadInputChange = async (e) => {
    e.preventDefault();
    for (let i = 0; i < e.target.files.length; i++) {
      let _reader = new FileReader();
      let _imgFile = e.target.files[i];
      _reader.readAsDataURL(_imgFile);
      _reader.onloadend = () => {
        this.setState({
          imgBase64: this.state.imgBase64.concat(_reader.result),
        });
      };
    }
  };

  handleChange = (data) => {
    this.props.changeWrite(data);
  };

  getWWW = async (lat, lng) => {
    var www = await CtoW(lat, lng);
    this.setState({
      w3w: www.data.words,
    });
  };
  getLocation = () => {
    //지도 컴포넌트 열어서 위치 정확하게 수정하기
  };
  componentDidMount() {
    if (navigator.geolocation) {
      // GPS를 지원
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const _lat = position.coords.latitude;
          const _lng = position.coords.longitude;

          this.setState({
            location: [_lat, _lng],
          });

          this.getWWW(_lat, _lng);
          this.getUserInfo();
        },
        function(error) {
          console.error(error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: Infinity,
        }
      );
    } else {
      alert("GPS를 지원하지 않습니다");
    }
  }

  writePost = () => {
    const data = {
      contents: this.state.text,
      imageSources: this.state.imgBase64,
      latitude: this.state.location[0],
      longitude: this.state.location[1],
      secret: this.state.locked,
      tags: this.state.tags,
      userId: this.state.userInfo.id,
      userName: this.state.userInfo.name,
      w3w: this.state.w3w,
    };
    console.log(data);
    if (this.state.text) {
      axios
        .post("https://k02a2051.p.ssafy.io/api/saegims/", data)
        .then((res) => {
          this.handleChange(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.setState({ error: 1 });
    }
  };
  handleTextChange = (value) => {
    this.setState({ text: value });
    this.setState({ error: 0 });
  };
  changeSwitch = () => {
    if (this.state.locked) {
      this.setState({ locked: 0 });
    } else {
      this.setState({ locked: 1 });
    }
  };
  getUserInfo = async () => {
    // const _email = localStorage.getItem('ARSG email')
    // this.setState({
    //     userInfo: (await getUserByEmail(_email)).data
    //   })
    this.setState({
      userInfo: this.context.userInfo,
    });
  };
  // Tag 작성 및 Tag popover
  createTag = (newTag) => {
    this.setState({ tags: this.state.tags.concat(newTag) });
  };
  handleTag = () => {
    console.log(this.state.tagModal);
    if (this.state.tagModal) {
      this.setState({ tagModal: false });
    } else {
      this.setState({ tagModal: true });
    }
  };

  render() {

    const ErrorMsg = () => {
      if (this.state.error) {
        return <Error>텍스트를 입력해주세요!</Error>;
      } else {
        return <Error>　</Error>;
      }
    };
    return (
      <Wrapper>
        <Top>
          <Chip
            size="medium"
            text={"/// " + this.state.w3w}
            onClick={this.getLocation}
          />
        </Top>
        <Container>
          <TextInput
            placeholder="당신의 추억을 새겨주세요"
            onTextChange={this.handleTextChange}
          />
          <ErrorMsg />
          <Bottom>
            <Switch
              locked={this.state.locked}
              changeSwitch={this.changeSwitch}
              color="primary"
              labelText={this.state.locked ? "비공개" : "공개"}
              labelPlacement="start"
            />
            <Tag>
              {this.state.tags.map((tag, i) => {
                return <Chip size="small" text={tag} key={i} />;
              })}
            </Tag>
          </Bottom>
        </Container>
        <CreateWrapper>
          <input
            type="file"
            hidden
            id="imgUpload"
            multiple
            accept="image/*"
            ref={this.inputReference}
            onChange={this.fileUploadInputChange}
          />
          <CreateImg onClick={this.fileUploadAction}>
            <PhotoIcon />
          </CreateImg>
          <CreateTag onClick={this.openPop}>
            <Popover
              id="tag-popover"
              open={this.state.popOpen}
              // anchorEl={anchorEl}
              onClose={this.popClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              The content of the Popover.
            </Popover>
            <LocalOfferIcon />
          </CreateTag>
          <CreateButton onClick={this.writePost}>
            <CreateIcon />
          </CreateButton>
        </CreateWrapper>
        <ImageWrapper>
          {this.state.imgBase64.map((img, i) => {
            return <ImgBalloon src={img} key={i} />;
          })}
        </ImageWrapper>
      </Wrapper>
    );
  }
}
export default WriteSaegim;
WriteSaegim.contextType = Storage;
const ImgBalloon = styled.img`
  width: 50px;
  height: 50px;
  border: 2px solid white;
  border-radius: 24px;
  margin: 0.5vw;
`;
const ImageWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  width: 80vw;
  margin-top: 4vh;
`;
const Error = styled.div`
  color: red;
  font-size: 10px;
  position: relative;
`;

const Wrapper = styled.div`
  position: absolute;
  top: 8vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const Container = styled.div`
  width: 80vw;
  padding: 8px;
  background-color: ghostwhite;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  border-radius: 16px;
`;
const Top = styled.div`
  margin: 4vh;
  justify-content: space-between;
  align-items: center;
  display: flex;
`;

const Bottom = styled.div`
  justify-content: space-between;
  align-items: center;
  display: flex;
`;

const CreateWrapper = styled.div`
  justify-content: flex-end;
  width: 80vw;
  flex-direction: row;
  align-items: center;
  display: flex;
  margin-top: 10px;
  border-radius: 16px;
`;
const CreateTag = styled(IconButton)`
  background: white;
  padding: 0.25em;
  margin-right: 10px;
  &:focus {
    background: lightgrey;
  }
`;

const CreateButton = styled(IconButton)`
  background: white;
  padding: 0.25em;
  &:focus {
    background: lightgrey;
  }
`;

const CreateImg = styled(IconButton)`
  background: white;
  padding: 0.25em;
  margin-right: 10px;
  &:focus {
    background: lightgrey;
  }
  &:active {
    background: lightgrey;
  }
`;

const Tag = styled(IconButton)`
  margin: none;
  padding: none;
  justify-content: center;
  align-items: center;
  display: flex;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 16px;
`;
