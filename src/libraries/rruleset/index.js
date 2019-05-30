import {
  RecurringType,
  ParsedRecurring,
  EventInput,
  refineProps,
  DateEnv,
  DateRange,
  DateMarker,
  createDuration,
  createPlugin
} from '@fullcalendar/core';

import { RRule, RRuleSet, rrulestr} from 'rrule';
import _ from 'lodash';

const EVENT_DEF_PROPS = {
  rruleSet: null,
  duration: createDuration
}

let recurring = {
  parse: function (rawEvent, leftoverProps, dateEnv) {
    if (rawEvent.rruleSet != null) {
        var props = refineProps(rawEvent, EVENT_DEF_PROPS, {}, leftoverProps);
        var parsed = parseRRuleSet(props.rruleSet, dateEnv);
        if (parsed) {
            return {
                typeData: parsed.rruleSet,
                allDayGuess: parsed.allDayGuess,
                duration: props.duration
            };
        }
    }
    return null;
  },
  expand: function (rruleSet, framingRange) {
    return rruleSet.all();
  }
}

export default createPlugin({
  recurringTypes: [ recurring ]
})

function parseRRuleSet(input, dateEnv) {
    var allDayGuess = null;
    let rruleSet;
    if (typeof input === 'string') {
        rruleSet = rrulestr(input);
    } else if (typeof input === 'object' && input) { // non-null object
        var refined = _.assign({}, input); // copy
        const excludes = refined.exrules;
        delete refined.exrules;
        if (typeof refined.dtstart === 'string') {
            var dtstartMeta = dateEnv.createMarkerMeta(refined.dtstart);
            if (dtstartMeta) {
                refined.dtstart = dtstartMeta.marker;
                allDayGuess = dtstartMeta.isTimeUnspecified;
            }
            else {
                delete refined.dtstart;
            }
        }
        if (typeof refined.until === 'string') {
            refined.until = dateEnv.createMarker(refined.until);
        }
        if (refined.freq != null) {
            refined.freq = convertConstant(refined.freq);
        }
        if (refined.wkst != null) {
            refined.wkst = convertConstant(refined.wkst);
        }
        else {
            refined.wkst = (dateEnv.weekDow - 1 + 7) % 7; // convert Sunday-first to Monday-first
        }
        if (refined.byweekday != null) {
            refined.byweekday = convertConstants(refined.byweekday); // the plural version
        }
        rruleSet = new RRuleSet(true);
        rruleSet.rrule(new RRule(refined));

        if (Array.isArray(excludes) && excludes.length > 0) {
          for (var i = excludes.length - 1; i >= 0; i--) {
            rruleSet.exdate(new Date(excludes[i]));
          }
        }
    }
    if (rruleSet) {
        return { rruleSet, allDayGuess: allDayGuess };
    }
    return null;
}

function convertConstants(input) {
  if (Array.isArray(input)) {
      return input.map(convertConstant);
  }
  return convertConstant(input);
}

function convertConstant(input) {
  if (typeof input === 'string') {
      return RRule[input.toUpperCase()];
  }
  return input;
}