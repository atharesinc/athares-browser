import React, { useState, useEffect, withGlobal } from "reactn";
import { GET_CIRCLE_NOTICES } from "../graphql/queries";
import CircleNotice from "./CircleNotice";
import { graphql } from "react-apollo";
import Scrollbars from "react-custom-scrollbars";
import ReactDOM from "react-dom";

function NoticeBoard(props) {
  const [wrapperHeight, setWrapperHeight] = useState(300);
  // useEffect(() => {
  // componentMount();
  // }, []);

  // const componentMount = () => {
  //   let wrapper = ReactDOM.findDOMNode(this).getBoundingClientRect();

  //   wrapper && setWrapperHeight(window.innerHeight - wrapper.top);
  // };

  const {
    loading,
    error,
    data: { Circle }
  } = props;
  if (error) {
    return (
      <div className="bg-white-10 pv3 w-100 ph4 ttu tracked tc">
        Unable to reach news server
      </div>
    );
  }
  if (loading) {
    return (
      <div className="bg-white-10 pv3 w-100 ph4 ttu tracked tc">
        Fetching News...
      </div>
    );
  }
  if (Circle && Circle.notices.length !== 0) {
    return (
      <Scrollbars
        id="circle-news-wrapper"
        style={{
          width: "100%",
          height: wrapperHeight
        }}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        universal={true}
      >
        {Circle.notices.map(notice => (
          <CircleNotice key={notice.id} notice={notice} />
        ))}
      </Scrollbars>
    );
  }
  return (
    <div className="bg-white-10 pv3 w-100 ph4 ttu tracked tc">
      No news available
    </div>
  );
}

export default withGlobal(({ activeCircle }) => ({ activeCircle }))(
  graphql(GET_CIRCLE_NOTICES, {
    options: ({ activeCircle }) => ({ variables: { id: activeCircle || "" } })
  })(NoticeBoard)
);
