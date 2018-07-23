import React from 'react';
import FeatherIcon from 'feather-icons-react';
import { Scrollbars } from 'react-custom-scrollbars';

const ViewUser = (props) => {
  return (
    <div id="dashboard-wrapper">
      <div className="particles-bg w-100 vignette shaded">
        <header className="tc pv2 pv4-ns" style={{ height: '12em' }}>
          <div className="w-100 row-center" style={{ justifyContent: 'space-between' }} />
          <h1 className="f4 f3-ns fw6 white">Ehrlich Bachman</h1>
          <div
            className="br-100 pa1 br-pill ba bw2 w4 h4 center"
            style={{
              background: 'url(https://assets3.thrillist.com/v1/image/1734098/size/tmg-article_default_mobile.jpg) center no-repeat',
              backgroundSize: 'cover'
            }}
          />
        </header>
        <a target="__blank" href="https://www.flickr.com/photos/becca02/6727193557">
          <FeatherIcon icon="info" className="h2 w2 white-30 hover-white ma1 pa1" />
        </a>
      </div>
      {/* user info */}
      <Scrollbars style={{ width: '100%', height: '100%' }} autoHide autoHideTimeout={1000} autoHideDuration={200} universal={true}>

        <ul className="list ph4 pv2 ma2 w-100 center">
          <h1>Info</h1>
          <li className="flex items-center lh-copy pa3 ph0-l bb b--white-30">
            <FeatherIcon className="w2 h2 w2-ns h2-ns pa1" icon="phone" />
            <div className="pl3 flex-auto">
              <span className="f6 db white-70">Phone</span>
            </div>
            <div>
              <div className="f6 link white-70">+1 (999) 555-5555</div>
            </div>
          </li>
          <li className="flex items-center lh-copy pa3 ph0-l bb b--white-30">
            <FeatherIcon className="w2 h2 w2-ns h2-ns pa1" icon="at-sign" />
            <div className="pl3 flex-auto">
              <span className="f6 db white-70">Email</span>
            </div>
            <div>
              <div className="f6 link white-70">ehbachman@avia.to</div>
            </div>
          </li>
          <li className="flex items-center lh-copy pa3 ph0-l bb b--white-30">
            <FeatherIcon className="w2 h2 w2-ns h2-ns pa1" icon="link" />
            <div className="pl3 flex-auto">
              <span className="f6 db white-70">Unique Name</span>
            </div>
            <div>
              <div className="f6 link white-70">ehrlich.bachman.1</div>
            </div>
          </li>
        </ul>
        {/* Fat Stats */}
        <article className="ph4 pv2" data-name="slab-stat">
          <h1>Statistics</h1>
          <dl className="dib mr5">
            <dd className="f6 f5-ns b ml0 white-70">Circles</dd>
            <dd className="f4 f3-ns b ml0">10</dd>
          </dl>
          <dl className="dib mr5">
            <dd className="f6 f5-ns b ml0 white-70">Revisions Proposed</dd>
            <dd className="f4 f3-ns b ml0">993</dd>
          </dl>
          <dl className="dib mr5">
            <dd className="f6 f5-ns b ml0 white-70">Revisions Accepted</dd>
            <dd className="f4 f3-ns b ml0">15</dd>
          </dl>
          <dl className="dib mr5">
            <dd className="f6 f5-ns b ml0 white-70">Times Voted</dd>
            <dd className="f4 f3-ns b ml0">4</dd>
          </dl>
          <dl className="dib mr5">
            <dd className="f6 f5-ns b ml0 white-70">User Since</dd>
            <dd className="f4 f3-ns b ml0">{new Date().toLocaleString()}</dd>
          </dl>
        </article>
      </Scrollbars>
    </div>
  );
};

export default ViewUser;
