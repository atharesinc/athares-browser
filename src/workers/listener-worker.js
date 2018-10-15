/*
* This worker basically does some tedious data cleaning and processing of newly updated gun data
* Since we can't put the whole gun object in here, passing the changed data to be cleaned and then back to App.js is as good as we cna get for now
* This may not improve load times but at the least it will prevent the UI from being unresponsive
*/

export default () => {

// function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

    self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
        if(!e){
        	return;
        }
        var obj = e.data;
        var channels = [];
        var messages = [];
        var amendments = [];
        var revisions = [];
        var votes = [];

        if (obj.list) {

            // strip out the other data from these circles
            var otherObj = {
                list: []
            };

            otherObj.list = obj.list.map(function (c) {
                return {
                    id: c.id,
                    icon: c.icon,
                    name: c.name,
                    preamble: c.preamble,
                    createdAt: c.createdAt,
                    updatedAt: c.updatedAt,
                    users: Object.keys(c.users)
                };
            });

            // get all data from this circle
            obj.list.forEach(function (circle) {
                // get the channels and messages
                if (circle.channels) {
                    var theseChannels = Object.values(circle.channels);
                    theseChannels.forEach(function (chan) {
                        if (chan.messages) {
                            // strip out messages from channel data
                            var theseMessages = chan.messages,
                                thisChan = _objectWithoutProperties(chan, ['messages']);

                            channels.push(thisChan);

                            theseMessages = Object.values(theseMessages);
                            messages = messages.concat(theseMessages);
                        } else {
                            channels.push(chan);
                        }
                    });
                }
                // get other stuff like amendments and revisions
                if (circle.amendments) {
                    amendments = amendments.concat(Object.values(circle.amendments)).filter(function (a) {
                        return a !== null;
                    });
                }
                if (circle.revisions) {
                    var theseRevisions = Object.values(circle.revisions);
                    theseRevisions.forEach(function (rev) {
                        if (rev.votes) {
                            // strip out votes from revision data
                            var theseVotes = rev.votes,
                                thisRev = _objectWithoutProperties(rev, ['votes']);

                            revisions.push(thisRev);

                            theseVotes = Object.values(theseVotes);
                            votes = votes.concat(theseVotes);
                        } else {
                            revisions.push(rev);
                        }
                    });
                }
            });
            let res = {
                circles: otherObj,
                messages: messages,
                revisions: revisions,
                amendments: amendments,
                channels: channels,
                votes: votes
            };
            postMessage(res);
        } else {
            // a single node has changed
            // this captures some updates that obj.list doesn't capture
            var _otherObj = {
                node: {
                    id: obj.node.id,
                    icon: obj.node.icon,
                    name: obj.node.name,
                    premable: obj.node.preamble,
                    createdAt: obj.node.createdAt,
                    updatedAt: obj.node.updatedAt,
                    users: Object.keys(obj.node.users)
                }
            };
            var circle = obj.node;
            // get the channels and messages
            if (circle.channels) {
                var theseChannels = Object.values(circle.channels);
                // channels = [...channels, ...theseChannels];
                theseChannels.forEach(function (chan) {
                    if (chan) {
                        if (chan.messages) {
                            // strip out messages from channel data
                            var theseMessages = chan.messages,
                                thisChan = _objectWithoutProperties(chan, ['messages']);

                            channels.push(thisChan);

                            theseMessages = Object.values(theseMessages);
                            messages = messages.concat(theseMessages);
                        } else {
                            channels.push(chan);
                        }
                    }
                });
            }
            // get other stuff like amendments and revisions
            if (circle.amendments) {
                amendments = amendments.concat(Object.values(circle.amendments)).filter(function (a) {
                    return a !== null;
                });
            }
            if (circle.revisions) {
                var theseRevisions = Object.values(circle.revisions);
                theseRevisions.forEach(function (rev) {
                    if (rev.votes) {
                        // strip out votes from revision data
                        var theseVotes = rev.votes,
                            thisRev = _objectWithoutProperties(rev, ['votes']);

                        revisions.push(thisRev);

                        theseVotes = Object.values(theseVotes);
                        votes = votes.concat(theseVotes);
                    } else {
                        revisions.push(rev);
                    }
                });
            }
            let res = {
                circles: _otherObj,
                messages: messages,
                revisions: revisions,
                amendments: amendments,
                channels: channels,
                votes: votes
            };
            postMessage(res);
        }
    });
}

// the above is transpiled from reasonable ES2015/ES6 like so
// let obj = e.data;
//             let channels = [];
//             let messages = [];
//             let amendments = [];
//             let revisions = [];
//             let votes = [];

//             if (obj.list) {
//                 // strip out the other data from these circles
//                 let otherObj = {
//                     list: []
//                 };

//                 otherObj.list = obj.list.map(c => ({
//                     id: c.id,
//                     icon: c.icon,
//                     name: c.name,
//                     preamble: c.preamble,
//                     createdAt: c.createdAt,
//                     updatedAt: c.updatedAt,
//                     users: Object.keys(c.users)
//                 }));

//                 // get all data from this circle
//                 obj.list.forEach(circle => {
//                     // get the channels and messages
//                     if (circle.channels) {
//                         let theseChannels = Object.values(circle.channels);
//                         theseChannels.forEach(chan => {
//                             if (chan.messages) {
//                                 // strip out messages from channel data
//                                 let {
//                                     messages: theseMessages,
//                                     ...thisChan
//                                 } = chan;
//                                 channels.push(thisChan);

//                                 theseMessages = Object.values(theseMessages);
//                                 messages = messages.concat(theseMessages);
//                             } else {
//                                 channels.push(chan);
//                             }
//                         });
//                     }
//                     // get other stuff like amendments and revisions
//                     if (circle.amendments) {
//                         amendments = amendments.concat(Object.values(circle.amendments)).filter(a => a !== null);
//                     }
//                     if (circle.revisions) {
//                         let theseRevisions = Object.values(circle.revisions);
//                         theseRevisions.forEach(rev => {
//                             if (rev.votes) {
//                                 // strip out votes from revision data
//                                 let { votes: theseVotes, ...thisRev } = rev;
//                                 revisions.push(thisRev);

//                                 theseVotes = Object.values(theseVotes);
//                                 votes = votes.concat(theseVotes);
//                             } else {
//                                 revisions.push(rev);
//                             }
//                         });
//                     }
//                 });
//                 return {
//                 	circles: otherObj,
//                 	messages,
//                 	revisions,
//                 	amendments,
//                 	messages,
//                 	channels,
//                 	votes
//                 }
//             } else {
//                 // a single node has changed
//                 // this captures some updates that obj.list doesn't capture
//                 let otherObj = {
//                     node: {
//                         id: obj.node.id,
//                         icon: obj.node.icon,
//                         name: obj.node.name,
//                         premable: obj.node.preamble,
//                         createdAt: obj.node.createdAt,
//                         updatedAt: obj.node.updatedAt,
//                         users: Object.keys(obj.node.users)
//                     }
//                 };
//                 let circle = obj.node;
//                 // get the channels and messages
//                 if (circle.channels) {
//                     let theseChannels = Object.values(circle.channels);
//                     // channels = [...channels, ...theseChannels];
//                     theseChannels.forEach(chan => {
//                     	if(chan){
//                         if (chan.messages) {
//                             // strip out messages from channel data
//                             let { messages: theseMessages, ...thisChan } = chan;
//                             channels.push(thisChan);

//                             theseMessages = Object.values(theseMessages);
//                             messages = messages.concat(theseMessages);
//                         } else {
//                             channels.push(chan);
//                         }
//                     }
//                     });
//                 }
//                 // get other stuff like amendments and revisions
//                 if (circle.amendments) {
//                    amendments = amendments.concat(Object.values(circle.amendments)).filter(a => a !== null);
//                 }
//                 if (circle.revisions) {
//                     let theseRevisions = Object.values(circle.revisions);
//                     theseRevisions.forEach(rev => {
//                         if (rev.votes) {
//                             // strip out votes from revision data
//                             let { votes: theseVotes, ...thisRev } = rev;
//                             revisions.push(thisRev);

//                             theseVotes = Object.values(theseVotes);
//                             votes = votes.concat(theseVotes);
//                         } else {
//                             revisions.push(rev);
//                         }
//                     });
//                 }
//                 return {
//                 	circles: otherObj,
//                 	messages,
//                 	revisions,
//                 	amendments,
//                 	messages,
//                 	channels,
//                 	votes
//                 }
//             }