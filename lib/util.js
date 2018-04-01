

// ------------ EXTERNAL FUNCTION BEGIN ------------------

// return the user's level info given the user's current tucao number
// {level: NUM, name: string, medal: string}
function getUserLevel(tucaoNum, config) {
  const userLevels = config.dev_env.user_levels;
  const levelVals = userLevels.map(item => {
    return item.val;
  });
  const userMisc = userLevels.map(item => {
    return {
      name: item.name, medal: item.medal
    };
  });
  // the index of matched user level
  const level = getMatchedElem(tucaoNum, levelVals);
  const misc = userMisc[level];
  return {
    level: level,
    name: misc.name,
    medal: misc.medal
  };
}

// set the record dates: created and modified.
function setRecordDate(record) {
  const curDate = new Date();
  record.created = curDate;
  record.modified = curDate;
  return record;
}

// ------------ EXTERNAL FUNCTION END ------------------

// ------------ INTERNAL FUNCTION BEGIN ------------------

// TODO: handle e < 0 case.
function getMatchedElem(e, arr) {
  let index = arr.length - 1;  // initial value is the largest level's index
  for (let i = 0; i < arr.length; i++) {
    if (e < arr[i])
      return i - 1;
  }
  return index;
}

// ------------ INTERNAL FUNCTION END ------------------


module.exports = {
  getUserLevel,
  setRecordDate
};