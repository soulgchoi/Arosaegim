import React, { Component } from "react";
import DefaultButton from "../common/buttons/DefaultButton";
import HugeButton from "../common/buttons/HugeButton";
import styled from "styled-components";

class Main extends Component {
  render() {
    return (
      <Wrapper>
        <div>Main! 제발 나와라!</div>
        <DefaultButton text="아님 솔지가 더 귀여움!😘" />
        <HugeButton text="솔지짱기여움!🥰"/>
      </Wrapper>
    );
  }
}
export default Main;

const Wrapper = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  width:100vw;
  height:100vh;
`

const Container = styled.div`
   display: flex;
   flex-direction:column;
   justify-content:center;
   align-items:center;
`

