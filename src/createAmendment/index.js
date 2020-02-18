import React, { useState, useEffect, useGlobal, withGlobal } from 'reactn';
import ErrorSwap from '../utils/ErrorSwap';
import AtharesLoader from '../components/AtharesLoader';
import { withRouter, Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { ChevronLeft } from 'react-feather';
import swal from 'sweetalert';
import sha from 'simple-hash-browser';
import { graphql } from 'react-apollo';
import compose from 'lodash.flowright';
import { CREATE_REVISION, CREATE_VOTE } from '../graphql/mutations';
import {
  GET_AMENDMENTS_FROM_CIRCLE_ID,
  DOES_AMENDMENT_EXIST,
} from '../graphql/queries';
import { parseDate } from '../utils/transform';
import { addSeconds } from 'date-fns';

function CreateAmendment({ activeCircle, ...props }) {
  const [name, setName] = useState('');
  const [amendment, setAmendment] = useState('');
  const [isTaken, setIsTaken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [user] = useGlobal('user');

  const [, setActiveRevision] = useGlobal('activeRevision');

  useEffect(() => {
    function componentMount() {
      if (!user || !activeCircle) {
        props.history.replace('/app');
      }
    }

    componentMount();
  }, [user, activeCircle, props.history]);

  const back = () => {
    props.history.push('/app');
  };

  const updateName = e => {
    setName(e.target.value.substring(0, 51));
    setIsTaken(false);
  };
  const updateAmend = e => {
    setAmendment(e.target.innerText);
  };
  // the longest a revision must persist before votes are counted is 7 days ( many users), the shortest is about 30 seconds (1 user)
  // add this number of seconds to the createdAt time to determine when a revision should expire, where x is the number of users
  const customSigm = x => {
    return 604800 / (1 + Math.pow(Math.E, -1 * (x - 10))) / 2;
  };
  // a minimum number of users in a circle must have voted on a revision to ratify it
  // this prevents someone from sneaking in a revision where only one person votes to support and no one rejects it
  const ratifiedThreshold = n => {
    return 0.4 / (1 + Math.pow(Math.E, -1 * n * 0.2));
  };
  const onSubmit = async e => {
    console.log('submit');
    e.preventDefault();
    // validate & trim fields
    // ???

    setLoading(true);

    let {
      data: { circle },
    } = props;

    console.log(circle);
    let numUsers = circle.users.items.length;

    try {
      // make sure this circle doesnt already have an amendment by the same name
      console.log('breakpoint 1');
      const res = await props.doesAmendmentExistInCircle.refetch({
        circleId: activeCircle,
        title: name,
      });

      console.log('breakpoint 2', res);

      if (res.errors) {
        throw new Error(res.errors[0]);
      }

      const {
        data: {
          amendmentsList: { items: amendments },
        },
      } = res;

      console.log('breakpoint 3');

      if (amendments.length !== 0) {
        setIsTaken(true);
        return false;
      }

      console.log('breakpoint 4');

      // make sure the amendment isn't empty
      if (amendment.trim() === '') {
        setIsEmpty(true);
        return false;
      }

      console.log('breakpoint 5');

      let newRevision = {
        circle: activeCircle,
        user: user,
        title: name,
        newText: amendment.trim(),
        expires: parseDate(
          addSeconds(new Date(), Math.max(customSigm(numUsers), 61)),
        ),

        voterThreshold: Math.round(
          numUsers * ratifiedThreshold(numUsers),
        ).toString(),
        repeal: false,
      };

      let hash = await sha(
        JSON.stringify({
          title: newRevision.title,
          text: newRevision.newText,
          circle: newRevision.circle,
          expires: newRevision.expires,
          voterThreshold: newRevision.voterThreshold,
        }),
      );

      newRevision = {
        ...newRevision,
        hash,
      };

      console.log('breakpoint 6', newRevision);

      let newRevisionRes = await props.createRevision({
        variables: {
          ...newRevision,
        },
      });

      console.log('breakpoint 7', newRevisionRes);

      newRevision.id = newRevisionRes.data.revisionCreate.id;

      const newVote = {
        revision: newRevision.id,
        user: user,
        support: true,
      };

      await props.createVote({
        variables: {
          ...newVote,
        },
      });

      console.log('breakpoint 8');

      setActiveRevision(newRevision.id);
      setLoading(false);
      props.history.push(
        `/app/circle/${activeCircle}/revisions/${newRevision.id}`,
      );
    } catch (err) {
      setLoading(false);
      if (
        !err.message.includes('unique constraint would be violated') ||
        !err.message.includes('hash')
      ) {
        swal(
          'Error',
          'There was an error connecting to the Athares network. Please try again later.',
          'error',
        );
      }
      console.error(new Error(err));
    }
  };

  let { data: { circle, loading: loadingData } = {} } = props;
  if (loading || loadingData) {
    return (
      <div
        id='dashboard-wrapper'
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AtharesLoader />
      </div>
    );
  } else if (activeCircle && circle) {
    return (
      <div id='revisions-wrapper'>
        <div className='flex ph2 h10'>
          <Link to='/app' className='flex justify-center items-center'>
            <ChevronLeft className='white db dn-l' onClick={back} />
          </Link>
          <h2 className='ma3 lh-title white'>Create Amendment</h2>
        </div>
        <Scrollbars style={{ height: '85vh', width: '100%' }}>
          <form className='pa2 pa4-ns white wrapper' onSubmit={onSubmit}>
            <article className='cf'>
              <time className='f7 ttu tracked white-80'>
                Draft a new piece of legislation for {circle.name}
              </time>
              <div className='fn mt4'>
                <div className='measure mb4'>
                  <label htmlFor='name' className='f6 b db mb2'>
                    Name
                  </label>
                  <input
                    id='name'
                    className='input-reset ba pa2 mb2 db w-100 ghost'
                    type='text'
                    aria-describedby='name-desc'
                    required
                    value={name}
                    onChange={updateName}
                  />
                  <ErrorSwap
                    condition={!isTaken}
                    normal={
                      <small id='name-desc' className='f6 white-80 db mb2'>
                        Provide a name for your new amendment.
                      </small>
                    }
                    error={
                      <small id='name-desc' className='f6 red db mb2'>
                        Amendment name must be unique to this Circle
                      </small>
                    }
                  />
                </div>
                <div className='mv4'>
                  <label htmlFor='comment' className='f6 b db mb2'>
                    Amendment
                  </label>
                  <Scrollbars
                    style={{
                      maxHeight: '11.5rem',
                      width: '100%',
                    }}
                    autoHeight
                    className='ghost mb2'
                  >
                    <div
                      contentEditable={true}
                      className={`f6 amendment-text editableText`}
                      onInput={updateAmend}
                      value={amendment}
                      suppressContentEditableWarning
                    />
                  </Scrollbars>
                  <ErrorSwap
                    condition={!isEmpty}
                    normal={
                      <small id='comment-desc' className='f6 white-80'>
                        Draft your amendment. What do you want to add to your
                        government?
                      </small>
                    }
                    error={
                      <small id='name-desc' className='f6 red db mb2'>
                        You can't submit an empty amendment.
                      </small>
                    }
                  />
                </div>
              </div>
            </article>
            <div id='comment-desc' className='f6 white-80'>
              Pressing "Draft Amendment" will create a new revision for this
              amendment. Drafts must first be ratified by a minimum electorate
              of Circle members, and then must be approved with a majority of
              votes. Amendment drafts are publicly accessible, but can be
              removed by the owner at any point before ratification.
            </div>
            {amendment.trim() !== '' && !isTaken && (
              <button
                id='create-circle-button'
                className='btn mt4'
                type='submit'
              >
                Draft Amendment
              </button>
            )}
          </form>
        </Scrollbars>
      </div>
    );
  }
}

export default withGlobal(({ activeCircle }) => ({ activeCircle }))(
  compose(
    graphql(DOES_AMENDMENT_EXIST, {
      name: 'doesAmendmentExistInCircle',
      options: ({ activeCircle }) => ({
        variables: {
          circleId: activeCircle,
          title: '',
        },
      }),
    }),
    graphql(CREATE_REVISION, { name: 'createRevision' }),
    graphql(CREATE_VOTE, { name: 'createVote' }),
    graphql(GET_AMENDMENTS_FROM_CIRCLE_ID, {
      options: ({ activeCircle }) => ({
        variables: {
          id: activeCircle,
        },
      }),
    }),
  )(withRouter(CreateAmendment)),
);
