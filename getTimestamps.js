const MAX_TIME = 20;
const SENTENCE_TERMINATORS = /[.;\?!]/;

class StartEnd {
  constructor(timestamps) {
    this.start = timestamps[0].start;
    this.end   = timestamps[timestamps.length-1].end;
  }

  get duration() {
    return this.end - this.start;
  }
}

function getTimestamps(timestamps, keywords) {
  let results       = [],
      totalDuration = 0;
  
  for (let i = 0; i < keywords.length; i++) {
    if (totalDuration > MAX_TIME) break;

    let index              = -1,
        includedTimestamps = [];

    for (let j = 0; j < timestamps.length; j++) {
      if (timestamps[j].keywordInText(keywords[i])) {
        index = j;
        break;
      }
    }

    if (index === -1) continue;
    
    includedTimestamps.push(timestamps[index]);
    index++;

    while (index < timestamps.length) {
      includedTimestamps.push(timestamps[index]);
      if (SENTENCE_TERMINATORS.test(timestamps[index].text)) break;
      index++;
    }

    results.push(new StartEnd(includedTimestamps));
    totalDuration += results[results.length-1].duration;
  }
  
  return results;
}

module.exports = getTimestamps;
