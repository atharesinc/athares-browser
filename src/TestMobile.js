import React, { Component, Fragment } from "react";
import Channels from "./app/channels";
import FeatherIcon from "feather-icons-react";
import { Scrollbars } from "react-custom-scrollbars";
import { Switch, Route } from "react-router-dom";
import TopNav from "./app/mobile/TopNav";
import Circles from "./app/mobile/Circles";
import BottomNav from "./app/mobile/BottomNav";

const MobileTest = props => {
  return (
    <div>
      <TopNav />
      <Switch>
        <Route component={CirclesAndChannels} />
      </Switch>
    </div>
  );
};

export default MobileTest;

const CirclesAndChannels = () => (
  <Fragment>
    <Circles circles={circles} activeCircle={"87a6sd9f87"} />
    <Channels />
    <BottomNav />
  </Fragment>
);

// const TopNav = props => (
//   <div
//     className="w-100 v-mid bg-theme-dark flex flex-row justify-between items-center pv2 ph3"
//     style={{ height: "3em" }}
//   >
//     <img
//       src={window.location.origin + "/img/user-default.png"}
//       className="ba b--white br-100 w2 h2 bw1"
//       alt="Menu"
//     />

//     <FeatherIcon
//       icon="search"
//       className="white w2 h2"
//       style={{ height: "1.5em", width: "1.5em" }}
//     />
//   </div>
// );

// const Circles = props => {
//   const setActive = () => {};
//   return (
//     <div
//       className="w-100 v-mid bg-theme-dark flex flex-row justify-between items-center pv2 ph3"
//       style={{ height: "3em" }}
//     >
//       <FeatherIcon
//         icon="plus-circle"
//         className="white w2 h2 mr2"
//         style={{ height: "1.5em", width: "1.5em" }}
//       />
//       <Scrollbars
//         style={{ width: "80vw", height: "100%" }}
//         autoHide
//         autoHideTimeout={1000}
//         autoHideDuration={200}
//         universal={true}
//       >
//         <div className="flex flex-row justify-between items-center">
//           {circles.map(circle => (
//             <Circle
//               key={circle.id}
//               {...circle}
//               isActive={circle.id === props.activeCircle}
//               selectCircle={setActive}
//             />
//           ))}
//         </div>
//       </Scrollbars>
//     </div>
//   );
// };
// const Circle = ({ id, name, icon, selectCircle, isActive }) => {
//   return (
//     <img
//       src={icon}
//       className="br-100 w2 h2 bw1 mh1"
//       alt=""
//       data-circle-id={id}
//       data-circle-name={name}
//       onClick={() => {
//         selectCircle(id);
//       }}
//     />
//   );
// };

// const BottomNav = props => (
//   <div
//     className="w-100 v-mid bg-theme-dark flex flex-row justify-start items-center pv2 ph3"
//     style={{ height: "3em" }}
//   >
//     <FeatherIcon
//       icon="plus"
//       className="white w2 h2 mr3"
//       style={{ height: "1.5em", width: "1.5em" }}
//     />
//     <div className="white">Invite User</div>
//   </div>
// );

let circles = [
  {
    id: "87a6sd9f87",
    name: "Mars",
    icon: "./img/Athares-logo-small-white.png"
  },
  {
    id: "8a7sf6987a6f",
    name: "Mars",
    icon: "./img/Athares-logo-small-white.png"
  },
  {
    id: "87z64xc6b536z",
    name: "Mars",
    icon: "./img/Athares-logo-small-white.png"
  },
  {
    id: "53x25c34",
    name: "Mars",
    icon: "./img/Athares-logo-small-white.png"
  },
  {
    id: "65bxc65465",
    name: "Mars",
    icon: "./img/Athares-logo-small-white.png"
  },
  {
    id: "0a9s8df098a",
    name: "Mars",
    icon: "./img/Athares-logo-small-white.png"
  },
  {
    id: "sdf89b7698",
    name: "Mars",
    icon: "./img/Athares-logo-small-white.png"
  },
  {
    id: "c5v65b65",
    name: "Mars",
    icon: "./img/Athares-logo-small-white.png"
  }
];
