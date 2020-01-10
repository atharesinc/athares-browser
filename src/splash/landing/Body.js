import React from 'reactn';
import { UserCheck, Zap, MessageCircle } from 'react-feather';

const Body = props => {
  return (
    <div className='dt-ns dt--fixed-ns sans-serif bg-white'>
      <div className='dtc-ns tc pv4'>
        <div className='tc'>
          <UserCheck
            className='br-100 h3 w3 dib ba b--black pa1 b--theme-blue'
            style={styles.icon}
          />
          <h1 className='f3 mb2'>Fair & Direct</h1>
          <h2 className='f5 fw4 gray mt0'>
            Individuals create and vote on laws without corruptible
            representatives.
            <br />
            Influence is proportional and equal.
          </h2>
        </div>
      </div>
      <div className='dtc-ns tc pv4'>
        <div className='tc'>
          <Zap
            className='br-100 h3 w3 dib ba b--black pa1 b--theme-blue'
            style={styles.icon}
          />
          <h1 className='f3 mb2'>Securely Performant</h1>
          <h2 className='f5 fw4 gray mt0'>
            Built on performance-optimized 'nano-blockchains'.
            <br />
            Governance blockchains are private between individuals. No syncing
            the entire blockchain.
          </h2>
        </div>
      </div>
      <div className='dtc-ns tc pv4'>
        <div className='tc'>
          <MessageCircle
            className='br-100 h3 w3 dib ba b--black pa1 b--theme-blue'
            icon='message-circle'
            style={styles.icon}
          />
          <h1 className='f3 mb2'>News & Chat</h1>
          <h2 className='f5 fw4 gray mt0'>
            Curated, crowd-sourced news platform alongside a full-featured
            communication platform.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Body;

const styles = {
  icon: {
    borderWidth: '0.25rem',
  },
};
