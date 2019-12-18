import React from "reactn";
import moment from "moment";

const CircleNotice = ({ notice }) => (
  <div
    className="bg-white-10 pv3 w-100 ph2 pa4-ns bb b--white-70"
    key={notice.id}
  >
    <div className="f4 f5-ns white mv2">{notice.title}</div>
    <div className="f7 white-50 mb3">{moment(notice.createdAt).fromNow()}</div>
    <div className="f6 white-80 mb2" style={{ whiteSpace: "pre-line" }}>
      {notice.text}
    </div>
  </div>
);

export default CircleNotice;
