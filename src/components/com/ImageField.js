import React, { Component } from "react";
import styled from "styled-components";
import { URL_S3 } from "../../constants";
const Container = styled.div`
  /* background: linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%); */
  border: 0;
  border-radius: 8px !important;
  minwidth: 250px !important;
  width:calc(100% - 30px)!importantheight: auto !important;
  overflow: hidden;
  padding: 0px !important;
  margin: 10px !important;

  box-shadow: 0 3px 5px 2px rgba(220, 220, 220, 0.3);
  & .image-bg {
    width: 100%;
    height: 200px !important;
    /* background-size: cover !important; */
    background-repeat: no-repeat !important;
    background-position: center center !important;
  }
`;

export default class ImageField extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    image: null
  };
  componentDidMount() {
    //alert(JSON.stringify(this.props));
  }
  componentWillMount() {
    let { value, record, source } = this.props;

    this.setState({
      image: value || record ? record[source] : null
    });
  }
  componentWillReceiveProps(nextProps) {
    let { source, record = {}, value } = nextProps;
    let { image } = this.state;
    if (value !== image) {
      this.setState({
        image: value || record[source]
      });
    }
  }
  render() {
    let { image } = this.state;
    return (
      <>
        {image && (
          <Container className="image-container">
            <div
              className="image-bg"
              style={{
                background: `url(https://appartaapp.s3.amazonaws.com/users/1/avatarplaceholder.png)`,
                backgroundSize: "contain"
              }}
            />
          </Container>
        )}
      </>
    );
  }
}
