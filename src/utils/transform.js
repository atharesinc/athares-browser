import moment from "moment";

export function insertBreaks(messages = []) {
  if (messages.length === 0) {
    return [];
  }
  let newArr = [];

  const parsed = "dddd, MMMM Do";
  let mostRecentDay = moment(messages[messages.length - 1].createdAt).format(
    parsed
  );

  for (let i = messages.length - 1; i > 0; i -= 1) {
    const thisDay = moment(messages[i].createdAt).format(parsed);
    let shortArr = [];
    if (thisDay !== mostRecentDay) {
      shortArr.push({
        date: mostRecentDay,
        id: messages[i].id + "-" + mostRecentDay,
        user: {
          id: ""
        }
      });

      mostRecentDay = moment(messages[i].createdAt).format(parsed);
    }
    shortArr.push(messages[i]);
    newArr = [...shortArr, ...newArr];
  }

  // add the oldest day
  newArr.splice(0, 0, {
    date: mostRecentDay,
    id: messages[0].id + "-" + mostRecentDay,
    user: {
      id: ""
    }
  });
  return newArr;
}
